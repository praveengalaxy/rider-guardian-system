const { sendEmergencyEmail } = require('./emailService');
const { sendEmergencySMS } = require('./smsService');

// In-memory store for pending notifications (in real app, use database)
let pendingNotifications = new Map();

// Emergency contact data (in real app, get from database)
let emergencyContacts = [
  {
    id: '1',
    name: 'Emergency Contact',
    relationship: 'Primary',
    phone: '+918660825177', // Replace with your actual phone number
    email: 'praveen.hebbal2004@gmail.com', // Using your email for testing
    isPrimary: true
  }
];

// Function to update emergency contact
const updateEmergencyContact = (updatedContact) => {
  emergencyContacts = emergencyContacts.map(contact => 
    contact.id === updatedContact.id ? updatedContact : contact
  );
  console.log('Emergency contact updated:', updatedContact);
};

const getPrimaryContact = () => {
  return emergencyContacts.find(contact => contact.isPrimary) || emergencyContacts[0];
};

const createEmergencyEvent = (sensorData) => {
  const events = [];
  
  // Only send notifications for CRITICAL emergencies
  if (sensorData.crashAlert) {
    events.push({
      id: `crash_${Date.now()}`,
      type: 'CRASH_DETECTED',
      severity: 'CRITICAL',
      message: 'Vehicle crash detected!',
      data: sensorData,
      timestamp: Date.now()
    });
  }
  
  if (sensorData.alcoholAlert) {
    events.push({
      id: `alcohol_${Date.now()}`,
      type: 'ALCOHOL_DETECTED',
      severity: 'HIGH',
      message: 'High alcohol level detected',
      data: sensorData,
      timestamp: Date.now()
    });
  }
  
  if (sensorData.rashAlert) {
    events.push({
      id: `rash_${Date.now()}`,
      type: 'RASH_DRIVING',
      severity: 'HIGH',
      message: 'Rash driving detected',
      data: sensorData,
      timestamp: Date.now()
    });
  }
  
  // Other alerts (helmet, heart rate) will still show in dashboard
  // but won't trigger email/SMS notifications
  
  return events;
};

const sendEmergencyNotifications = async (eventId) => {
  const event = pendingNotifications.get(eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  
  const primaryContact = getPrimaryContact();
  
  try {
    // Send both email and SMS
    const emailResult = await sendEmergencyEmail(primaryContact, event);
    const smsResult = await sendEmergencySMS(primaryContact, event);
    
    // Remove from pending notifications
    pendingNotifications.delete(eventId);
    
    return {
      success: true,
      email: emailResult,
      sms: smsResult,
      contact: {
        name: primaryContact.name,
        email: primaryContact.email,
        phone: primaryContact.phone
      }
    };
  } catch (error) {
    console.error('Failed to send emergency notifications:', error);
    throw error;
  }
};

const getPendingNotifications = () => {
  return Array.from(pendingNotifications.values());
};

const addPendingNotification = (event) => {
  pendingNotifications.set(event.id, event);
};

const removePendingNotification = (eventId) => {
  pendingNotifications.delete(eventId);
};

module.exports = {
  createEmergencyEvent,
  sendEmergencyNotifications,
  getPendingNotifications,
  addPendingNotification,
  removePendingNotification,
  getPrimaryContact,
  updateEmergencyContact
}; 
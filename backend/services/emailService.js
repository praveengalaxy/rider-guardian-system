const nodemailer = require('nodemailer');
const axios = require('axios');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'praveen.hebbal2004@gmail.com',
    pass: 'hdfn qbscchaudghc'
  }
});

async function getLocationName(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await axios.get(url, { headers: { 'User-Agent': 'rider-guardian-system' } });
    return response.data.display_name || `${lat}, ${lon}`;
  } catch (err) {
    return `${lat}, ${lon}`;
  }
}

const sendEmergencyEmail = async (contact, eventData) => {
  const lat = eventData.data.LAT;
  const lon = eventData.data.LON;
  const locationName = await getLocationName(lat, lon);
  const mailOptions = {
    from: 'praveen.hebbal2004@gmail.com',
    to: contact.email,
    subject: `🚨 EMERGENCY ALERT: ${eventData.type}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #ff4444; border-radius: 10px; background-color: #fff5f5;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #ff4444; margin: 0;">🚨 EMERGENCY ALERT</h1>
          <h2 style="color: #333; margin: 10px 0;">Rider Guardian System</h2>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #ff4444; margin-top: 0;">Emergency Details:</h3>
          <p><strong>Event Type:</strong> ${eventData.type}</p>
          <p><strong>Alert Message:</strong> ${eventData.message}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Location:</strong> ${locationName}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Sensor Data:</h3>
          <p><strong>Speed:</strong> ${eventData.data.velocity || 'N/A'} km/h</p>
          <p><strong>Heart Rate:</strong> ${eventData.data.HEART || 'N/A'} bpm</p>
          <p><strong>Alcohol Level:</strong> ${eventData.data.ALC || 'N/A'}</p>
          <p><strong>Helmet Status:</strong> ${eventData.data.HELMET ? 'Worn' : 'Not Worn'}</p>
        </div>
        
        <div style="background-color: #fff5f5; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="color: #ff4444; font-weight: bold; margin: 0;">
            ⚠️ PLEASE CHECK ON THE RIDER IMMEDIATELY! ⚠️
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This is an automated emergency alert from the Rider Guardian System.</p>
          <p>If this is a false alarm, please contact the rider to confirm their safety.</p>
        </div>
      </div>
    `
  };
  
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Emergency email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Failed to send emergency email:', error);
    throw error;
  }
};

module.exports = { sendEmergencyEmail }; 
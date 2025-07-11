const twilio = require('twilio');

const client = twilio(
  'ACa6fe25551cb39bab241c03af5c687be4',
  '8e3003ef742d1348e69bb1657fc0d25d'
);

const sendEmergencySMS = async (contact, eventData) => {
  const message = `🚨 EMERGENCY ALERT: ${eventData.type}

${eventData.message}

Time: ${new Date().toLocaleString()}
Location: ${eventData.data.LAT}, ${eventData.data.LON}
Speed: ${eventData.data.velocity || 'N/A'} km/h
Heart Rate: ${eventData.data.HEART || 'N/A'} bpm
Alcohol Level: ${eventData.data.ALC || 'N/A'}

⚠️ PLEASE CHECK ON THE RIDER IMMEDIATELY! ⚠️

- Rider Guardian System`;

  try {
    const result = await client.messages.create({
      body: message,
      to: contact.phone,
      from: '+13648887182'
    });
    
    console.log('Emergency SMS sent successfully:', result.sid);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    console.error('Failed to send emergency SMS:', error);
    throw error;
  }
};

module.exports = { sendEmergencySMS }; 
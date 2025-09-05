// SMS functionality handled by custom PHP API
// No Twilio integration needed

console.log('SMS notifications are handled by custom PHP API');

export async function sendSMS(to: string, message: string): Promise<boolean> {
  // Log SMS for development - actual SMS handled by PHP API
  console.log(`SMS notification logged for ${to}:`, message);
  console.log('Production SMS will be handled by custom PHP API');
  return true;
}

export async function sendEmergencyNotification(
  phoneNumber: string,
  customerName: string,
  customerPhone: string,
  serviceAddress: string,
  issueDescription: string,
  urgencyLevel: string,
  totalCost: number,
  minimumHours: number,
  baseRate: number,
  preferredTime?: string,
  customerEmail?: string
): Promise<boolean> {
  const message = `🚨 EMERGENCY HVAC SERVICE REQUEST

Name: ${customerName}
Phone: ${customerPhone}
Address: ${serviceAddress}
Issue: ${issueDescription}
Urgency: ${urgencyLevel}
Cost: $${totalCost} (${minimumHours}h min @ $${baseRate}/h)
${preferredTime ? `Preferred: ${preferredTime}` : ''}
${customerEmail ? `Email: ${customerEmail}` : ''}

Time: ${new Date().toLocaleString()}
Action Required: Contact customer immediately`;

  return await sendSMS(phoneNumber, message);
}

export async function sendTestNotification(phoneNumber: string): Promise<boolean> {
  const message = `TEST SMS from AfterHours HVAC - Your SMS notifications are working! Time: ${new Date().toLocaleString()}`;

  return await sendSMS(phoneNumber, message);
}
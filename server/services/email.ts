import { InsertContactSubmission, InsertEmergencyRequest, InsertQuote } from "@shared/schema";
import nodemailer from 'nodemailer';
import { createLogger } from "../../client/src/lib/utils";

const logger = createLogger('EmailService');

// Initialize email transporter - in production, configure with actual SMTP credentials
let transporter: nodemailer.Transporter;

// If SMTP credentials are provided, use them; otherwise, use testing account
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} else {
  // For development, log to console instead
  logger.warn('No SMTP credentials found, emails will be logged to console');
  transporter = {
    sendMail: async (mailOptions) => {
      logger.info('EMAIL WOULD BE SENT', mailOptions);
      return { messageId: 'test-message-id' };
    }
  } as any;
}

// Company email for sending and receiving
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || 'Jordan@AfterhoursHVAC.ca';
const COMPANY_NAME = 'AfterHours HVAC';

/**
 * Send an email for contact form submissions
 */
export async function processContactForm(data: InsertContactSubmission): Promise<void> {
  try {
    // Email to company
    const companyMailOptions = {
      from: `"${COMPANY_NAME} Website" <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      subject: `New Contact Form: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Confirmation email to customer
    const customerMailOptions = {
      from: `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
      to: data.email,
      subject: `Thank you for contacting ${COMPANY_NAME}`,
      html: `
        <h2>Thank you for contacting ${COMPANY_NAME}</h2>
        <p>We have received your message and will get back to you shortly.</p>
        <p>Here's a copy of your message:</p>
        <hr>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>For urgent matters, please call us at (403) 613-6014.</p>
        <p>Best regards,<br>${COMPANY_NAME} Team</p>
      `
    };
    
    // Send both emails
    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(customerMailOptions);
    
    logger.info(`Contact form email sent for ${data.email}`);
  } catch (error) {
    logger.error('Error sending contact form email:', error);
    throw new Error('Failed to send email notification');
  }
}

/**
 * Send an urgent email for emergency service requests
 */
export async function processEmergencyRequest(data: InsertEmergencyRequest): Promise<void> {
  try {
    // Urgent email to company
    const companyMailOptions = {
      from: `"${COMPANY_NAME} EMERGENCY" <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      subject: `🚨 URGENT: Emergency Service Request - ${data.issueType}`,
      html: `
        <h2 style="color: #FF3D00;">EMERGENCY SERVICE REQUEST</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Issue Type:</strong> ${data.issueType}</p>
        <p><strong>Description:</strong></p>
        <p>${data.description.replace(/\n/g, '<br>')}</p>
        <p style="color: #FF3D00; font-weight: bold;">PLEASE CONTACT CUSTOMER IMMEDIATELY</p>
      `,
      // Set high priority flag
      priority: 'high'
    };
    
    // Confirmation SMS-like email to customer
    const customerMailOptions = {
      from: `"${COMPANY_NAME} Emergency" <${COMPANY_EMAIL}>`,
      to: `${data.phone}@txt.att.net`, // Attempt SMS gateway if it's a mobile number
      subject: `Emergency Service Request Received`,
      text: `Your emergency service request has been received by ${COMPANY_NAME}. A technician will call you within 15 minutes at ${data.phone}.`,
      // Set high priority flag
      priority: 'high'
    };
    
    // Send urgent company notification
    await transporter.sendMail(companyMailOptions);
    
    // Attempt SMS notification (may not work for all carriers)
    try {
      await transporter.sendMail(customerMailOptions);
    } catch (error) {
      logger.warn('SMS email notification failed, this is expected for non-mobile numbers');
    }
    
    logger.info(`Emergency request email sent for ${data.name} - ${data.phone}`);
  } catch (error) {
    logger.error('Error sending emergency request email:', error);
    throw new Error('Failed to send emergency notification');
  }
}

/**
 * Send an email for quote requests
 */
export async function processQuoteRequest(data: InsertQuote): Promise<void> {
  try {
    // Email to company
    const companyMailOptions = {
      from: `"${COMPANY_NAME} Website" <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      subject: `New Quote Request: ${data.serviceType}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address || 'Not provided'}</p>
        <p><strong>Service Type:</strong> ${data.serviceType}</p>
        <p><strong>Details:</strong></p>
        <p>${(data.details || 'No additional details provided').replace(/\n/g, '<br>')}</p>
      `
    };
    
    // Confirmation email to customer
    const customerMailOptions = {
      from: `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
      to: data.email,
      subject: `Your ${COMPANY_NAME} Quote Request`,
      html: `
        <h2>Thank you for your quote request</h2>
        <p>We have received your request for a quote on ${data.serviceType} service.</p>
        <p>Our team will review your information and contact you shortly with a custom quote.</p>
        <p>For immediate assistance, please call us at (403) 613-6014.</p>
        <hr>
        <p><strong>Service Requested:</strong> ${data.serviceType}</p>
        ${data.details ? `<p><strong>Details Provided:</strong> ${data.details.replace(/\n/g, '<br>')}</p>` : ''}
        <hr>
        <p>Best regards,<br>${COMPANY_NAME} Team</p>
      `
    };
    
    // Send both emails
    await transporter.sendMail(companyMailOptions);
    await transporter.sendMail(customerMailOptions);
    
    logger.info(`Quote request email sent for ${data.email}`);
  } catch (error) {
    logger.error('Error sending quote request email:', error);
    throw new Error('Failed to send email notification');
  }
}

// src/lib/services/emailService.ts
import { Resend } from 'resend';

// Initialize Resend with proper error handling
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY environment variable is not set');
    throw new Error('Email service not configured');
  }
  return new Resend(apiKey);
};

export interface EventRegistrationEmailData {
  recipientEmail: string;
  recipientName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  eventDescription?: string;
  registrationDeadline?: string;
}

export interface WelcomeEmailData {
  recipientEmail: string;
  recipientName: string;
}

// Event Registration Confirmation Email
export async function sendEventRegistrationEmail(data: EventRegistrationEmailData) {
  try {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Registration Confirmation</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FFD700, #228B22); color: white; text-align: center; padding: 30px 20px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .event-details { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #FFD700; }
        .event-details h3 { margin: 0 0 15px 0; color: #228B22; font-size: 20px; }
        .detail-row { margin: 10px 0; display: flex; align-items: flex-start; }
        .detail-label { font-weight: bold; min-width: 100px; color: #666; }
        .detail-value { flex: 1; }
        .cta-section { text-align: center; margin: 30px 0; }
        .cta-button { display: inline-block; background: #228B22; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; transition: background 0.3s; }
        .cta-button:hover { background: #1e7a1e; }
        .footer { background: #f8f9fa; text-align: center; padding: 20px; font-size: 14px; color: #666; border-top: 1px solid #e9ecef; }
        .social-links { margin: 15px 0; }
        .social-links a { display: inline-block; margin: 0 10px; color: #228B22; text-decoration: none; }
        .success-badge { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px; margin: 20px 0; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Registration Confirmed!</h1>
          <p>Nigerian Association of Muslim Veterinary Medical Students</p>
        </div>
        
        <div class="content">
          <div class="success-badge">
            <strong>✅ You're successfully registered!</strong><br>
            We're excited to have you join us for this event.
          </div>
          
          <p>Dear <strong>${data.recipientName}</strong>,</p>
          
          <p>Thank you for registering! Your spot has been confirmed for the upcoming event. We're looking forward to seeing you there.</p>
          
          <div class="event-details">
            <h3>📅 Event Details</h3>
            <div class="detail-row">
              <div class="detail-label">Event:</div>
              <div class="detail-value"><strong>${data.eventTitle}</strong></div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Date & Time:</div>
              <div class="detail-value">${formatDate(data.eventDate)}</div>
            </div>
            ${data.eventLocation ? `
            <div class="detail-row">
              <div class="detail-label">Location:</div>
              <div class="detail-value">${data.eventLocation}</div>
            </div>
            ` : ''}
            ${data.eventDescription ? `
            <div class="detail-row">
              <div class="detail-label">Description:</div>
              <div class="detail-value">${data.eventDescription}</div>
            </div>
            ` : ''}
          </div>
          
          <h3>📝 What's Next?</h3>
          <ul>
            <li><strong>Add to Calendar:</strong> Mark your calendar so you don't miss this event</li>
            <li><strong>Prepare:</strong> Bring a notebook and come ready to learn and network</li>
            <li><strong>Stay Updated:</strong> Check your email for any event updates</li>
            <li><strong>Questions?</strong> Contact us if you have any concerns</li>
          </ul>
          
          <div class="cta-section">
            <a href="https://namvems.org/events" class="cta-button">View All Events</a>
          </div>
          
          <p><strong>Important Reminders:</strong></p>
          <ul>
            <li>Please arrive 15 minutes early</li>
            <li>Bring a valid ID for verification</li>
            <li>Dress modestly and professionally</li>
            <li>Be respectful of Islamic values and practices</li>
          </ul>
        </div>
        
        <div class="footer">
          <p><strong>Nigerian Association of Muslim Veterinary Medical Students (NAMVEMS)</strong></p>
          <div class="social-links">
            <a href="https://t.me/namvemslibrary">📚 E-Library</a>
            <a href="https://namvems.org">🌐 Website</a>
          </div>
          <p>Empowering Nigerian Veterinary Medical Students Nationwide</p>
          <p style="font-size: 12px; margin-top: 15px;">
            If you didn't register for this event, please ignore this email or contact us immediately.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    const resend = getResendClient();
    
    const { data: result, error } = await resend.emails.send({
      from: 'NAMVEMS@resend.dev', // Using NAMVEMS API name
      to: [data.recipientEmail],
      subject: `🎉 Registration Confirmed: ${data.eventTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending event registration email:', error);
      throw error;
    }

    console.log('Event registration email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send event registration email:', error);
    throw error;
  }
}

// Welcome Email for New User Signup
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to NAMVEMS</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FFD700, #228B22); color: white; text-align: center; padding: 40px 20px; }
        .header h1 { margin: 0; font-size: 32px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 18px; }
        .content { padding: 30px; }
        .welcome-message { background: #e8f5e8; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center; border: 2px solid #228B22; }
        .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
        .feature-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef; }
        .feature-icon { font-size: 24px; margin-bottom: 10px; }
        .cta-section { text-align: center; margin: 40px 0; }
        .cta-button { display: inline-block; background: #228B22; color: white; text-decoration: none; padding: 15px 35px; border-radius: 6px; font-weight: bold; margin: 10px; transition: background 0.3s; }
        .cta-button:hover { background: #1e7a1e; }
        .cta-button.secondary { background: #FFD700; color: #000; }
        .cta-button.secondary:hover { background: #e6c200; }
        .footer { background: #f8f9fa; text-align: center; padding: 25px; font-size: 14px; color: #666; border-top: 1px solid #e9ecef; }
        .social-links { margin: 20px 0; }
        .social-links a { display: inline-block; margin: 0 15px; color: #228B22; text-decoration: none; font-weight: bold; }
        @media (max-width: 600px) {
          .feature-grid { grid-template-columns: 1fr; }
          .cta-button { display: block; margin: 10px 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌟 Welcome to NAMVEMS!</h1>
          <p>Nigerian Association of Muslim Veterinary Medical Students</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <h2 style="margin: 0 0 15px 0; color: #228B22;">Assalamu Alaikum, ${data.recipientName}! 🤝</h2>
            <p style="margin: 0; font-size: 16px;">
              Welcome to our growing community of Muslim veterinary medical students across Nigeria. 
              We're thrilled to have you join our family!
            </p>
          </div>
          
          <h3>🎯 What NAMVEMS Offers You:</h3>
          
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h4>E-Library Access</h4>
              <p>Extensive collection of veterinary resources, textbooks, and study materials</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎓</div>
              <h4>Educational Events</h4>
              <p>Workshops, seminars, and conferences to enhance your learning</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🤝</div>
              <h4>Professional Network</h4>
              <p>Connect with fellow students, alumni, and veterinary professionals</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🕌</div>
              <h4>Islamic Guidance</h4>
              <p>Balancing professional education with Islamic values and principles</p>
            </div>
          </div>
          
          <h3>🚀 Get Started:</h3>
          <ul>
            <li><strong>Join Our E-Library:</strong> Access thousands of veterinary resources</li>
            <li><strong>Browse Events:</strong> Register for upcoming workshops and seminars</li>
            <li><strong>Complete Your Profile:</strong> Add your university and level of study</li>
            <li><strong>Connect:</strong> Network with students from your university</li>
          </ul>
          
          <div class="cta-section">
            <a href="https://t.me/namvemslibrary" class="cta-button">📚 Join E-Library</a>
            <a href="https://namvems.org/events" class="cta-button secondary">🎓 View Events</a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; margin: 30px 0;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">💡 Quick Tip</h4>
            <p style="margin: 0; color: #856404;">
              Start by joining our Telegram E-Library channel to access hundreds of veterinary textbooks, 
              research papers, and study materials curated specifically for Nigerian veterinary students.
            </p>
          </div>
          
          <p><strong>Need Help?</strong> If you have any questions or need assistance, don't hesitate to reach out to us. 
          We're here to support your journey in veterinary medicine.</p>
        </div>
        
        <div class="footer">
          <p><strong>Nigerian Association of Muslim Veterinary Medical Students (NAMVEMS)</strong></p>
          <div class="social-links">
            <a href="https://t.me/namvemslibrary">📚 E-Library</a>
            <a href="https://namvems.org/events">🎓 Events</a>
            <a href="https://namvems.org/resources">📖 Resources</a>
            <a href="https://namvems.org">🌐 Website</a>
          </div>
          <p style="font-style: italic; margin-top: 20px;">
            "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose." 
            <br><span style="font-size: 12px;">(Qur'an 65:3)</span>
          </p>
          <p style="font-size: 12px; margin-top: 20px; opacity: 0.7;">
            Empowering Nigerian Veterinary Medical Students Nationwide<br>
            If you received this email by mistake, please ignore it.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    const resend = getResendClient();
    
    console.log('Attempting to send welcome email to:', data.recipientEmail);
    
    const { data: result, error } = await resend.emails.send({
      from: 'NAMVEMS@resend.dev', // Using NAMVEMS API name
      to: [data.recipientEmail],
      subject: '🌟 Welcome to NAMVEMS - Your Journey Begins Here!',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }

    console.log('Welcome email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

// pages/api/send-email.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    const { name, email, phone, message } = req.body;
  
    const brevoPayload = {
      sender: { name, email },
      to: [{ email: process.env.RECIPIENT_EMAIL }],
      subject: `kaim.dev | New message from ${name} | ${phone}`,
      htmlContent: `<p>${message}</p>`,
    };
  
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(brevoPayload),
      });
  
      if (response.ok) {
        res.status(200).json({ message: 'Email sent successfully!' });
      } else {
        const errorData = await response.json();
        res.status(response.status).json({ error: errorData });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
  
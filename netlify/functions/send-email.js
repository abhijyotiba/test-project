const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { name, email, phone, property_type, budget, message } = JSON.parse(event.body);

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_USER_ID,
      template_params: { name, email, phone, property_type, budget, message }
    })
  });

  if (response.ok) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } else {
    const error = await response.text();
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error })
    };
  }
};

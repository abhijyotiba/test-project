const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { name, email, phone, property_type, budget, message } = JSON.parse(event.body);
  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_USER_ID,
    template_params: { name, email, phone, property_type, budget, message }
  };
  let error = null;
  let responseText = null;
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    responseText = await response.text();
    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, payload, response: responseText })
      };
    } else {
      error = responseText;
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, payload, error })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, payload, error: err.message })
    };
  }
};

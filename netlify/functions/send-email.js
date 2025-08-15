exports.handler = async function (event, context) {
  console.log("Incoming event:", event);

  // Make sure we have a body
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Request body is missing" })
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Invalid JSON format" })
    };
  }

  const { name, email, phone, property_type, budget, message } = data;

  const payload = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_USER_ID,
    template_params: { name, email, phone, property_type, budget, message }
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, payload, response: responseText })
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ success: false, payload, error: responseText })
      };
    }
  } catch (err) {
    console.error("Email send error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, payload, error: err.message })
    };
  }
};

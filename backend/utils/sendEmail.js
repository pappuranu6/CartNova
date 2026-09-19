const sendEmail = async ({ to, subject, text, html }) => {
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "CartNova",
          email: "pappuranu6@gmail.com",
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Brevo API error:", errorText);

    throw new Error(
      `Brevo email failed: ${response.status}`
    );
  }
};

export default sendEmail;
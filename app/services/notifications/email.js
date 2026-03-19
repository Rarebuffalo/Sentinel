import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, message }) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html: `<p>${message}</p>`,
    });
  } catch (err) {
    console.error("Email error:", err);
  }
};


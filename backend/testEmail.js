// testEmail.js
import { sendEmail } from "../app/services/notifications/email.js";

await sendEmail({
  to: "workforkrishnasingh@gmail.com",
  subject: "Test Email 🚀",
  message: "If you see this, email works!",
});

console.log("Email test done");
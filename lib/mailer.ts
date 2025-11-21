import nodemailer from "nodemailer";

type SendResult = {
  success: boolean;
  error?: string;
};

export const sendInviteEmail = async (
  to: string,
  inviteLink: string,
  workspaceName: string,
  inviterName?: string
): Promise<SendResult> => {
  try {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === "true";

    if (!host || !user || !pass) {
      return { success: false, error: "SMTP not configured on the server." };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const fromAddress = process.env.MAIL_FROM || user;

    const subject = `You're invited to join ${workspaceName} on Trackly`;
    const plainText = `${inviterName ? inviterName + " has" : "Someone has"} invited you to join the workspace "${workspaceName}" on Trackly.\nOpen this link to join: ${inviteLink}`;
    const html = `
      <p>${inviterName ? inviterName + " has" : "Someone has"} invited you to join the workspace <strong>${workspaceName}</strong> on Trackly.</p>
      <p><a href="${inviteLink}" target="_blank" rel="noreferrer">Click here to join the workspace</a></p>
      <p>If the link doesn't work, copy and paste this URL into your browser:</p>
      <p><code>${inviteLink}</code></p>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: plainText,
      html,
    });

    return { success: true };
  } catch (err) {
    console.error("Error sending invite email:", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
};

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXTAUTH_URL;

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  console.log("ami resend theke call hoiche:", confirmLink)
  console.log("email:", email)
  console.log("token:", token)

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  });
};

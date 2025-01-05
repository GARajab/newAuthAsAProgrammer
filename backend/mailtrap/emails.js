import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      template_uuid: "577ffd4f-ad9e-4440-a502-fe60b51ca1c9",
      template_variables: {
        name: name,
        company_info_name: "iRajab",
      },
    });
    console.log("Email Sent Successfully", responce);
  } catch (error) {
    console.log(error);
  }
};

import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Verification",
      template_variables: {
        company_info_name: "iRajab",
      },
    })
    console.log("Email Sent Successfully")
  } catch (error) {
    console.log(error)
  }
}

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "390d6313-8ac7-48bf-ac3e-4dc914a53985",
      template_variables: {
        name: name,
        company_info_name: "iRajab",
      },
    })
    console.log("Email Sent Successfully", response)
  } catch (error) {
    console.log(error)
  }
}

// export sendWelcomeEmail = async (email, name) => {

import { response } from "express"
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js"
import {
  mailtrapClient,
  sender,
  
} from "./mailtrap.config.js"

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

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    })
    console.log("Email Sent Successfully")
  } catch (error) {
    console.log(error)
  }
}
export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful!",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    })
    console.log("Password Reset Email Sent Successfully", response)
  } catch (error) {
    console.log("Error Sending Password Reset Success Email", error)
  }
}
// export sendWelcomeEmail = async (email, name) => {

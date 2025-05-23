import { NextResponse } from "next/server";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
// If you want SES:
// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Uncomment if using SES
// const sesClient = new SESClient({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

export async function POST(req) {
  try {
    const { email, phone, message } = await req.json();

    // ✅ 1. Send SMS via SNS directly
    const smsParams = {
      Message: `Hello! You submitted a form.\nMessage: ${message}`,
      PhoneNumber: phone, // Must include country code e.g. +91
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    };

    const smsResponse = await snsClient.send(new PublishCommand(smsParams));
    console.log("SMS sent:", smsResponse);

    // ✅ 2. OPTIONAL: Send Email via SES (not SNS topic)
    /*
    const emailParams = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Data: `Thanks for your message!\n\nYour Message:\n${message}`,
          },
        },
        Subject: {
          Data: "Form Submission Confirmation",
        },
      },
      Source: "your-verified-email@example.com", // SES verified sender
    };

    const emailResponse = await sesClient.send(new SendEmailCommand(emailParams));
    console.log("Email sent:", emailResponse);
    */

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}

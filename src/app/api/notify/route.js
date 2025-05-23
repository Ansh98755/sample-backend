import { NextResponse } from "next/server";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function POST(req) {
    try {
        const { email, phone, message } = await req.json();

        // Send SMS directly using SNS
        const smsParams = {
    Message: `Hello! You've submitted a form.\nMessage: ${message}`,
    PhoneNumber: phone, // User's phone number
    MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
            DataType: "String",
            StringValue: "Transactional", // Ensures higher reliability
        },
    },
};

        // Send Email via SNS topic (consider using AWS SES for better reliability)
        const emailParams = {
            Message: `Subject: Form Submission\n\nYou've submitted a form!\nMessage: ${message}`,
            TopicArn: process.env.SNS_TOPIC_ARN,
        };

        const response = await snsClient.send(new PublishCommand(smsParams));
        console.log("SNS SMS Response:", response);

        const emailResponse = await snsClient.send(new PublishCommand(emailParams));
        console.log("SNS Email Response:", emailResponse);
        console.log("User Submitted Data:", { email, phone, message });

        return NextResponse.json({ success: true, message: "Notification sent!" });
    } catch (error) {
        console.error("SNS Error:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}
import pkg from "@slack/bolt";
import { NewLead } from "./blocks.js";

import dotenv from "dotenv";
dotenv.config();

const { App } = pkg;
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const sendSlackNotification = async (channel, messageData) => {
  try {
    const newLead = new NewLead(
      messageData.senderName,
      messageData.companyName,
      messageData.emailSubject,
      messageData.emailSummary,
      messageData.opportunityDescription,
      messageData.emailUrl
    );

    const blocks = newLead.getBlocks();

    const result = await app.client.chat.postMessage({
      channel,
      blocks: blocks.blocks,
      text: "New Lead/Opportunity",
    });
    console.log("Message sent successfully");
    return result;
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Event listener for direct messages
app.event("message", async ({ event, client, say }) => {
  if (event.channel_type === "im") {
    try {
      // Fetch the last 10 messages
      const result = await client.conversations.history({
        channel: event.channel,
        limit: 11, // We fetch 11 to exclude the current message
      });

      // Remove the current message and get the last 10
      const previousMessages = result.messages
        .slice(1, 11)
        .map((msg) => `${msg.user}: ${msg.text}`)
        .reverse(); // Reverse to get chronological order

      // Process the previous messages as needed
      console.log("Previous 10 messages:", previousMessages);

      // Respond to the current message
      await say(`Hello! You said: ${event.text}`);
    } catch (error) {
      console.error("Error fetching message history:", error);
      await say("Sorry, I encountered an error while processing your message.");
    }
  }
});

// Event listener for mentions in channels
// app.event("app_mention", async ({ event, say }) => {
//   await say(`Hello <@${event.user}>! You mentioned me in a channel.`);
// });

const startSlackBot = async () => {
  try {
    await app.start();
    console.log("⚡️ Slack bot is running!");
  } catch (error) {
    console.error("Error starting Slack bot:", error);
    if (error.code === "slack_webapi_platform_error") {
      console.error("Slack API Error Details:", error.data);
    }
  }
};

export { startSlackBot, sendSlackNotification };

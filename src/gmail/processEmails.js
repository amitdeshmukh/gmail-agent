import { listUnreadEmails } from "./listUnreadEmails.js";
import { crew } from "../crew/index.js";
import { sendSlackNotification } from "../slack/slackBot.js";

const SLACK_CHANNEL = "@amit079";

const EmailBasedLeadNotificationAgent = crew.agents.get(
  "EmailBasedLeadNotificationAgent"
);

export const processEmails = async () => {
  try {
    const messages = await listUnreadEmails();
    console.log(`\nTotal Unread Emails: ${messages.length}`);

    for (const message of messages) {
      const {
        isSalesOpportunity,
        senderName,
        companyName,
        emailSubject,
        emailSummary,
        opportunityDescription,
        emailUrl,
      } = await EmailBasedLeadNotificationAgent.forward({
        email: JSON.stringify(message.messages[0]),
      });

      if (isSalesOpportunity) {
        const messageData = {
          senderName,
          companyName,
          emailSubject,
          emailSummary,
          opportunityDescription,
          emailUrl,
        };

        console.log(`✨ Sales Opportunity: ${messageData.emailSubject}`);

        // Send Slack notification
        const slackResponse = await sendSlackNotification(
          SLACK_CHANNEL,
          messageData
        );

        // Store the Slack message timestamp for future reference
        message.slackTs = slackResponse.ts;
      }
    }
  } catch (err) {
    console.error("Error processing emails:", err);
  }
};

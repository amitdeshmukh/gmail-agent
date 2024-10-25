import { processEmails } from "./gmail/processEmails.js";
import { startSlackBot } from "./slack/slackBot.js";

const CHECK_INTERVAL = 600000; // Check every 10 mins

const main = async () => {
  // Start the Slack bot
  await startSlackBot();

  // Start the email processing loop
  while (true) {
    await processEmails();
    await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
  }
};

main().catch(console.error);

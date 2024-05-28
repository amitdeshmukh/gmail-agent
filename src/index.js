import { listUnreadEmails } from './functions/listUnreadEmails.js';
import router from './agent/router.js';
import { agent } from './agent/agents.js';


const main = async () => {
  try {
    const messages = await listUnreadEmails();
    for (const message of messages) {
      const text = message.messages[0].text;
      const tag = await router.forward(text);

      let response = '';
      let availableSlots = '';
      let tagMsg = '';

      if (tag === 'customerSupport') {
        tagMsg = 'Create a support ticket';
        response = await agent.forward({
          task: 'Create a support ticket with the following fields: Name, Email, Issue Summary, Priority',
          context: JSON.stringify(message.messages[0])
        });
      } else if (tag === 'salesSupport') {
        tagMsg = 'Enter the lead into the CRM system.';
        let response1 = await agent.forward({
          task: 'Summarize the email to input as a lead in a CRM system.',
          context: JSON.stringify(message.messages[0])
        });

        let response2 = await agent.forward({
          task: `Has a meeting been requested? If so, find available time slots for the meeting in business hours. The current time is ${new Date().toISOString()}`,
          context: response1.answer
        });

        response = response1.answer + ' ' + response2.answer;

      } else {
        tagMsg = 'No task detected';
      }

    console.log(`\nEmail Subject: ====> ${message.messages[0].subject}`);
    console.log(`\nEmail Snippet: ====> ${message.messages[0].snippet}`);
    console.log(`\nTask detected: ====> ${tagMsg}`);
    console.log(`\nAi Response: ======> ${response}`);
    console.log('-------------------------------------------');

    }
  } catch (err) {
    console.error(err);
  }
};

main().catch(console.error);
import { google } from 'googleapis';
import { authorize } from '../auth/index.js';

/**
 * Lists the user's unread emails with full message info.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @return {Promise<Array>} A promise that resolves to an array of objects containing full message info for each unread thread.
 */
export async function listUnreadEmails() {
  const auth = await authorize();
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.threads.list({
    userId: 'me',
    q: 'is:unread in:inbox',
  });
  const threads = res.data.threads;
  if (!threads || threads.length === 0) {
    console.log('No unread email threads found.');
    return [];
  }

  console.log(`Found ${threads.length} unread email threads.`)

  const threadDetailsPromises = threads.map(async (thread) => {
    const threadRes = await gmail.users.threads.get({
      userId: 'me',
      id: thread.id,
    });

    const messages = threadRes.data.messages.map((message) => {
      const textPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
      const text = textPart ? Buffer.from(textPart.body.data, 'base64').toString('utf-8') : null;

      return {
        id: message.id,
        from: message.payload.headers.find(header => header.name === 'From').value,
        to: message.payload.headers.find(header => header.name === 'To').value,
        date: message.payload.headers.find(header => header.name === 'Date').value,
        subject: message.payload.headers.find(header => header.name === 'Subject').value,
        text: text,
        snippet: message.snippet,
      };
    });

    // Mark thread as read
    // await gmail.users.threads.modify({
    //   userId: 'me',
    //   id: thread.id,
    //   resource: {
    //     removeLabelIds: ['UNREAD'],
    //   },
    // });

    return {
      threadId: thread.id,
      messages: messages,
    };
  });

  return Promise.all(threadDetailsPromises);
}

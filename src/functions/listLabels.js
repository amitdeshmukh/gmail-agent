const { google } = require('googleapis');
import { authorize } from '../auth/index.js';

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels() {
  const auth = await authorize();
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.labels.get({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  return labels;
}

module.exports = listLabels;
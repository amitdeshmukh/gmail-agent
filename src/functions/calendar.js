import { google } from 'googleapis';
import { authorize } from '../auth/index.js';
/**
 * Find available time slots in the user's calendar.
 *
 * @param {String} startTime The start time to look for availability.
 * @param {String} endTime The end time to look for availability.
 * @param {number} duration The duration of the time slot in minutes.
 * @returns {Promise<Date[]>} A promise that resolves with a list of available time slots.
 */
export async function findAvailableTimeSlots(startTime, endTime, duration) {
  console.log(`findAvailableTimeSlots called with startTime: ${startTime}, endTime: ${endTime}, duration: ${duration}`);

  const auth = await authorize();
  const calendar = google.calendar({ version: 'v3', auth });
  const availableSlots = [];
  
  try {
    console.log(`Sending freebusy query with timeMin: ${startTime}, timeMax: ${endTime}`);

    // Query the user's calendar for busy events
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: new Date(startTime).toISOString(),
        timeMax: new Date(endTime).toISOString(),
        items: [{ id: 'primary' }],
      },
    });

    const events = response.data.calendars.primary.busy;
    console.log('Received response from freebusy query');

    // Calculate available time slots based on busy events and requested duration
    let start = new Date(startTime);
    let end = new Date(endTime);

    events.forEach((event) => {
      console.log(`Busy event: ${event.start} to ${event.end}`);
      const busyStart = new Date(event.start);
      const busyEnd = new Date(event.end);

      while (start < busyStart) {
        if (new Date(start.getTime() + duration * 60000) <= busyStart) {
          availableSlots.push(new Date(start));
        }
        start = new Date(start.getTime() + duration * 60000);
      }
      start = new Date(busyEnd);
    });

    // Check for available slots after the last event
    while (start < end) {
      if (new Date(start.getTime() + duration * 60000) <= end) {
        availableSlots.push(new Date(start));
      }
      start = new Date(start.getTime() + duration * 60000);
    }

    return {
      availableSlots: availableSlots.slice(0, 3)
    };
  } catch (error) {
    console.error('Error finding available time slots:', error);
    throw error;
  }
}
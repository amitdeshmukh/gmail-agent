import { findAvailableTimeSlots } from './src/functions/calendar.js';

findAvailableTimeSlots("2024-06-03T00:00:00", "2024-06-10T23:59:59", 60)
  .then(console.log)
  .catch(console.error);

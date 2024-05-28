import { Agent } from 'llmclient';
import { ai } from './ai.js';
import { findAvailableTimeSlots } from '../functions/calendar.js';

const calendarAgentFunctions = {
  'currentDateTime': {
    name: 'currentDateTime',
    description: 'Returns the current date and time.',
    parameters: {},
    func: async () => {
      return await new Date().toISOString();
    }
  },  
  'findAvailableTimeSlots': {
    name: 'findAvailableTimeSlots',
    description: 'Find available time slots in the user\'s calendar',
    parameters: {
      type: 'object',
      properties: {
        startTime: {
          type: 'string',
          description: 'The start time to look for availability in ISO format'
        },
        endTime: {
          type: 'string',
          description: 'The end time to look for availability in ISO format'
        },
        duration: {
          type: 'number',
          description: 'The duration of the time slot in minutes'
        }
      },
      required: ['startTime', 'endTime', 'duration']
    },
    func: async (args) => {
      try {
        const availability = findAvailableTimeSlots(args.startTime, args.endTime, args.duration);
        return availability;
      } catch (error) {
        console.error(error.message);
      }
    }
  }
};

const calendarAgent = new Agent(ai, {
  name: 'calendarAgent',
  description: 'looks up calendar availability.',
  signature: `
    startTime "start time in ISO date format", 
    endTime "end time in ISO date format", 
    duration "in minutes" 
    -> 
    availableSlots:string[] "list of available time slots"
    `,
  functions: [calendarAgentFunctions]
});

const summarizerAgent = new Agent(ai, {
  name: 'summarizerAgent',
  description: 'summarizes long emails into a short summary.',
  signature: `text "email text to summarize" -> shortSummary "summarize in 10 to 20 words"`
});

export const critiqueAgent = new Agent(ai, {
  name: 'critiqueAgent',
  description: 'reviews the final_answer from task to provide helpful critique.',
  signature: `task, answer -> critique`,
});

export const agent = new Agent(ai, {
  name: 'EmailAgent',
  description: 'An agent that can take action on emails and self reflect on its performance.',
  signature: `task, context -> task, answer`,
  agents: [summarizerAgent, calendarAgent, critiqueAgent]
});


// agent.setExamples([
//   { 
//     task: "Extract information from the email to create a sales enquiry record in JSON format." ,
//     context: { from: "Steve <abc@example.com>", to: "demo@buddhic.com", date: "22/05/2024", subject: "Enquiry", text: "I would like to know more about your products and services."},
//     answer: {
//       response: { 
//         from: "Steve <abc@example.com>",
//         date: "22/05/2024",
//         request: "Short summary of the request",
//         products: ["saas products", "enterprise software"],
//         services: ["ai consulting", "data analytics"],
//       }
//     }
//   },
//   {
//     task: "Draft a polite response to a customer asking for a refund due to a late delivery.",
//     context: { from: "Jane Doe <jane.doe@example.com>", to: "support@buddhic.com", date: "25/05/2024", subject: "Refund Request", text: "I am writing to request a refund for my order #12345 which was delivered late."},
//     answer: {
//       response: "Dear Jane Doe, we sincerely apologize for the inconvenience caused by the late delivery of your order #12345. We understand the importance of timely service and regret that we did not meet your expectations on this occasion. As per our refund policy, we have processed a full refund for your order, and you should see the amount reflected in your account within 5-7 business days. We value your business and hope to have the opportunity to serve you better in the future."
//     }
//   },
//   {
//     task: "Extract information from the email to create a sales enquiry record in JSON format.",
//     context: { from: "Maxwell <max@example.com>", to: "sales@buddhic.com", date: "26/05/2024", subject: "Bulk Order Inquiry", text: "I'm interested in placing a bulk order for your products. Could you please inform me about any available discounts and the ordering process?"},
//     answer: {
//       response: {
//         from: "Maxwell <max@example.com>",
//         date: "26/05/2024",
//         request: "Bulk Order Inquiry",
//         products: ["product1", "product2"],
//       }
//     }
//   }
// ]);

import { ai } from './ai.js';
import { Router, Route } from 'llmclient';

const customerSupport = new Route('customerSupport', [
  'I need help setting up software',
  'Do you have any documentation on your products?',
  'Please send me a video tutorial on how to use your software',
  'Can you call me to resolve my issue?',
  'I need to speak to a customer support representative',
  'My integration with a database is not working',
]);

const salesSupport = new Route('salesSupport', [
  'I would like to know more about your products and services',
  'Do you have a sales office in Germany?',
  'Do you have customers in the US?',
  'Can we have a meeting to discuss your products and services?',
  'I need a quote for your services',
  'Do you offer a discount for annual plans?',
]);

const router = new Router(ai);
router.setOptions({ debug: false });

await router.setRoutes(
  [customerSupport, salesSupport]
);

export default router;

// const tag = await router.forward('I need help with my order');

// if (tag === "customerSupport") {
//     ...
// }
// if (tag === "technicalSupport") {
//     ...
// }
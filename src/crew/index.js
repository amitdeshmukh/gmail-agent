import { AxCrew, AxCrewFunctions } from "@amitdeshmukh/ax-crew";

const crew = new AxCrew("./agent_params.yaml", AxCrewFunctions);

crew.addAgentsToCrew(["EmailBasedLeadNotificationAgent"]);

export { crew };


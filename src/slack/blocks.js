export class NewLead {
  constructor(
    senderName,
    companyName,
    emailSubject,
    emailSummary,
    opportunityDescription,
    emailUrl
  ) {
    this.senderName = senderName;
    this.companyName = companyName;
    this.emailSubject = emailSubject;
    this.emailSummary = emailSummary;
    this.opportunityDescription = opportunityDescription;
    this.emailUrl = emailUrl;
  }

  getBlocks() {
    return {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🚀 New Lead/Opportunity in your Inbox! :envelope:",
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*From:* ${this.senderName}\n*Company:* ${this.companyName}\n*Subject:* ${this.emailSubject}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: ":memo: *Email Summary*",
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: this.emailSummary,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: ":bulb: *Potential Opportunity*",
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: this.opportunityDescription,
          },
        },
        {
          type: "divider",
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Email",
                emoji: true,
              },
              url: this.emailUrl,
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Add to CRM",
                emoji: true,
              },
              style: "primary",
              value: "add_to_crm",
            },
          ],
        },
      ],
    };
  }
}

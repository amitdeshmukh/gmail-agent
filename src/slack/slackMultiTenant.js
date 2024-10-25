import { App, ExpressReceiver } from "@slack/bolt";
import express from "express";
import { NewLead } from "./blocks.js";
import dotenv from "dotenv";
import { saveInstallation, findInstallation } from "./db.js"; // Implement this file to handle database operations

dotenv.config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.STATE_SECRET,
  scopes: ["chat:write", "im:history", "app_mentions:read"],
  installationStore: {
    storeInstallation: async (installation) => {
      if (installation.isEnterpriseInstall) {
        return await saveInstallation(installation.enterprise.id, installation);
      }
      return await saveInstallation(installation.team.id, installation);
    },
    fetchInstallation: async (installQuery) => {
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId) {
        return await findInstallation(installQuery.enterpriseId);
      }
      return await findInstallation(installQuery.teamId);
    },
  },
});

const app = new App({
  receiver,
  authorize: async ({ teamId, enterpriseId }) => {
    const installation = await findInstallation(teamId || enterpriseId);
    return {
      botToken: installation.bot.token,
      botId: installation.bot.id,
      botUserId: installation.bot.userId,
    };
  },
});

// ... rest of your code (sendSlackNotification, event listeners) ...

const startSlackBot = async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Slack bot is running!");
  } catch (error) {
    console.error("Error starting Slack bot:", error);
    if (error.code === "slack_webapi_platform_error") {
      console.error("Slack API Error Details:", error.data);
    }
  }
};

// Add routes for OAuth flow
receiver.router.get("/slack/install", (req, res) => {
  res.send(
    `<a href="https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,im:history,app_mentions:read&redirect_uri=${process.env.REDIRECT_URI}">Install to Slack</a>`
  );
});

receiver.router.get("/slack/oauth_redirect", async (req, res) => {
  try {
    await app.installProvider.handleCallback(req, res);
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("OAuth error");
  }
});

export { startSlackBot, sendSlackNotification };

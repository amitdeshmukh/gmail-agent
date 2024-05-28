# Project Title

A Node.js application that processes unread emails, categorizes them into customer or sales support, and performs actions based on the category using AI and Google APIs.

## Features

- List unread emails from a user's Gmail account.
- Use AI to categorize emails into customer support or sales support.
- Create support tickets or enter leads into a CRM system based on the email content.
- Find available time slots for meetings requested via email.

## Installation

1. Clone the repository.
2. Install dependencies with `npm install`.

## Configuration

- Set up Google API credentials and save them as `credentials.json`.
- After the first run, the application will generate a `token.json` for subsequent authentications.

## Usage

Run the application with:
```sh
node src/index.js
```

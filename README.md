# Discord Earthquake Notifier Bot

## Overview

This Discord bot is designed to notify a specified channel in a specified server about recent earthquakes. The bot fetches earthquake data from an API and updates the message in the Discord channel with the latest information.

## Requirements

- Node.js
- Discord.js library
- node-fetch library
- lowdb library

## Installation

1. Clone the repository.
2. Navigate to the project folder and run `npm install` to install all required dependencies.
3. Replace `"specified_guild_id"`, `"specified_channel_id"`, and `"your-token-here"` with your Discord server ID, channel ID, and bot token, respectively.
4. Run the bot using `node index.js` or whatever your main file is named.

## Features

- Automatically fetches the latest earthquake information.
- Updates a message in the Discord channel with current earthquake data.
- Utilizes lowdb for simple database functionalities.
- Embeds for better message presentation.

## How It Works

- The bot uses the Discord.js library to interact with the Discord API.
- Earthquake data is fetched from the `https://api.orhanaydogdu.com.tr/deprem/live.php?limit=1` API.
- The fetched data is processed and then updated in the Discord channel through an embed message.
- Lowdb is used for keeping track of the last notified earthquake and message ID for updating.

## Intents and Partials

The bot uses the following Discord intents:

- `GatewayIntentBits.Guilds`
- `GatewayIntentBits.GuildMembers`
- `GatewayIntentBits.GuildMessages`
- `GatewayIntentBits.GuildMessageReactions`
- `GatewayIntentBits.DirectMessages`
- `GatewayIntentBits.DirectMessageReactions`
- `GatewayIntentBits.MessageContent`

And the following Discord partials:

- `Partials.Message`
- `Partials.Channel`
- `Partials.GuildMember`
- `Partials.Reaction`
- `Partials.User`
- `Partials.ThreadMember`

const { Client, GatewayIntentBits, Partials, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('earthquake.json');
const db = low(adapter);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    shards: "auto",
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember,
    ],
});

client.on('ready', () => {
    initialize();
});

const initialize = async () => {
    const guild = client.guilds.cache.get("specified_guild_id");
    if (!guild) return console.log("Cannot find the server.");

    const channel = guild.channels.cache.get("specified_channel_id");
    if (!channel) return console.log("Cannot find the channel.");

    fetchEarthquakeData(guild, channel);
    setInterval(() => fetchEarthquakeData(guild, channel), 850);
};

const fetchEarthquakeData = async (guild, channel) => {
    let embed = new MessageEmbed()
        .setAuthor(guild.name, guild.iconURL({ dynamic: true }));
    try {
        const res = await fetch('https://api.orhanaydogdu.com.tr/deprem/live.php?limit=1');
        const data = await res.json();

        if (data && data.status) {
            processEarthquakeData(data.result[0], channel, embed);
        }
    } catch (err) {
        console.error("An error occurred:", err);
    }
};

const processEarthquakeData = async (data, channel, embed) => {
    const lastEarthquake = await db.get("last_earthquake").value();
    const messageId = await db.get("message_id").value();

    if (data.timestamp === lastEarthquake) return;

    await db.set("last_earthquake", data.timestamp).write();

    embed.setDescription(`
        ${data.location}
        Magnitude: ${data.mag}
        Depth: ${data.depth}km
        Latitude: ${data.lat}
        Longitude: ${data.lng}
        Time: <t:${data.timestamp}> (<t:${data.timestamp}:R>)
        Coordinates: ${data.coordinates ? data.coordinates.join(", ") : "Not found!"}
    `);

    let fetchedMessage = await channel.messages.fetch(messageId);

    if (fetchedMessage && messageId) {
        fetchedMessage.edit({ content: `${data.mag < 5 ? 'Aftershock' : 'Earthquake & Tremor'} Occurred!`, embeds: [embed] });
    } else {
        channel.send({
            content: `${data.title} - ${data.mag < 5 ? 'Aftershock' : 'Earthquake & Tremor'}`,
            embeds: [embed]
        }).then(async (msg) => {
            await db.set("message_id", msg.id).write();
        });
    }
};

client.login("your-token-here");

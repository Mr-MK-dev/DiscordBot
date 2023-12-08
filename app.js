const axios = require('axios');
const fs = require('fs');

const { Client, GatewayIntentBits } = require('discord.js');
const { getImages } = require('./func/getImages');
require('dotenv').config({});
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const url = 'https://www.mi.com/global/';

async function webScripper(url) {
    try {
        const req = await axios.get(url);
        let links = getImages(req.data);
        links = links.filter((link) => !link.includes('.svg'));

        links = [...new Set(links)];

        const forment = links.map((element) => `https:${element}`);
        return forment;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}
console.log('Server Started');

client.on('ready', () => {
    console.log(`Thunder bot is ready! Tag is ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === 'ping') {
        message.reply('Pong!');
    }

    if (message.content == 'hi') {
        message.reply(
            'Hello 😍, Welcome to my bot scrapper,\nI hope you have a nice day,\n send the link to scraping'
        );
    }

    if (message.content.includes('https://')) {
        message.reply('Data is on processing');

        try {
            const scrapper = await webScripper(message.content.toString());

            for (const imageUrl of scrapper) {
                await message.channel.send({
                    files: [imageUrl],
                });
            }

            console.log('All images sent successfully.');
        } catch (error) {
            message.reply('Error processing images.');
            console.error('Error:', error);
        }
    }
});

client.login(process.env.DISCORD_KEY);

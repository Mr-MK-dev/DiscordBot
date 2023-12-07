const axios = require('axios');
const path = require('path');
const fs = require('fs');

const { Client, GatewayIntentBits } = require('discord.js');
const { getImages, loadData, downloadImage } = require('./func/getImages');
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
        const links = getImages(req.data);
        downloadImage(links);
        return links;
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
        message.reply('Pong  !');
    }

    if (message.content.includes('https://')) {
        message.reply('The Bot Stopped temporarily, Hope you a good day');
        try {
            const scrapper = await webScripper(message.content.toString());

            if (scrapper.length > 0) {
                const data = await loadData();
                if (data.length > 0) {
                    console.log(`DataAvailable: `, data);
                    await message.channel.send({
                        files: data,
                    });
                }
            }
            console.log('Files sent successfully.');
            // }
        } catch (error) {
            message.reply('Error processing images.');
            console.error('Error:', error);
        }
    }
});

client.login(process.env.DISCORD_KEY);

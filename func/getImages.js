const cheerio = require('cheerio');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
function getImages(script) {
    const $ = cheerio.load(script);
    imageList = [];

    $('img').each((index, el) => {
        const imageUrl = $(el).attr('src');
        if (imageUrl) {
            imageList.push(imageUrl);
        }
    });
    return imageList;
}

function extractName(images) {
    const nameArray = [];
    images.map((el, i) => {
        const length = images[i].split('/').length;
        const name = images[i].split('/')[length - 1];
        const imageObj = Object.assign({ link: el }, { name });
        nameArray.push(imageObj);
    });

    return nameArray;
}

function downloadImage(images) {
    const files = fs.readdirSync(path.join(__dirname, 'images'));
    files.map((el) => {
        fs.unlinkSync(path.join(__dirname, 'images', el));
    });

    images.map(async (el, i) => {
        const arr = el.split('/');
        const res = await axios.get(el, { responseType: 'arraybuffer' });
        fs.writeFile(
            path.join(__dirname, 'images', arr[arr.length - 1]),
            res.data,
            (err) => {
                if (err) throw err;
                console.log('Image downloaded successfully!');
            }
        );
    });
    // return new Promise((resolve, reject) => setTimeout(resolve, 3 * 60 * 1000));
}

function loadData() {
    return new Promise((resolve, reject) => {
        const folderPath = path.join(__dirname, 'images');
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            const arr = files.map(
                (file) =>
                    `./${path.join('func/images/', file).replace(/\\/g, '/')}`
            );
            // console.log(`Arrat`, arr);
            resolve(arr);
        });
    });
}

module.exports = { getImages, downloadImage, loadData };

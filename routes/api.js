const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');
const ytdl = require('ytdl-core');
const request = require('request');

const httpsProxyAgent = require('https-proxy-agent');

var count = 0;

/* TODO: 
    web scrape the free proxy set
    alternate random proxies */

const proxy_test = async () => {
  try {
    const response = await axios.get('http://httpbin.org/ip', {
      proxy: {
        host: '80.211.135.240',
        port: 8080
      }
    });

    const data = response.data;
    console.log(data);
    //await proxy_test();
  } catch (err) {
    console.log('broken');
    //proxy_test();
  }
};

proxy_test();

router.get('/', async (req, res) => {
  try {
    res.json({ message: 'hello world' });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

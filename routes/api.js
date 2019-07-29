const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

//https://httpbin.org/ip
//https://httpbin.org/user-agent

const proxy_List = async () => {
  try {
    var response = await axios.get('http://free-proxy-list.net/', {});

    const data = response.data;

    const $ = cheerio.load(data);

    const ip_list = [];

    for (var i = 1; i <= 300; i++) {
      const _ip = $(
        `#proxylisttable > tbody > tr:nth-child(${i}) > td:nth-child(1)`
      ).text();

      const _port = $(
        `#proxylisttable > tbody > tr:nth-child(${i}) > td:nth-child(2)`
      ).text();

      const _anon = $(
        `#proxylisttable > tbody > tr:nth-child(${i}) > td:nth-child(5)`
      ).text();

      if (
        $(`#proxylisttable > tbody > tr:nth-child(${i}) > td:nth-child(7)`)
          .text()
          .includes('yes')
      ) {
        ip_list.push({
          ip: _ip,
          port: parseInt(_port, 10),
          anon: _anon
        });
      }
    }

    return ip_list;
  } catch (err) {
    return { message: 'broken' };
  }
};

const agent_list = async () => {
  try {
    var response = await axios.get(
      'https://developers.whatismybrowser.com/useragents/explore/software_type_specific/crawler/',
      {}
    );

    const data = response.data;

    const $ = cheerio.load(data);

    const agent = $(
      'body > div.content-base > section > div > table > tbody > tr:nth-child(1) > td.useragent'
    ).text();

    const agnt_list = [];

    for (
      var i = 1;
      i <=
      $('body > div.content-base > section > div > table > tbody > tr').length;
      i++
    ) {
      const agent = $(
        `body > div.content-base > section > div > table > tbody > tr:nth-child(${i}) > td.useragent`
      ).text();
      agnt_list.push(agent);
    }

    return agnt_list;
  } catch (err) {
    return { message: 'broken' };
  }
};

router.get('/', async (req, res) => {
  try {
    res.json({
      message:
        '/v1/proxies to get list of proxies OR /v1/agents to get list of agents'
    });
  } catch (err) {
    res.json({ message: err });
  }
});

router.get('/v1/proxies', async (req, res) => {
  try {
    const list = await proxy_List();
    res.json(list);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get('/v1/agents', async (req, res) => {
  try {
    const list = await agent_list();
    res.json(list);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

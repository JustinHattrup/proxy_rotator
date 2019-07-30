const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

//https://httpbin.org/ip
//https://httpbin.org/user-agent
/* gdiufghiodfhgiodfhgidhgidhgidhfg
doufghdoifghodufhgoudfhgoudhfgoudhfogudhofghdufhgodufg */

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
          anon: _anon,
          works: null
        });
      }
    }

    return ip_list;
  } catch (err) {
    return -1;
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
    return -1;
  }
};

//https://httpbin.org/ip
//https://httpbin.org/user-agent

const rotate_proxy = async proxy_List => {
  const ip_list = await proxy_List();

  if (ip_list != -1) {
    const rand = Math.floor(Math.random() * ip_list.length);
    return ip_list[rand].resolve;
  } else {
    return -1;
  }
};

const rotate_agnt = async () => {
  const agnt_list = await agent_list();

  if (agnt_list != -1) {
    const rand = Math.floor(Math.random() * agnt_list.length);
    return agnt_list[rand];
  } else {
    return -1;
  }
};

/* working on testing each ip and updates works element, then passes new updated ip list */

const youtube_scrape = async (ip, agnt) => {
  if (typeof ip !== 'undefined') {
    var test = null;

    console.log(ip[0]);
    for (var i = 0; i < ip.length; i++) {
      if (ip[i].works == null) {
        test = ip[i];
        break;
      }
    }
    console.log(test);

    /*if (ip != -1) {
      try {
        var response = await axios.get('https://httpbin.org/ip', {
          proxy: {
            host: ip.ip,
            port: ip.port
          },
          headers: {
            'user-agent': agnt
          }
        });
  
        const data = response.data;
  
        //const $ = cheerio.load(data);
  
        youtube_scrape();
  
        console.log(data);
      } catch (error) {

        youtube_scrape();
      }
    } else {
      console.log('something went wrong');
    } */
  } else {
    console.log('undefined so passing values');
    const _ip = await proxy_List();
    const _agnt = await rotate_agnt();
    youtube_scrape(_ip, _agnt);
  }

  /* if (ip != -1) {
    try {
      var response = await axios.get('https://httpbin.org/ip', {
        proxy: {
          host: ip.ip,
          port: ip.port
        },
        headers: {
          'user-agent': agnt
        }
      });

      const data = response.data;

      //const $ = cheerio.load(data);

      youtube_scrape();

      console.log(data);
    } catch (error) {
      youtube_scrape();
    }
  } else {
    console.log('something went wrong');
  } */
};

youtube_scrape();

/* const main = async () => {
  const ip = await rotate_proxy();
  const agnt = await rotate_agnt();

  if (ip != -1 && agnt != -1) {
    youtube_scrape(ip, agnt);
  }
};

main(); */

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

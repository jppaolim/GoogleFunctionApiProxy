// @ts-check

//load the config env with API Key 
require('yamlenv').config();

const CONFIG = {
	apiKey: process.env.API_KEY,
	upstream: process.env.UPSTREAMSERVER,
};


const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const bodyParser = require('body-parser');
const queryString = require('querystring');
//const functions = require('@google-cloud/functions-framework');
//var cors = require("cors");

const options = {
  target: CONFIG.upstream, // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  logLevel: "debug",
  logger: console,
  followRedirects: true,
  secure: false,

  onProxyReq: (proxyReq, req, res) => {
    /**
     * @type {null | undefined | object}
     */
    // @ts-ignore
    const body = req.body;
    // Restream parsed body before proxying
    // https://github.com/http-party/node-http-proxy/blob/master/examples/middleware/bodyDecoder-middleware.js
    if (!body || !Object.keys(body).length) {
      return;
    }
    const contentType = proxyReq.getHeader('Content-Type');
    let contentTypeStr = Array.isArray(contentType) ? contentType[0] : contentType.toString();
    // Grab 'application/x-www-form-urlencoded' out of 'application/x-www-form-urlencoded; charset=utf-8'
    contentTypeStr = contentTypeStr.match(/^([^;]*)/)[1];

    let bodyData;
    if (contentTypeStr === 'application/json') {
      bodyData = JSON.stringify(body);
    }

    if (contentTypeStr === 'application/x-www-form-urlencoded') {
      bodyData = queryString.stringify(body);
    }

    if (bodyData) {
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
  //onProxyRes(proxyRes) {
  //  proxyRes.headers['x-added'] = 'foobar'; // add new header to response
  //  delete proxyRes.headers['x-removed']; // remove header from response
  //}

  
};

// create the proxy (without context)
const aProxy = createProxyMiddleware(options);
//const aProxy  = proxy(options);


// mount `aProxy` in web server
const app = express();

// Allow CORS from any origin
//app.use(cors());
//app.set('trust proxy', true);

app.use('/', aProxy);
//app.listen(process.env.PORT);
// Optional: Support special POST bodies - requires restreaming (see below)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


module.exports = {
	proxy: app
//nope veille version  proxy: aProxy
}


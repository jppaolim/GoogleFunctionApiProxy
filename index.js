// @ts-check

//load the config env with API Key 
require('yamlenv').config();

const CONFIG = {
	apiKey: process.env.API_KEY,
	upstream: process.env.UPSTREAMSERVER,
};

//const functions = require('@google-cloud/functions-framework');

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');


const options = {
  target: CONFIG.upstream, // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: true, // proxy websockets
  logger: console,

  onProxyRes(proxyRes) {
    proxyRes.headers['x-added'] = 'foobar'; // add new header to response
    delete proxyRes.headers['x-removed']; // remove header from response
  }
};


// create the proxy (without context)
const aProxy = createProxyMiddleware(options);

// mount `aProxy` in web server
const app = express();
app.use('/*', aProxy);
app.listen(3000);

module.exports = {
	proxy: app
}

//functions.http('proxy', (req, res) => {
//    return aproxy(req, res);
//});
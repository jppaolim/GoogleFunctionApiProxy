// @ts-check

// Simple proxy ... works locally but not on google function due to Huggingface API 
// what I tried :
//ws: true, // proxy websocket 
//followRedirects: true,
//secure: true,
//preserveHeaderKeyCase: true,
//autoRewrite:true,
//protocolRewrite: true,
// Allow CORS from any origin
//app.use(cors());
//app.set('trust proxy', true);
//toProxy: true,

//set to true, it won't work locally and I suspect this breaks down on google  
//xfwd: true, 


//load the config env with API Key 
require('yamlenv').config();

const CONFIG = {
	apiKey: process.env.API_KEY,
	upstream: process.env.UPSTREAMSERVER,
};

//now start creating the proxy 
const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

//options for the proxy 
const options = {
  target: CONFIG.upstream,  
  changeOrigin: true, // needed for virtual hosted sites
  
  // very import for POST request 
  onProxyReq: fixRequestBody,
  logger: console,
  logLevel: "debug"
};

// create the proxy (without context)
const aProxy = createProxyMiddleware(options);

// create the server
const app = express();

//do the login 
morgan.token('req-headers', function(req,res){
  return JSON.stringify(req.headers)
 })
app.use(morgan(':method :url :status :req-headers '));

// mount `aProxy` in web server
app.use('/', aProxy);

module.exports = {
	proxy: app
}


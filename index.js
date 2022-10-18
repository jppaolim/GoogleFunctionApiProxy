//@ts-check

// Simple proxy  : works locally, when tested on google shell, but not when called from outside, may be because of redirections 

//load the environment with the correct API Key, stored in env.yaml locally  
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
  
  // very important for POST request on google cloud  
  onProxyReq: fixRequestBody,
  //logger: console,
  //logLevel: "debug"
};

// create the proxy, the server 
const aProxy = createProxyMiddleware(options);
const app = express();

//create a logger entry
morgan.token('req-headers', function(req,res){
  return JSON.stringify(req.headers)
 })
app.use(morgan(':method :url :status :req-headers '));

// mount the proxy in web server
app.use('/', aProxy);

module.exports = {
	proxy: app
}


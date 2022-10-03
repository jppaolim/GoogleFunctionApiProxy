const queryString = require('querystring');



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
    //  console.log('show req', bodyData);
    }

    if (contentTypeStr === 'application/x-www-form-urlencoded') {
      console.log('show req before string', body);
      //bodyData = queryString.stringify(body);
      //console.log('show req', bodyData);
      bodyData = body.toString();
      //const url = new URL(body);

      //bodyData=  new URLSearchParams(url.search).toString
    }

    if (bodyData) {
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
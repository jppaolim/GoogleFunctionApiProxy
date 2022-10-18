# GoogleFunctionApiProxy
Create a proxy middleware on cloud function to query HuggingFace API

## Please Note it doesn't work on cloud function 
it works locally, it works when tester on cloud shell but it doesn't work when called from a different host. When call from a host different than the one running the proxy, it adds headers like "x-forwarded-for" which I suspect make HuggingFace discard it (502 Bad Gateway is the answer).  

## How to use 
clone
create locally a env.yaml file with the following : 

API_KEY: your_key (ex:  hf_XXXXXXX)
UPSTREAMSERVER: https://api-inference.huggingface.co/

then npm run start to test locally (and it should work 
npm run deploy 


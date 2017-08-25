var http = require('http');

arrayNum = process.argv[2];

var chaincode_name = "80ce8ed980139ad07a1fa87b6765309eaff0e1cedf67be80c29f598dc499a822eb3c00073e78753a00c8e188c35c165439c23e17f0f2fb82afdbae67059a6495";

var post_data = JSON.stringify({
  "jsonrpc": "2.0",
  "method": "invoke",
  "params": {
    "type": 1,
    "chaincodeID":{
      "name": chaincode_name
    },
    "ctorMsg": {
      "function":"sort",
      "args":[process.argv[2]]
    }
  },
  "id": 3
});

console.log(post_data);

var post_options = {
  hostname: 'localhost',
  port    : '7050',
  path    : '/chaincode',
  method  : 'POST',
  headers : {
    'Content-Type': 'application/json',
    'Content-Length': post_data.length
  }
};
var post_req = http.request(post_options, function (res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('Response: ', chunk);
  });
});

post_req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

post_req.write(post_data);
post_req.end();

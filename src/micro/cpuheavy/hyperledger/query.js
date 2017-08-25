var http = require('http');

var chaincode_name = "80ce8ed980139ad07a1fa87b6765309eaff0e1cedf67be80c29f598dc499a822eb3c00073e78753a00c8e188c35c165439c23e17f0f2fb82afdbae67059a6495";

var query_json_data = JSON.stringify({
  "jsonrpc": "2.0",
  "method": "query",
  "params": {
    "type": 1,
    "chaincodeID":{
      "name": chaincode_name
    },
    "ctorMsg": {
      "function":"getTimeCost",
      "args":[process.argv[2]]
    }
  },
  "id": 2
});

var query_json_options = {
  hostname: 'localhost',
  port    : '7050',
  path    : '/chaincode',
  method  : 'POST',
  headers : {
    'Content-Type': 'application/json',
    'Content-Length': query_json_data.length
  }
}

var query_time = function(num){
  var query_req = http.request(query_json_options, function(res){
    console.log('QUERY STATUS: ' + res.statusCode);
    console.log('QUERY HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('QUERY RESPONSE: ', chunk);
    });
  });
  query_req.write(query_json_data);
  query_req.end();
}

query_time(process.argv[2]);


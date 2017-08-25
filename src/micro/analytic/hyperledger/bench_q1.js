var http = require('http');

var start_block = parseInt(process.argv[2])
var end_block = parseInt(process.argv[3])
var max = -1;

var timestamp;

function get_max(block_num) {
  if (block_num == start_block-1) {
    console.log(max);
    console.log("Latency: "+((new Date().getTime()-timestamp)/1000)+" sec");
    process.exit();
  }
  if (block_num % 1000 == 0) {
    console.log("checking: "+block_num);
  }

  var post_data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "query",
    "params": {
      "type": 1,
      "chaincodeID":{
        "name":"4a9d69aad0a1a3587934d5de13c0c8721e2674b33e255210036f6c110f8a41380dae8b26cdc09e5042cb3e21db305c91e470ca65c571add3e6161922ad0ea18b"
        //"name": "analytic"
      },
      "ctorMsg": {
        "function":"QueryBlock",
        "args":[block_num.toString()]
      }
    },
    "id": 3
  });

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
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      var chunk_json = JSON.parse(chunk);
      console.log(chunk_json);
      ret = JSON.parse(chunk_json["result"]["message"]);
      for (var i in ret) {
        max = max > ret[i]["Val"] ? max : ret[i]["Val"];
      }
      
      get_max(block_num-1);
    });
  });

  post_req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  post_req.write(post_data);
  post_req.end();
}

timestamp = new Date().getTime();
get_max(end_block);

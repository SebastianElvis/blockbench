var http = require('http');

var state_key = process.argv[2];

// invoke the write() function in the chaincode
function read_txn(start_key, batch_size) {
  var post_data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "query",
    "params": {
      "type": 1,
      "chaincodeID":{
        "name": "f244e9b16fb29d1edd6ca9ebdedab98dc891413b6d0196de9d5c7e380917d8b683c427551a71de5f73701ff8347518f7be8e996b00e3a030e4ce162d743b5c14"
        //"name": "io"
      },
      "ctorMsg": {
        "function":"read",
        "args":[state_key]
      }
    },
    "id": 3
  });

  // console.log(post_data);

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
}

read_txn(state_key);

var http = require('http');
const batch_size = 20000;

var total_size = parseInt(process.argv[3]);

var chaincode_name = "f244e9b16fb29d1edd6ca9ebdedab98dc891413b6d0196de9d5c7e380917d8b683c427551a71de5f73701ff8347518f7be8e996b00e3a030e4ce162d743b5c14";
//var chaincode_name = "io";
// to query the block of a height
function poll_block(height) {

  var get_options = {
    hostname: 'localhost',
    port    : '7050',
    path    : '/chain/blocks/'+height,
    method  : 'GET',
    headers : {
      'Content-Type': 'application/json'
    }
  };

  var req = http.request(get_options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log(chunk);
    })
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
}

// invoke the write() function in the chaincode
function send_txn(start_key, batch_size) {
  var post_data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "invoke",
    "params": {
      "type": 1,
      "chaincodeID":{
        "name": chaincode_name
      },
      "ctorMsg": {
        "function":"write",
        "args":[start_key.toString(), batch_size.toString()]
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
      console.log("timestamp: "+(new Date().getTime()));
      console.log('Response: ', chunk);
    });
    
  });

  post_req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  post_req.write(post_data);
  post_req.end();
}

var last_height = -1;
var last_time = -1;
var start_key;



function poll_height() {

  var get_height_options = {
    hostname: 'localhost',
    port    : '7050',
    path    : '/chain',
    method  : 'GET',
    headers : {
      'Content-Type': 'application/json'
    }
  };

  var req = http.request(get_height_options, function (res) {
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      height = JSON.parse(chunk).height;
      if (height != last_height) {
        console.log("height != last_height");
        console.log("height = " + height + "\nlast_height = " + last_height); 
        var now_time = new Date().getTime();
        console.log("timestamp: "+ now_time);
        if (last_height != -1) {
          console.log("Latency: "+ ((now_time-last_time)/1000) + " sec");
          start_key += batch_size;
        } else { // last_height == -1
          start_key = parseInt(process.argv[2]);
        }
        //poll_block(height-1);
        console.log("now tip height: " + (height-1));
        if (start_key < total_size) {
          console.log(start_key+": ");
          send_txn(start_key, batch_size);
          now_time = new Date().getTime();
        } else {
          process.exit();
        }
        last_height = height;
        last_time = now_time;
      }else {
        console.log("height == last_height");
        console.log("height = " + height + "\nlast_height = " + last_height);
      }
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
}

//setInterval(poll_height, 100);
send_txn(parseInt(process.argv[2]), parseInt(process.argv[3]));

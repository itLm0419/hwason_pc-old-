// let redis = require('redis');
// let client = redis.createClient('6379', '139.196.254.191');
// client.on("error", function(error) {
//        console.log(error);
//    });
// module.exports = client;
let Redis = require('ioredis');
var redis = new Redis( 6379,'139.196.254.191');
module.exports = redis;

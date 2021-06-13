var fs = require('fs');
// var rs = fs.createReadStream('test.md');
var rs = fs.createReadStream('test.md', {hightWaterMark: 15});
var data= '';
rs.on('data', function(chunk) {
    data += chunk;
});
rs.on('end', function() {
    console.log(data);
});

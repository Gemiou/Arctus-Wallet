var fs = require('fs');

// PACKAGE_ERROR and FILE_ERROR is shown on your error
var browserFile = './node_modules/@angular/cli/models/webpack-configs/browser.js';
fs.readFile(browserFile, 'utf8', function (err,data) {
  if (err) return console.log(err);

  var result = data.replace("crypto: 'empty'", "// crypto: 'empty'");

  fs.writeFile(browserFile, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });

});

var shapeshiftFile = './node_modules/shapeshift.io/lib/shapeshift.js';
fs.readFile(shapeshiftFile, 'utf8', function (err,data) {
  if (err) return console.log(err);

  var result = data.replace("'../package'", "'../package.json'");

  fs.writeFile(shapeshiftFile, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });

});
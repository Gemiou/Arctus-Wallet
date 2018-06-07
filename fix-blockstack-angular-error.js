var fs = require('fs');

// ./node_modules/@angular/cli/models/webpack-configs/browser.js
// delete all occurancies of the string crypto: 'empty'

// ./webpack.config.js
// And delete all occurancies of the string crypto: true

// PACKAGE_ERROR and FILE_ERROR is shown on your error
var filename = './node_modules/@angular/cli/models/webpack-configs/browser.js';
fs.readFile(filename, 'utf8', function (err,data) {
  if (err) return console.log(err);

  var result = data.replace("crypto: 'empty'", "// crypto: 'empty'");

  fs.writeFile(filename, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });

});
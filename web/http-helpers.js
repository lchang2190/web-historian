var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  archive.isUrlArchived(asset, function(expect) {
    if (expect) {
      callback(true);
    } else {
      //will add this url to the list by calling the helper functions
      archive.addUrlToList(asset);
      callback(false);
    }
  });
};

exports.serveStaticFiles = function(path, res) {
  fs.readFile(path, function(err, data) {
    if (!err) {
      res.writeHead(200, exports.headers);
      res.write(data);
      res.end();
    } else {
      console.log('Error');
      res.writeHead(404, exports.headers);
      res.end();
    }
  });

};



// As you progress, keep thinking about what helper functions you can put here!

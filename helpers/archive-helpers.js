var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var https = require('https');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    if (!err) {
      var arrayOfUrls = data.toString().split('\n');
      callback(arrayOfUrls);
    } else {
      console.log('UNABLE TO READ');
    }
  });
};

exports.isUrlInList = function(url, callback) {

  fs.readFile(exports.paths.list, function(err, data) {
    if (!err) {
      var arrayOfUrls = data.toString().split('\n');
      var isInList = arrayOfUrls.includes(url) || false; 
      callback(isInList);
    } else {
      console.log('UNABLE TO READ');
    }
  });
  
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(expect) {
    
    if (!expect) {
      //console.log('writing file'); 
      fs.appendFile(exports.paths.list, '\n' + url, function(err) {
        console.log('writing file'); 
        if (err) { 
          throw err;
        }
        //console.log('writing file'); 
      }); 
      //fetch for data in sites.txt!!
    } 
      //write sites.txt
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readFile(exports.paths.archivedSites + '/' + url, function(err, data) {
    if (!err) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url, index) {
    var requestSpecs = {
      host: url,
      port: 80,
      path: '/',
      method: 'GET'
    };
    console.log(urls);
    if (url !== '') {
      https.get('https://' + url, (res) => {
        res.setEncoding('utf8');
        let body = '';
        console.log('inside GET REQUEST');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          fs.writeFile(exports.paths.archivedSites + '/' + url, body, (err) => {  
            if (err) {
              console.log('unable to create file in archive');
            }
            console.log('we stored it!!');
          });
        });

        res.on('error', (e) => {
          console.log('downloading urls failed', e);
        });
      });    
    }
    

  });
};






var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');
var httpHelpers = require('./http-helpers');
var htmlFetcher = require('../workers/htmlfetcher');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var route = url.parse(req.url, false).pathname;
  console.log('requests ' + req.method + route);
  htmlFetcher.htmlFetcher();
  if ( req.method === 'GET' && route === '/' ) {
    httpHelpers.serveStaticFiles(archive.paths.siteAssets + '/index.html', res);
  } else if ( route.includes('.com') ) {

    //will we need this. ??? 
  } else if ( req.method === 'POST' ) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      console.log(body);
      var queriedWebsite = body.slice(4);
      console.log(queriedWebsite);
      httpHelpers.serveAssets(res, queriedWebsite, function(foundTheArchive) {
        console.log('archived?', foundTheArchive);
        if (foundTheArchive) {
          //send back a response with the archived html
          console.log(archive.paths.archivedSites + queriedWebsite);
          httpHelpers.serveStaticFiles(archive.paths.archivedSites + '/' + queriedWebsite, res);

        } else {
          //send the loading html.
          httpHelpers.serveStaticFiles(archive.paths.siteAssets + '/loading.html', res);
        }
         
      });
    });
    
  } else {
    httpHelpers.serveStaticFiles(archive.paths.siteAssets + route, res);
  }
  
  //res.end(archive.paths.list);
};

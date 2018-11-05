var gulp = require('gulp');

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'public';

  swPrecache.write(path.join(rootDir, 'service-worker2.js'), {
    staticFileGlobs: [
      rootDir + '/angular-chart.js/*.{js,html,css,png,jpg,gif}',
      rootDir + '/controllers/*.{js,html,css,png,jpg,gif}',
      rootDir + '/css/*.{js,html,css,png,jpg,gif}',
      rootDir + '/img/*.{js,html,css,png,jpg,gif}',
      rootDir + '/js/*.{js,html,css,png,jpg,gif}',
      rootDir + '/vendor/**/*.{js,html,css,png,jpg,gif}',
      rootDir + '/vendor/**/*.*',
      rootDir + '/views/*.{js,html,css,png,jpg,gif}',
      rootDir + '/manifest.json',
      rootDir + '/*.js',
      rootDir + '/',
      rootDir + '/dashboard'
    ],
    stripPrefix: rootDir,
    navigateFallback: '/'
  }, callback);
});
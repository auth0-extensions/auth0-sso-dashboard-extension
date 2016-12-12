const path = require('path');
const gulp = require('gulp');
const open = require('open');
const ngrok = require('ngrok');
const util = require('gulp-util');
const nodemon = require('gulp-nodemon');

gulp.task('run', () => {
  ngrok.connect(3000, (ngrokError, url) => {
    if (ngrokError) {
      throw ngrokError;
    }

    nodemon({
      script: './build/webpack/server.js',
      ext: 'js json',
      cwd: path.join(__dirname, '/../'),
      env: {
        EXTENSION_SECRET: 'a-random-secret',
        AUTH0_RTA: 'https://auth0.auth0.com',
        NODE_ENV: 'development',
        WT_URL: url,
        PUBLIC_WT_URL: url
      },
      ignore: [
        path.join(__dirname, '../assets/app/'),
        path.join(__dirname, '../server/data.json'),
        path.join(__dirname, '../server/config.json'),
        path.join(__dirname, '../build/'),
        path.join(__dirname, '../client/'),
        path.join(__dirname, '../tests/'),
        path.join(__dirname, '../node_modules/')
      ]
    });

    setTimeout(() => {
      const publicUrl = `${url.replace('https://', 'http://')}/admins/login`;
      open(publicUrl);
      util.log('Public Url:', publicUrl);
    }, 4000);
  });
});

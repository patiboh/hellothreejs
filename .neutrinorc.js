const airbnbBase = require('@neutrinojs/airbnb-base');
const web = require('@neutrinojs/web');
const jest = require('@neutrinojs/jest');
const copy = require('@neutrinojs/copy');

module.exports = {
  use: [
    airbnbBase(),
    web({
      html: {
        title: 'threejs'
      }
    }),
    copy({
      patterns: [{
        context: 'src/static',
        from: '**/*',
        to: 'static',
      }],
    }),
    jest()
  ]
};

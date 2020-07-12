const standardjs = require('@neutrinojs/standardjs');
const web = require('@neutrinojs/web');
const jest = require('@neutrinojs/jest');
const copy = require('@neutrinojs/copy');

module.exports = {
  use: [
    standardjs(),
    web({
      html: {
        title: 'threejs',
      },
    }),
    copy({
      patterns: [
        {
          context: 'src/static',
          from: '**/*',
          to: 'static',
        },
      ],
    }),
    jest(),
  ],
};

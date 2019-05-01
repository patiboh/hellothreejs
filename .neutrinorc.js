module.exports = {
  use: [
    '@neutrinojs/airbnb-base',
    [
      '@neutrinojs/web',
      {
        html: {
          title: 'threejs'
        }
      }
    ],
    '@neutrinojs/jest'
  ]
};

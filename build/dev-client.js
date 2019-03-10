  require('eventsource-polyfill')
  var hotClient = require('webpack-hot-middleware/client?reload=true')
  hotClient.subscribe(function (event) {
    if (event.action === 'hbs-reload') {
      window.location.reload()
      console.log(event.data);
    }
  })
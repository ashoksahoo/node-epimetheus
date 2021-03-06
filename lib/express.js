const metrics = require('./metrics')

function middleware (request, response, done) {
  var start = process.hrtime()

  response.on('finish', function () {
    if (request.route) {
      metrics.observe(request.method, request.route.path, response.statusCode, start);
    } else {
      metrics.observe(request.method, '', response.statusCode, start);
    }

  });

  return done()
};

function instrument (server, options) {
  server.use(middleware)
  server.get(options.url, (req, res) => {
    res.header('content-type', 'text/plain; charset=utf-8')
    return res.send(metrics.summary())
  })
}

function instrumentable (server) {
  return server && server.defaultConfiguration && server.use
}

module.exports = {
  instrumentable: instrumentable,
  instrument: instrument
}

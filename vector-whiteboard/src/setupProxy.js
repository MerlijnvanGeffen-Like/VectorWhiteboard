const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      timeout: 30000,
      proxyTimeout: 30000,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy Error', message: err.message });
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxy Request:', req.method, req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy Response:', proxyRes.statusCode);
      }
    })
  );
}; 
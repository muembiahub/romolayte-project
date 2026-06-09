import http from 'http';

const data = JSON.stringify({ usernameOrEmail: 'test', password: 'test' });
const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('body', body));
});

req.on('error', e => console.error('ERROR', e.message));
req.write(data);
req.end();

export default function handler(req, res) {
  res.writeHead(301, { Location: 'https://domainbaru.com' + req.url });
  res.end();
}

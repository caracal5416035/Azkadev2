export default function handler(req, res) {
  res.writeHead(301, { Location: 'https://azkaarrodhi.vercel.app' + req.url });
  res.end();
}

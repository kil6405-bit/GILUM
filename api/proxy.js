export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') { return res.status(200).end(); }

  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxzDJ3VgUF_amqxSBbE_bpkEKK0mxkcfBRhMHY0jsR1DBbUWZGQiLGQGNrbNf1F-muJuA/exec';

  try {
    if (req.method === 'GET') {
      const params = new URLSearchParams(req.query);
      params.delete('callback');
      const url = SHEETS_URL + '?' + params.toString();
      const response = await fetch(url, { redirect: 'follow' });
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        return res.status(200).json(json);
      } catch {
        return res.status(200).send(text);
      }
    }
    if (req.method === 'POST') {
      const response = await fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        redirect: 'follow'
      });
      const text = await response.text();
      try {
        return res.status(200).json(JSON.parse(text));
      } catch {
        return res.status(200).json({ result: 'ok' });
      }
    }
  } catch (err) {
    return res.status(500).json({ result: 'error', msg: err.toString() });
  }
}

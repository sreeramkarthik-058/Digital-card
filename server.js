const express = require('express');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/qr', async (req, res) => {
  try {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const qrDataUrl = await QRCode.toDataURL(baseUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2D5016',
        light: '#FFFFF0'
      }
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Code — Dr. Rajashri Sonti</title>
  <style>
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #FFFFF0;
      font-family: 'Georgia', serif;
      padding: 2rem;
      box-sizing: border-box;
    }
    .card {
      background: #fff;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 8px 40px rgba(45,80,22,0.12);
      text-align: center;
      max-width: 360px;
      width: 100%;
    }
    h1 { color: #2D5016; font-size: 1.4rem; margin: 0 0 0.4rem; }
    p { color: #7A6A3A; font-size: 0.95rem; margin: 0 0 1.5rem; }
    img { border-radius: 12px; width: 260px; height: 260px; }
    a {
      display: inline-block;
      margin-top: 1.5rem;
      color: #C8961E;
      font-size: 0.9rem;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Dr. Rajashri Sonti</h1>
    <p>Scan to view digital card</p>
    <img src="${qrDataUrl}" alt="QR Code">
    <br>
    <a href="/">← Back to Card</a>
  </div>
</body>
</html>`;
    res.send(html);
  } catch (err) {
    res.status(500).send('Error generating QR code');
  }
});

app.get('/contact.vcf', (req, res) => {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Dr. Rajashri Sonti',
    'N:Sonti;Rajashri;;;Dr.',
    'TITLE:MD Ayurveda',
    'TEL;TYPE=CELL:+918788119332',
    'EMAIL:info@ayurasayani.com',
    'URL:https://ayurasayani.com/',
    'X-SOCIALPROFILE;type=instagram:https://www.instagram.com/rasayani_ayurveda/',
    'X-SOCIALPROFILE;type=linkedin:https://www.linkedin.com/in/dr-rajashrisonti/',
    'END:VCARD'
  ].join('\r\n');

  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="Dr-Rajashri-Sonti.vcf"');
  res.send(vcard);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

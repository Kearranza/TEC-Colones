const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api/https://cuentatec.azurewebsites.net/api/StudentValidator', (req, res) => {
    const carnet = req.query.carnet;
    if (carnet && carnet.startsWith('2')) {
        res.json({ ResponseCode: 200, Message: 'Valid student ID' });
    } else {
        res.status(500).json({ ResponseCode: 500, Message: 'Invalid student ID' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/login', (req, res)  => {
    const { username, pass } = req.body;
    const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
    res.json({ success: 'true', token: accessToken });
});


router.post('/checkingAuth', authentication, (req, res) => {
    res.json({ success: 'true' })
});

function authentication(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if(token == null) {
        res.json({ success: 'false' })
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokens) => {
        if(err) {
            res.json({ success: 'false' });
            return;
        }
        next();
    })
}

module.exports = { authentication }

module.exports = router;
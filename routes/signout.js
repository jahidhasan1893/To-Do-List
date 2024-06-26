const express = require('express');
const router = express.Router();


router.get('/', (req, res)=>{
    res.locals.user = "";
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;
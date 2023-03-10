const express = require('express')
const {sentiment} = require('../util/nlp');
const router = express.Router()

router.post('/sentiment',async (req,res)=>{
    const {text} = req.body;
    var getSentiment = await sentiment(text);
    return res.json(getSentiment);  
})

module.exports = router;
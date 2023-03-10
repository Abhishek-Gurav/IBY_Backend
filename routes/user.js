const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register-user',async (req,res)=>{
    const {username,email,password} = req.body;
    const encryptedPassword = await bycrypt.hash(password, 10);
    const oldUser = await User.findOne({email:email});
    if(oldUser){
        return res.send({message:"User already exists"});
    }
    try {
        await User.create({username,email,password: encryptedPassword});    
        res.send({status:"ok"})
    }
    catch (error) {
        res.send({status:"error",error})
    }
})
router.post('/login-user',async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        return res.send({message:"User not found"});
    }
    if(await bycrypt.compare(password,user.password)){
        const token = jwt.sign({email: user.email},JWT_SECRET);
        if(res.status(201)){
            return res.json({status: "ok", data :  token});
        }else{
            return res.json({error :  "error"});
        }
    }
    res.json({status: "error", error : 'Invalid username/password'});
})

router.post('/userDetails',async (req,res)=>{
    const {token} = req.body;
    try {
        const user = jwt.verify(token,JWT_SECRET);
        // console.log(user);
        const useremail = user.email;
        User.findOne({email:useremail}).then((data)=>{
            res.send({status:"ok",data : data});
        }).catch((err)=>{
            res.send({status:"error",err: err});
        })
    } catch (error) {
        res.send({error:"Invalid token"});
    }
})

module.exports = router;
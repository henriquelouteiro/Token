const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const app = express()

require('dotenv').config()
const SECRET = process.env.SECRET

app.use(express.json());

function verifyJWT(req,res, next){
    const token = req.headers['x-acess-token']
    console.log(req.headers)
    jwt.verify(token,SECRET, (err,decoded)=>{
        if(err) return res.status(401).end

        req.userId = decoded.userId
        next()
    })
}

app.get("/", (req,res)=>{
    res.send("API - CERDIL")
})

app.get("/blip", verifyJWT , (req,res)=>{
    console.log(req.userId + " Fez essa chamada!")
    res.json({
        "nome" : "Jose_Louteiro",
        "Senha" : "0505"
    })
})

app.post("/login", (req,res)=>{
    const {login,password} = req.body
    if(login === process.env.LOGIN && password === process.env.PASSWORD){
        const token = jwt.sign({userId: 1}, SECRET, {expiresIn: 30})
        return res.json({auth:true, token})
    }
    return res.status(401).end()
})

module.exports = app
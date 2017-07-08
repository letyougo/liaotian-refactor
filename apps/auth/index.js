/**
 * Created by xiaoxiaosu on 17/7/6.
 */
var model = require('../../config/model')

const POST = model.Post
const connect =model.connect
var express = require('express')

var router = express.Router()


router.get('/login',(req,res)=>{

    res.render('login')
})

router.get('/logout',(req,res)=>{
    res.clearCookie('dongnao_chat')
    res.clearCookie('user_id')
    res.redirect('/auth/login')
})

router.post('/login',(req,res)=>{
    model.User.find({
        where:{
            username:req.body.username,
            password:req.body.password
        }
    }).then((item)=>{
        if(!item){
            res.send({
                error:'not found'
            })
        }else {

            res.cookie('user_id',item.id,{maxAge:60000000})
            res.redirect('/')
        }
    })
})



module.exports = router
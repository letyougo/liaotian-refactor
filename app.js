/**
 * Created by Administrator on 2017/6/11.
 */

var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser')
var path = require('path')
var model = require("./config/model")

var {redis} = require("./config/model")

var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment')

app.set('view engine', 'ejs')

console.log(process.env.aaa, 'process.env.aaa')
app.use(bodyParser({
    urlencoded: false
}))
app.use(bodyParser.json())
app.use(cookieParser())
var user = require('./apps/user')
app.use('/static', express.static(path.join(__dirname, 'static')))



app.use(fileUpload())
app.use('/auth',require('./apps/auth'))
app.use((req,res,next)=>{
    if(!req.cookies.user_id){
        res.redirect('/auth/login')
    }else {
        model.User.findById(req.cookies.user_id).then(item=>{
            res.locals.user = item
            next()
        })

    }
})

app.use('/user', user)
app.use('/post', require('./apps/post'))
app.use('/comment', require('./apps/comment'))
app.post('/upload', function (req, res) {
    var file = req.files.file
    var name = Date.parse(new Date()) + '.' + file.name
    var url = 'http://localhost:3000/static/uploads/' + name
    var p = path.join(__dirname, 'static', 'uploads', name)
    file.mv(p, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send({url: url});
    });
})

app.get("/", (req, res) => {
    res.render('index')
})

app.get('/message',(req,res)=>{
    var from = req.query.from
    var to = req.query.to
    redis.lrange(from+'-'+to,0,-1,(err,list)=>{



        list = list.map(item=>{
            return JSON.parse(item)
        })

        list = list.sort((a,b)=>{
            return a.timeStamp > b.timeStamp
        })
        res.send(list)
    })
})


if (process.env.NODE_ENV == 'development') {
    app.set('json spaces', 4);
    var webpackMiddleware = require("webpack-dev-middleware");

    var front_app_config = require('./front-app/webpack-config/webpack.dev.conf')

    var compiler = require('webpack')(front_app_config)
    app.use(webpackMiddleware(compiler, {serverSideRender: true}))

    app.get('/chat', (req, res) => {

        var user = res.locals.user
        res.send(`
            <html>
                <head>
                <title>My App</title>
                <meta name="viewport"
                    content="width=360,user-scalable=no">
                    <script src="/socket.io/socket.io.js"></script>
                </head>
                <body>
                    <h3>${user.username}<a href="/auth/logout">退出</a></h3>
                    <div id="app"></div>
                </body>
                <script>
               
                    var user = {
                        name : "${user.username}",
                        id:${user.id},
                        logo:"${user.logo}"               
                    }
                </script>
                <script src="chat.js"></script>
              
            </html>
	`)
    })

    app.get('/admin', (req, res) => {

        res.send(`
               <html>
                 <head>
                   <title>My App</title>

                 </head>
                 <body>
                   <div id="app"></div>
                   <script src="admin.js"></script>
              
                 </body>
               </html>
        `)
    })
} else {
    app.get('/chat', (req, res) => {
        res.render('chat')
    })
    app.get('/admin', (req, res) => {
        res.render('admin')
    })
}


var clients = {};
io.on('connection', (socket) => {

    console.log('user connected');
    socket.on('login',(name)=>{
        console.log(name,'name')
        clients[name] = socket
    })
    socket.on('send-message',(obj)=>{
        console.log('send receive message to user',obj.to)
        redis.lpush(obj.from+'-'+obj.to,JSON.stringify(Object.assign({},obj,{type:'send',timeStamp:moment.now(),read:true})));
        redis.lpush(obj.to+'-'+obj.from,JSON.stringify(Object.assign({},obj,{type:'receive',timeStamp:moment.now(),read:false})));

        if(clients[obj.to]){

            clients[obj.to].emit('receive-message',obj)
        }
    })

    socket.on('send-request',(obj)=>{
        console.log('i am send reqeust')
        model.Request.create({
            fromId:obj.fromId,
            toId:obj.toId,
            content:obj.content,
            read:0
        }).then((item)=>{

            if(clients[obj.to]){

                clients[obj.to].emit('receive-request',obj)
            }
        })
    })
    socket.on('accept-request',(obj)=>{
        model.Request.findById(obj.id).then((item)=>{
            item.update({
                read:1,
                response:1
            }).then((o)=>{
                model.Relation.create({
                    userId:obj.fromId,
                    friendId:obj.toId
                }).then((u)=>{
                    if(clients[obj.to]){
                        clients[obj.to].emit('receive-request',obj)
                    }
                })
            })
        })
    })
    socket.on("disagree-request",(obj)=>{
        model.Request.findById(obj.id).then((item)=>{
            item.update({
                read:1,
                response:0
            }).then((o)=>{
                if(clients[obj.to]){
                    clients[obj.to].emit('receive-request',obj)
                }
            })
        })
    })
});



http.listen(3000)
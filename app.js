/**
 * Created by Administrator on 2017/6/11.
 */

var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser =require('body-parser')
var fileUpload = require('express-fileupload');
var path = require('path')
var webpackMiddleware = require("webpack-dev-middleware");
var front_app_config = require('./front-app/webpack-config/webpack.dev.conf')
var {debug} = require('./config')

var webpack = require('webpack')
var compiler = webpack(front_app_config)
app.set('view engine','ejs')

console.log(process.env.aaa,'process.env.aaa')
app.use(bodyParser({
    urlencoded:false
}))
app.use(bodyParser.json())
var user = require('./apps/user')
app.use('/static',express.static(path.join(__dirname,'static')))

app.use(cors())
app.use(fileUpload())
app.use('/user',user)
app.use('/post',require('./apps/post'))
app.use('/comment',require('./apps/comment'))
app.post('/upload',function (req, res) {
    var file = req.files.file
    var name = Date.parse(new Date())+'.'+file.name
    var url = 'http://localhost:3000/static/uploads/'+name
    var p = path.join(__dirname,'static','uploads',name)
    file.mv(p, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send({url:url});
    });
})

app.get("/",(req,res)=>{
    res.render('index')
})

function normalizeAssets(assets) {
    return Array.isArray(assets) ? assets : [assets]
}

if(debug){
    app.set('json spaces', 4);
    app.use(webpackMiddleware(compiler, {serverSideRender: true}))
    app.get('/chat',(req,res)=>{
        const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName
        res.send(`
            <html>
              <head>
                <title>My App</title>
                    
              </head>
              <body>
                <div id="app"></div>
                    ${
            normalizeAssets(assetsByChunkName.chat)
                .filter(path => path.endsWith('.js'))
                .map(path => `<script src="${path}"></script>`)
                .join('\n')
            }
              </body>
            </html>
	`)
    })

    app.get('/admin',(req,res)=>{
        const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName
        res.send(`
               <html>
                 <head>
                   <title>My App</title>

                 </head>
                 <body>
                   <div id="app"></div>
                       ${
           normalizeAssets(assetsByChunkName.admin)
               .filter(path => path.endsWith('.js'))
               .map(path => `<script src="${path}"></script>`)
               .join('\n')
           }
                 </body>
               </html>
        `)
    })
}else {
    app.get('/chat',(req,res)=>{
        res.render('chat')
    })
    app.get('/admin',(req,res)=>{
        res.render('admin')
    })
}



app.listen(3000)
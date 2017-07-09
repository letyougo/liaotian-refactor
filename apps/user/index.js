/**
 * Created by Administrator on 2017/6/11.
 */

var model = require('../../config/model')

const USER = model.User
const connect = model.connect
var express = require('express')

var router = express.Router()




router.get('/',function (req, res) {
    if(req.query.offset && req.query.limit){
        USER.findAll({
            offset:req.query.offset,
            limit:req.query.limit
        }).then(function (users) {
            res.send(users)
        })
    }else {
        USER.findAll().then(function (users) {
            res.send(users)
        })
    }
})

router.get('/search',function (req, res) {
    model.connect.query(`
        select * from users where username like '%${req.query.username}%'
    `,{model:model.User})
        .then((users)=>{
            res.send(users)
        })
})

router.patch('/:id',(req,res)=>{
    model
        .User.findById(req.params.id)
        .then(item=>{
            item.update(req.body)
                .then(obj=>{
                    res.send(obj)
                })
        })

})


router.get('/:id/detail',(req,res)=>{
    USER.findById(req.params.id)
        .then(item=>{
            connect.query(
                'SELECT * FROM posts WHERE userId = ? ',
                {model:model.Post,replacements:[req.params.id]}
            ).then((list)=>{
                item.dataValues.post = list
                connect.query(
                    'SELECT * FROM users WHERE id IN (SELECT userId FROM relations WHERE friendId = ?) OR id in (SELECT friendId FROM relations WHERE userId = ?)',
                    {model:model.User,replacements:[req.params.id,req.params.id]}
                ).then((list)=>{
                    item.dataValues.friend = list
                    res.send(item)
                })

            })
        })
})

router.get('/:id/post',(req,res)=>{
    connect.query(
        'SELECT * FROM posts WHERE userId = ? ',
        {model:model.Post,replacements:[req.params.id]}
    ).then((list)=>{
        res.send(list)
    })
})

router.get('/:id/post_detail',(req,res)=>{
    connect.query(`
            SELECT
          posts.id as id,
          posts.title as titile,
          posts.content as content,
          posts.createdAt,
          comments.content as c_content,
          users.username as u_name,
          users.logo as u_logo,
          comments.userId as c_u_id,
          stars.userId as s_u_id
        FROM posts LEFT JOIN comments  ON comments.postId = posts.id LEFT JOIN stars ON stars.postId = posts.id
          LEFT JOIN users ON posts.userId = users.id
        WHERE posts.userId in (SELECT friendId FROM relations WHERE relations.userId=${req.params.id})
        OR posts.userId in  (SELECT relations.userId FROM relations WHERE relations.friendId=${req.params.id})
        `
        ,{model:model.Post}
    ).then(post=>{

        res.send(post)
    })
})

router.post('/:id/post',(req,res)=>{
    model.Post.create({
        userId:req.params.id,
        title:req.body.title,
        content:req.body.content
    }).then((item)=>{
        res.send(item)
    })
})

router.patch('/:userId/post/:postId',(req,res)=>{
    model
        .Post.findById(req.params.postId)
        .then(post=>{
            post.update(req.body)
                .then((item)=>{
                    res.send(item)
                })
        })
})

router.delete('/:userId/post/:postId',(req,res)=>{
    model
        .Post.findById(req.params.postId)
        .then(post=>{
            post.destroy()
                .then((item)=>{
                    res.send(item)
                })
        })
})

router.get('/:id/friend',(req,res)=>{
    connect.query(
        'SELECT * FROM users WHERE id IN (SELECT userId FROM relations WHERE friendId = ?) OR id in (SELECT friendId FROM relations WHERE userId = ?)',
        {model:model.User,replacements:[req.params.id,req.params.id]}
    ).then((list)=>{
        res.send(list)
    })
})

router.get('/:id/request',(req,res)=>{
    connect.query(`
    SELECT
    requests.id,
    requests.content,
    users.username AS username,
    users.logo AS logo,
    requests.fromId,
    requests.toId
    FROM requests LEFT JOIN users ON requests.fromId=users.id WHERE toId = ${req.params.id}
`,{model:model.Request}).then((receive)=>{


        connect.query(`
            SELECT
                requests.id,
                requests.content,
                users.username AS username,
                users.logo AS logo,
                requests.fromId,
                requests.toId
            FROM requests LEFT JOIN users ON requests.toId=users.id WHERE fromId = ${req.params.id}
            
        `,{model:model.Request}).then((send)=>{
            var obj = {}
            obj.send = send
            obj.receive = receive
            res.send(obj)
        })

    })
})


router.post('/:id/friend',(req,res)=>{
    connect.query(
        'INSERT INTO relations (createdAt, updatedAt, userId, friendId) VALUES (NOW(),NOW(),?,?)',
        {model:model.Relation,replacements:[req.params.id,req.body.friendId]}
    ).then((item)=>{
        res.send(item)
    })
})

router.get('/:id',(req,res)=>{
    USER.findById(req.params.id)
        .then(item=>{
            res.send(item)
        })
})


module.exports = router
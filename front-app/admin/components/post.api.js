/**
 * Created by Administrator on 2017/6/11.
 */


import request from 'superagent'


export const get_all_post = function (cb) {
  request
    .get('/post')
    .end(function (err,res) {
        cb(res.body)
    })
}

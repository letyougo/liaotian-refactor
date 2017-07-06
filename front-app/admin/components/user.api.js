/**
 * Created by Administrator on 2017/6/11.
 */


import request from 'superagent'


export const get_all_user = function (cb) {
  request
    .get('/user')
    .end(function (err,res) {
        cb(res.body)
    })
}

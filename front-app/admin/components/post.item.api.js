

import request from 'superagent'


export const detail = function (id,cb) {
  request
    .get('/post/'+id)
    .end(function (err,res) {
      cb(res.body)
    })
}



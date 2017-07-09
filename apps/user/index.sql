\SELECT
  posts.id as id,
  posts.title as titile,
  posts.content as content,
  posts.createdAt,
  comments.content as c_content,
  comments.userId as c_u_id,

  stars.userId as s_u_id
FROM posts LEFT JOIN comments ON comments.postId = posts.id LEFT JOIN stars ON stars.postId = posts.id
WHERE posts.userId in (SELECT friendId FROM relations WHERE relations.userId=1)
OR posts.userId in  (SELECT relations.userId FROM relations WHERE relations.friendId=1)
const db = require('../db')
const jwt = require('jsonwebtoken')

exports.getPosts = (req, res) => {
    const query = req.query.cat
    ? 'SELECT * FROM posts WHERE cat = ?'
    : 'SELECT * FROM posts';

    db.query(query, [req.query.cat], (err, data) => {
        if(err) return res.status(500).send(err);

        return res.status(200).json(data)
    })
}

exports.getPost = (req, res) => {
    const query = 'SELECT `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON  u.id = p.id WHERE p.id = ?'

    db.query(query, [req.params.id], (err, data) => {
        if(err) return res.status(500).json(err);

        return res.status(200).json(data[0])
    })
}

exports.addPost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json('Not authenticated!')

    jwt.verfiy(token, 'secretkey', (err, userInfo) => {
        if(err) return res.status(403).json('Token is not valid')
    
    const query =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];

    db.query(query, [values], (err, data) => {
        if(err) return res.status(500).json(err)
        return res.json('post has been created')
    })
})
}

exports.deletePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");

      const postId = req.params.id;
      const query = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";
    
      db.query(query, [postId, userInfo.id], (err, data) => {
        if (err) return res.status(403).json("You can delete only your post!");
        
      return res.json("Post has been deleted!");
      })

    })
}

exports.updatePost = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const postId = req.params.id;
      const query =
        "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";
  
      const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];
  
      db.query(query, [...values, postId, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been updated.");
      });
    });
  };
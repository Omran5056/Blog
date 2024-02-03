const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.register = (req, res) => {
  // check existing user
  const query = 'SELECT * FROM users WHERE email = ? OR  username = ? ';

  db.query(query, [req.body.email, res.body.name], (err, data) => {
    if(err) return res.json(err);
    if(data.length) return res.status(409).json('user already exists!')

    // hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const query = 'INSERT INTO users(`username`, `email`, `password`) VALUES (?)';
    const values = [req.body.username, req.body.email, hash];

    db.query(query, [values], (err, data) => {
    if(err) return res.json(err);
    return res.status(200).json('user has been created')
   } )
  })
}


exports.login = (req, res) => {
    // check if user exist  
    const query = 'SELECT * FROM users WHERE username = ? ';

    db.query(query, [res.body.name], (err, data) => {
      if(err) return res.json(err);
      if(data.length === 0) return res.status(404).json('user not found');

    // check if password is correct
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)

    if(!isPasswordCorrect) return res.status(400).json('wrong username or password')
    })

    const token = jwt.sign({id: data[0].id}, 'secretkey');
    const {password, ...other} = data[0];

    res.cookie('access_token', token, {
      httpOnly: true,
    })
    .status(200)
    .json(data)

}

exports.logout = (req, res) => {
    
  res.clearCookie('access_token', {
    sameSite: 'none',
    secure: true,
  }).status(200).json('user has been logged out')
}
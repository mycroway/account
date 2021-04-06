const jwt = require("jsonwebtoken");
require('dotenv').config
const User = require('../models/User')

const JWTSecret = process.env["JWT_SECRET"];


module.exports = async (req, res, next) => {
  const authToken = req.headers['authorization']

  if (authToken != undefined) {
    const token = authToken.split(' ')

    jwt.verify(token[1], JWTSecret, async (error, data) => {
     var user = await User.findOne({where: {id: data.userId}})
      if (error) {
        res.status(401);
        res.json({
          error: "Token de login inválido!"
        });
      } else {
        if (user.emailChecked) {
        req.token = token
        req.user = {
          id: data.userId
        }
        next()
        } else {
          res.status(403)
          res.json({error: 'O seu e-mail ainda não foi válidado!'})
        }
      }
    });
  } else {
    res.status(401);
    res.json({
      error: "O usuário não está logado, e para acessar esta página ele precisa está"

    });
  }

}
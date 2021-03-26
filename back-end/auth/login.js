const jwt = require("jsonwebtoken");
require('dotenv').config

const JWTSecret = process.env["JWT_SECRET"];


module.exports = async (req, res, next) => {
  const authToken = req.headers['authorization']

  if (authToken != undefined) {
    const token = authToken.split(' ')

    jwt.verify(token[1], JWTSecret, (error, data) => {
      if (error) {
        res.status(401);
        res.json({
          message: "Token de login inválido!"
        });
      } else {
        req.token = token
        req.user = {
          id: data.userId
        }
        next()
      }
    });
  } else {
    res.status(401);
    res.json({
      message: "O usuário não está logado, e para acessar esta página ele precisa está"

    });
  }

}
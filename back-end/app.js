const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const User = require('./models/User')
const bcrypt = require('bcryptjs')
const emailConfig = require('./email/')
const crypto = require('crypto');
const util = require('util')
const randomBytes = util.promisify(crypto.randomBytes)
const emailTemplate = require('./email/template')
const verifyTemplateEmail = require('./email/verify')
require('dotenv').config()
const loginAuth = require('./auth/login')
const checkedAuth = require('./auth/checked')
const jwt = require("jsonwebtoken");
const JWTSecret = process.env["JWT_SECRET"];
const cors = require('cors')

// API config
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use(cors())


// Routers
app.get('/', loginAuth, async (req, res) => {
  //req.user = {id: 3}
  try {
    var user = await User.findOne({
      where: {
        id: req.user.id
      }})

    if (user) {
      user.password = undefined
      user.dataValues.token = undefined
      res.status(200)
      res.json({
        ...user.dataValues
      })
    } else {
      res.status(404)
      res.json({
        error: 'Usuário não encontrado'
      })
    }
  } catch (error) {
    res.status(500)
    res.json({
      error: 'Houve um erro inesperado'
    })
  }
})

app.post('/', async (req, res) => {
  var {
    name,
    email,
    gender,
    password
  } = req.body

  if (!name && !email && !gender && !password) {
    res.json({
      error: 'Alguns dos dados estavam incorretos'
    })
  } else {

    var userCreated = await User.findOne({
      where: {
        email: email
      }})

    if (userCreated) {
      res.json({
        error: 'Já existe um usuário com este email'
      })
    } else {

      var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      var token_verify = await randomBytes(3)
      token_verify = token_verify.toString('hex').toUpperCase()

      var user = await User.create({
        name,
        email,
        gender,
        password: hash,
        token: token_verify
      })
      user.password = undefined
      user.token = undefined

      emailConfig.transporter.sendMail({
        from: `Mycroway <${process.env.EMAIL}>`,
        to: email,
        subject: "Verificação de e-mail",
        html: await verifyTemplateEmail(user, token_verify)
      })
      
      res.status(200)
      res.json({
        user, msg: 'Enviamos um e-mail com um token de verificação.'
      })
    }
  }
})

app.patch('/verify', async (req, res) => {
  var token = req.body.token

  if (!token) {
    res.status(401)
    res.json({
      error: 'Token inválido!'
    })
  }

  var user = await User.findOne({
    where: {
      token: token
    }})

  if (user) {
    user.password = undefined

    try {
      user.update({
        emailChecked: true,
        token: null
      })
      jwt.sign({
        userId: user.id
      }, JWTSecret, {
        expiresIn: '12h'
      }, (error, token) => {
        res.status(200)
        res.json({
          msg: 'Perfeito! o seu e-mail foi verificado com sucesso!',
          token
        })
      })
    } catch(error) {
      res.json({
        error: 'houve um erro inesperado!'
      })
    }

  } else {
    res.status(400)
    res.json({
      error: 'O token de verificação é inválido ou o seu e-mail já foi verificado'
    })
  }
})

app.post('/auth', async (req, res) => {
  var {
    email,
    password
  } = req.body

  try {
    if (email && password) {
      var user = await User.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        res.status(400)
        res.json({
          error: 'Usuário inválido!'
        })
      } else {

        var correct = bcrypt.compareSync(password, user.password)

        if (correct) {
          jwt.sign({
            userId: user.id
          }, JWTSecret, {
            expiresIn: '12h'
          }, (error, token) => {
            if (error) {
              res.status(500)
              res.json({
                error: 'Houve um erro no nosso sistema, desculpe tente mais tarde!'
              })
            } else {
              res.status(200)
              res.json({
                token
              })
            }
          })
        } else {
          res.status(401)
          res.json({
            error: 'Senha incorreta!'
          })
        }
      }
    } else {
      res.status(400)
      res.json({
        error: 'Alguns dos dados estavam incorretos'
      })
    }
  } catch (error) {
    res.status(500)
    res.json({
      error: 'Houve um erro no nosso sistema, desculpe tente mais tarde!'
    })
  }
})

app.delete('/', loginAuth, async (req, res) => {
  try {
    var user = await User.findOne({
      where: {
        id: req.user.id
      }})

    if (user) {
      User.destroy({
        where: {
          id: req.user.id
        }})

      res.status(200)
      res.json({
        msg: 'Usuário excluído com sucesso!'
      })
    } else {
      res.status(404)
      res.json({
        error: 'Usuário inválido!'
      })
    }
  } catch (error) {
    res.status(500)
    res.json({
      error: 'Houve um erro ao excluir o usuário!'
    })
  }
})

app.patch('/', checkedAuth, async (req, res) => {
  const datas = req.body

  if (datas.email) {
    res.status(401)
    res.json({
      error: 'O email não pode ser atualizado!'
    })
  } else if (datas.password) {
    res.status(401)
    res.json({
      error: 'Acesse a página de redefinição de senha para atualiza-la'
    })
  } else {
    try {
      User.update({
        ...datas
      }, {
        where: {
          id: req.user.id
        }})
      res.status(200)
      res.json({
        msg: 'Usuário atualizado com sucesso!'
      })
    } catch (error) {
      res.status(500)
      res.json({
        error: 'Houve um erro inesperado'
      })
    }
  }
})

app.post('/forgot_password', async (req, res) => {
  var {
    email
  } = req.body
  if (email) {
    var user = await User.findOne({
      where: {
        email: email
      }})
    if (user) {

      var token = await randomBytes(3)
      token = token.toString('hex').toUpperCase()

      User.update({
        token: token
      }, {
        where: {
          id: user.id
        }})

      var template = new emailTemplate(user.name, 'Confira abaixo o teken para fazer a redefinição da sua senha!', '/', '', 'Caso não tenha pedido para redefinir sua senha, ignore este e-mail!', token)

      emailConfig.transporter.sendMail({
        from: `Mycroway <${process.env.EMAIL}>`,
        to: email,
        subject: "Confirmação de email",
        html: template.Render()
      })

      res.status(200)
      res.json({
        msg: 'foi enviando um token para redefinição de senha para o seu e-mail!'
      })

    } else {
      res.status(404)
      res.json({
        error: 'Usuário ainda não cadastro!'
      })
    }
  } else {
    res.status(404)
    res.json({
      error: 'Dados inválidos'
    })
  }
})

app.patch('/reset', async (req, res) => {
  var {
    token,
    password
  } = req.body

  if (!token) {
    res.status(404)
    res.json({
      error: 'Token inválido!'
    })
  }

  if (!password) {
    res.status(404)
    res.json({
      error: 'Senha invalida!'
    })
  }

  var user = await User.findOne({
    where: {
      token: token
    }})

  if (user) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    User.update({
      password: hash, token: null
    }, {
      where: {
        id: user.id
      }})
    res.status(200)
    res.json({
      msg: 'Senha redefinida com sucesso!'
    })
  } else {
    res.status(404)
    res.json({
      error: 'Token inválido!'
    })
  }

})


var port = 3000
app.listen(port, () => {
  console.log(`running in port ${port}`)
})
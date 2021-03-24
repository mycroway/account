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
const TokenVerify = require('./models/TokenVerify')
const Token = require('./models/Token')
require('dotenv').config()
const loginAuth = require('./auth/login')

// API config
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())


// Routers
app.get('/', loginAuth, async (req, res) => {
  var token = req.query["token"]

  try {
    var tokenCreated = await Token.findOne({
      where: {
        token: token
      },
      include: {
        model: User
      }})

    if (tokenCreated) {
      tokenCreated.user.password = '*******'

      res.json(tokenCreated.user)
    } else {
      res.json({
        error: 'Login inválido'
      })
    }
  } catch (error) {
    res.json({
      error: 'Houve um erro inesperado'
    })
  }
})

app.get('/create', async (req, res) => {
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

      var token_verify = await randomBytes(20)
      token_verify = token_verify.toString('hex')

      var text1Email = `Muito obrigado por criar a sua conta na Mycroway! Por segurança precisamos que você clique no butão abaixo para fazer a verificação do seu email`
      var hostEmail = req.protocol+'://'+req.headers.host+'/verify?token_verify='+token_verify

      var verifyEmail = new emailTemplate(name, text1Email, hostEmail, 'Verificar email', 'Caso você não tenha criado uma conta na Mycroway, não clique no butão de confirmação acima.')

      var user = await User.create({
        name,
        email,
        gender,
        password: hash,
      })
      user.password = '*********'

      var token = await TokenVerify.create({
        token: token_verify,
        userId: user.id
      })

      emailConfig.transporter.sendMail({
        from: `Mycroway <${process.env.EMAIL}>`,
        to: email,
        subject: "Confirmação de email",
        html: verifyEmail.Render()

      })

      res.json(user)
    }
  }
})

app.put('/verify', loginAuth, async (req, res) => {
  var token = req.query["token_verify"]

  var tokenCreated = await TokenVerify.findOne({
    where: {
      token: token
    },
    include: [{
      model: User
    }]
  })

  if (tokenCreated && !tokenCreated.user.emailChecked) {
    tokenCreated.user.password = '********'

    try {
      User.update({
        emailChecked: true
      }, {
        where: {
          id: tokenCreated.user.id
        }
      })

      TokenVerify.destroy({
        where: {
          id: tokenCreated.id
        }
      })

      res.json({
        msg: 'Perfeito! o seu e-mail foi verificado com sucesso!'
      })
    } catch(error) {
      res.json({
        error: 'houve um erro inesperado!'
      })
    }

  } else {
    res.json({
      error: 'O token de verificação é inválido ou o seu e-mail já foi verificado'
    })
  }
})

app.post('/login', async (req, res) => {
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

      var correct = bcrypt.compareSync(password, user.password)

      if (correct) {

        var token = await randomBytes(20)
        token = token.toString('hex')

        Token.create({
          token,
          userId: user.id
        })

        user.password = '*******'

        res.json({
          msg: 'Usuário logado com sucesso!', token, user
        })

      } else {
        res.json({
          error: 'Senha incorreta!'
        })
      }

    } else {
      res.json({
        error: 'Alguns dos dados estavam incorretos'
      })
    }
  } catch (error) {
    res.json({
      error: 'Houve um erro inesperado!'
    })
  }
})

app.post('/logout', loginAuth, async (req, res) => {
  var token = req.query["token"]

  try {
    Token.destroy({
      where: {
        token: token
      }
    }).then(() => {

      res.json({
        msg: 'O logout foi feito com sucesso!'
      })

    }).catch((error) => {
      res.json({
        error: 'Houve um erro inesperado'
      })
    })
  } catch (error) {
    res.json({
      error: 'Houve um erro inesperado!'
    })
  }
})

app.delete('/', loginAuth, async (req, res) => {
  const token = req.query["token"]
  const tokenDatas = await Token.findOne({
    where: {
      token: token
    }})

  try {
    User.destroy({
      where: {
        id: tokenDatas.userId
      }})

    Token.destroy({
      where: {
        userId: tokenDatas.userId
      }
    })
    res.json({
      msg: 'Usuário excluído com sucesso!'
    })
  } catch (error) {
    res.json({
      error: 'Houve um erro ao excluir o usuário!'
    })
  }
})

app.patch('/update', loginAuth, async (req, res) => {
  const token = req.query["token"]
  const tokenDatas = await Token.findOne({
    where: {
      token: token
    }
  })
  const datas = req.body

  if (datas.email) {
    res.json({
      error: 'O email não pode ser atualizado!'
    })
  } else if (datas.password) {
    res.json({
      error: 'Acesse a página de redefinição de senha para atualiza-la'
    })
  } else {
    try {
    var newUser = await User.update({
      ...datas
    }, {
      where: {
        id: tokenDatas.userId
      }})
      res.json({msg: 'Usuário atualizado com sucesso!'})
    } catch (error) {
      res.json({error: 'Houve um erro inesperado'})
    }
  }
})


var port = 3000
app.listen(port, () => {
  console.log(`running in port ${port}`)
})
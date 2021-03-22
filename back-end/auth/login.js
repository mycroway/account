const Token = require('../models/Token')

module.exports = async (req, res, next) => {
	var token = req.query["token"]
	
	if (token) {
		
		var tokenCreated = await Token.findOne({
			where: {
				token: token
			}
		})
		
		if (tokenCreated) {
			next()
		} else {
			res.json({ error: "Login inválido!" })
		}
		
	} else {
		res.json({ error: "O Usuário não está conectado a sua conta!"})
	}
	
}
import joi from 'joi';

export async function validaCadastro(req, res, next) {
	const cadastroSchema = joi.object({
		nome: joi.string().required(),
		email: joi.string().email().required(),
		senha: joi.string().required(),
		confirma_senha: joi.string().required()
	});
	const validation = cadastroSchema.validate(req.body, {abortEarly: false});
	if(validation.error || req.body.senha != req.body.confirma_senha) return res.status(422).send(validation?.error.details.map(v => v.message));
	next();
}

export async function validaLogin(req, res, next) {
	const loginSchema = joi.object({
		email: joi.string().email().required(),
		senha: joi.string().required()
	});
	const validation = loginSchema.validate(req.body, {abortEarly: false});
	if(validation.error) return res.status(422).send(validation.error.details.map(v => v.message));
	next();
}
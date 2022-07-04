import joi from 'joi';

export async function validaTransacao(req, res, next) {
	const transacaoSchema = joi.object({
		valor: joi.number().required(),
		descricao: joi.string().required()
	});
	const validation = transacaoSchema.validate(req.body, {abortEarly: false});
	if(validation.error ) return res.status(422).send(validation.error.details.map(v => v.message));
	next();
}

export async function verificaToken(req, res, next){
	if(!req.headers.authorization) return res.sendStatus(401);
	next();
}
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from '../db/db.js';
import { stripHtml } from "string-strip-html";

export async function signUp(req, res) {
	const body = req.body;
	const password = bcrypt.hashSync(body.senha, 10);
	try {
		const encontrado = await db.collection("usuario")
		.findOne({nome: stripHtml(body.nome).result.trim()});
		if(encontrado) return res.sendStatus(409);
		await db.collection("usuario").insertOne({
			nome: body.nome,
			email: body.email,
			senha: password,
			saldo: 0
		});
		return res.sendStatus(201);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function signIn(req, res) {
	const body = req.body;
	try {
		const user = await db.collection('usuario').findOne({email: body.email});
		if (user && bcrypt.compareSync(body.senha, user.senha)) {
			const token = uuid();
			const sessao = await db.collection('sessoes').findOne({userId: user._id});
			if(sessao) await db.collection('sessoes').updateOne({userId: user._id}, {$set: {token: token}});
			else await db.collection('sessoes').insertOne({token, userId: user._id});
			res.status(201).send(token);
		} else {
			res.status(401).send("email ou senha incorreto");
		}
	} catch (error) {
		return res.status(500).send(error);
	}
}
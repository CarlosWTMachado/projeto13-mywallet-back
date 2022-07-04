import bcrypt from 'bcrypt';
import db from '../db/db.js';
import { stripHtml } from "string-strip-html";
import dayjs from 'dayjs';

export async function NovaEntrada(req, res) {
	const body = req.body;
	const token = req.headers.authorization.replace('Bearer ', '');
	try {
		const sessao = await db.collection("sessoes").findOne({token: token});
		if(!sessao) return res.sendStatus(409);
		await db.collection("transacoes").insertOne({
			... body,
			valor: parseInt(body.valor),
			tipo: 'entrada',
			data: dayjs().format('DD/MM'),
			userId: sessao.userId,
		});
		const usuario = await db.collection("usuario").findOne({_id: sessao.userId});
		await db.collection("usuario").updateOne(
			{_id: sessao.userId}, 
			{$set: {saldo: usuario.saldo + body.valor}}
		);
		return res.sendStatus(201);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function NovaSaida(req, res) {
	const body = req.body;
	const token = req.headers.authorization.replace('Bearer ', '');
	try {
		const sessao = await db.collection("sessoes").findOne({token: token});
		if(!sessao) return res.sendStatus(409);
		await db.collection("transacoes").insertOne({
			... body,
			valor: parseInt(body.valor),
			tipo: 'saida',
			data: dayjs().format('DD/MM'),
			userId: sessao.userId,
		});
		const usuario = await db.collection("usuario").findOne({_id: sessao.userId});
		await db.collection("usuario").updateOne(
			{_id: sessao.userId}, 
			{$set: {saldo: usuario.saldo - body.valor}}
		);
		return res.sendStatus(201);
	} catch (error) {
		return res.status(500).send(error);
	}
}

export async function TodasTransacoes(req, res) {
	const token = req.headers.authorization.replace('Bearer ', '');
	try {
		const sessao = await db.collection("sessoes").findOne({token: token});
		if(!sessao) return res.sendStatus(409);
		const transacoes = await db.collection("transacoes").find({userId: sessao.userId}).toArray();
		const usuario = await db.collection("usuario").findOne({_id: sessao.userId});
		return res.status(200).send({transacoes, saldo: usuario.saldo});
	} catch (error) {
		return res.status(500).send(error);
	}
}
import express, { json } from 'express';
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import TransactionRouter from './routes/transactionRouter.js';

const server = express();
server.use(cors());
server.use(json());

server.use(authRouter);
server.use(TransactionRouter);

server.listen(5000, () => {
	console.log("Rodando em http://localhost:5000");
});
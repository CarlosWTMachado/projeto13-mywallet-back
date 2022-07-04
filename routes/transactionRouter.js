import express from 'express';
import { NovaEntrada, NovaSaida, TodasTransacoes } from '../controllers/transactionController.js';
import { validaTransacao, verificaToken } from '../middlewares/transactionMiddleware.js';

const router = express.Router();
router.post('/entrada', validaTransacao, verificaToken, NovaEntrada);
router.post('/saida', validaTransacao, verificaToken, NovaSaida);
router.get('/transacoes', verificaToken, TodasTransacoes);
export default router;
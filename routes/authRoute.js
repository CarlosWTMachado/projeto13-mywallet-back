import express from 'express';
import { signUp, signIn } from '../controllers/authController.js';
import { validaCadastro, validaLogin } from '../middlewares/authMiddleware.js'

const router = express.Router();
router.post('/cadastro', validaCadastro, signUp);
router.post('/login', validaLogin, signIn)
export default router;
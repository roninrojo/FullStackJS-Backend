import express from "express";
import {
    registrar,
    perfil,
    confirmar,
    autenticar,
    passwordResetStart,
    passwordToken,
    passwordResetEnd
} from "../controllers/veterianarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();



// Public
router.post('/', registrar);
router.get('/confirmar/:token', confirmar); // :param -> routing dinámico, parametros por url
router.post('/autenticar', autenticar);
router.post('/password-reset', passwordResetStart);
// router.get('/password-reset/:token', passwordToken);
// router.post('/password-reset/:token', passwordResetEnd);
// Express nos permite hacer chaining de rutas para una misma url 
router.route('/password-reset/:token').get(passwordToken).post(passwordResetEnd);

// Private
// el 'next' hace que salte al siguiente middleware (perfil), una vez pasado por checkAuth
router.post('/perfil', checkAuth, perfil);

export default router;
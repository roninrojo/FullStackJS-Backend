import express from "express";
import {
    registrar,
    perfil,
    confirmar,
    autenticar
} from "../controllers/veterianarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', registrar);
router.get('/confirmar/:token', confirmar); // :param -> routing dinámico
router.post('/autenticar', autenticar);

// el 'next' hace que salte al siguiente middleware (perfil), una vez pasado por checkAuth
router.post('/perfil', checkAuth, perfil);

export default router;
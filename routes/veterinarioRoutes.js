import express from "express";
import { registrar, perfil, confirmar } from "../controllers/veterianarioController.js";
const router = express.Router();

router.post('/', registrar);
router.post('/perfil', perfil);
router.get('/confirmar/:token', confirmar); // :param -> routing dinámico

export default router;
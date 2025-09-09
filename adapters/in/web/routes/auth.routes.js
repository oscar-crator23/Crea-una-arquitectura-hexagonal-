import { Router } from 'express';
import CreateAuthMiddleware from '../../../../infrastructure/middleware/auth.middleware.js';

export default function createAuthRoutes(authController, authService, userRepository) {
    const router = Router();
    const authMiddleware = CreateAuthMiddleware(authService, userRepository);

    // Rutas públicas
    router.post('/register', authController.register.bind(authController));
    router.post('/login', authController.login.bind(authController));

    // Ruta protegida para obtener usuario actual
    router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));

    return router;
}
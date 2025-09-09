import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importaciones de tus módulos
import AuthService from '../domain/services/auth.service.js';
import RegisterUserCase from '../application/use-cases/register-user.use-case.js';
import LoginUserCase from '../application/use-cases/login-user.use-case.js';
import AuthController from '../adapters/in/web/auth.controller.js';
import createAuthRoutes from '../adapters/in/web/routes/auth.routes.js';

// Repositorio Mock en memoria
class MockUserRepository {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }

    async findByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    async findByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    async findById(id) {
        return this.users.find(user => user.id === id);
    }

    async create(userData) {
        const user = { 
            id: this.nextId++, 
            username: userData.username,
            email: userData.email,
            password: userData.password,
            createdAt: new Date()
        };
        this.users.push(user);
        return user;
    }

    async getAll() {
        return this.users;
    }
}
class Application {
    constructor() {
        this.app = express();
    }

    async initialize() {
        // Servicios y repositorios
        const authService = new AuthService(process.env.JWT_SECRET || 'defaultsecret');
        const userRepo = new MockUserRepository();

        // Casos de uso
        const registerUserUseCase = new RegisterUserCase(userRepo, authService);
        const loginUserUseCase = new LoginUserCase(userRepo, authService);

        // Controladores
        const authController = new AuthController(registerUserUseCase, loginUserUseCase);

        // Middleware básico
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));

        // Rutas para servir las páginas HTML
        this.app.get(['/', '/login'], (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'login.html'));
        });

        this.app.get('/register', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'register.html'));
        });

         this.app.get('/dashboard', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
        });

        // Rutas API
        this.app.use('/api/auth', createAuthRoutes(authController, authService, userRepo));

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });

        // Manejo de errores
        this.app.use((err, req, res, next) => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        });

        // Manejo de rutas no encontradas
        this.app.use((req, res) => {
            res.status(404).json({ error: 'Ruta no encontrada' });
        });

        await this.start();
    }

    async start() {
        const port = process.env.PORT || 3000;
        this.server = this.app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    }
}

// Iniciar aplicación
new Application().initialize().catch(console.error);
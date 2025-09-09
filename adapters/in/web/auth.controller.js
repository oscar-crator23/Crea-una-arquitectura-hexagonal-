class AuthController {
    constructor(registerUserUseCase, loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }

    async register(req, res, next) {
        try {
            const user = await this.registerUserUseCase.execute(req.body);
            res.status(201).json({ 
                success: true, 
                message: "User registered successfully",
                user 
            });
        } catch (err) {
            res.status(400).json({ 
                success: false, 
                message: err.message 
            });
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Email and password are required" 
                });
            }

            const result = await this.loginUserUseCase.execute(email, password);
            
            res.json({ 
                success: true, 
                message: "Login successful",
                token: result.token,
                user: result.user
            });
        } catch (err) {
            res.status(401).json({ 
                success: false, 
                message: err.message 
            });
        }
    }

    async getCurrentUser(req, res) {
        try {
            // El middleware de autenticación ya debería haber agregado el usuario a req.user
            if (!req.user) {
                return res.status(404).json({ 
                    success: false, 
                    message: "User not found" 
                });
            }

            res.json({ 
                success: true, 
                user: req.user 
            });
        } catch (err) {
            res.status(500).json({ 
                success: false, 
                message: "Internal server error" 
            });
        }
    }
}

export default AuthController;
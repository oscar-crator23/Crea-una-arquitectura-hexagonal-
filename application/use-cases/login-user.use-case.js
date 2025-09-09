class LoginUserCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await this.authService.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        // Generar token con la información necesaria
        const token = this.authService.generateToken({
            userId: user.id,
            email: user.email,
            username: user.username
        });

        // Retornar usuario (sin password) y token
        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            },
            token
        };
    }
}

export default LoginUserCase;
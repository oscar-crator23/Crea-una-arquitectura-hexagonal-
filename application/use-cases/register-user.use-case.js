class RegisterUserUseCase {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(userData) {
        // Verificar si el usuario ya existe por email
        const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
        if (existingUserByEmail) {
            throw new Error("Email already in use");
        }

        // Verificar si el usuario ya existe por username
        const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
        if (existingUserByUsername) {
            throw new Error("Username already in use");
        }

        // Hashear la contraseña
        const hashedPassword = await this.authService.hashPassword(userData.password);
        
        // Crear usuario
        const user = await this.userRepository.create({
            username: userData.username,
            email: userData.email,
            password: hashedPassword
        });

        // Retornar usuario sin la contraseña
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        };
    }
}

export default RegisterUserUseCase;
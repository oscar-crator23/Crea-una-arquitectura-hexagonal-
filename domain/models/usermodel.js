class User {
    constructor(id, username, email, password, createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }

    validate() {
        if (!this.email || !this.password) {
            throw new Error("Email and password are required");
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            throw new Error("Invalid email format");
        }
        
        // Validar longitud de contraseña
        if (this.password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            createdAt: this.createdAt
        };
    }
}

export default User;
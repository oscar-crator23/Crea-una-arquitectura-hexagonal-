function CreateAuthMiddleware(authService, userRepository) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, message: 'No token provided' });
            }

            const token = authHeader.replace('Bearer ', '');
            const decoded = authService.verifyToken(token);
            const user = await userRepository.findById(decoded.userId || decoded.userId);

            if (!user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }
            
            req.user = user;
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    };
}

export default CreateAuthMiddleware;
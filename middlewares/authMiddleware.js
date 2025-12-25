export const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Access Denied. Please log in." });
};

export default authMiddleware;
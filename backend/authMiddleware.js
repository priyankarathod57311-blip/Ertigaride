
const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Admin login required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired login session"
        });
    }
}

module.exports = verifyAdmin;

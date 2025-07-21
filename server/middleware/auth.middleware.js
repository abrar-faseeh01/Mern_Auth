// write the function that'll find the token from the cookie and from that token it'll find the userId


import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Login again" });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecoded.id) {
            // Ensure req.body is not undefined
            if (!req.body) {
                req.body = {};
            }
            req.body.userId = tokenDecoded.id; // attach userId to the request body
        }

        next(); // now the controller functions that need userId will be executed with userId in the request body
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized. Invalid token" });
    }
};

export default authMiddleware;

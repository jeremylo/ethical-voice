export default function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ error: "Login required." });
}

export function requireNoAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ error: "This action is prohibited for logged in users." });
}

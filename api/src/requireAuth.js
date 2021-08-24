
/**
 * Express middleware to require the user to be authenticated to view the page.
 */
export default function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ error: "Login required." });
}

/**
 * Express middleware to require the user to be logged out to view the page.
 */
export function requireNoAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ error: "This action is prohibited for logged in users." });
}

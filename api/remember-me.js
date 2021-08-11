import { createHash, randomBytes } from 'crypto';
import { deleteRememberMeToken, findRememberMeToken, insertRememberMeToken } from './persistence/remember-me';


export function hashRememberMeToken(token) {
    return createHash('sha256').update(token).digest('hex');
}

// Consume remember-me token (tokens are single-use!)
export function consumeRememberMeToken(token, done) {
    const tokenHash = hashRememberMeToken(token);
    try {
        const tokenData = findRememberMeToken(tokenHash);
        deleteRememberMeToken(tokenHash);

        if (!tokenData.user_id) {
            return done(null, false);
        }

        findUserById(tokenData.user_id)
            .then(user => {
                return done(null, user);
            })
    } catch (e) {
        done(e, false);
    }
}

// Issue remember-me token
export async function issueRememberMeToken(user) {
    const token = randomBytes(64).toString('base64');
    try {
        await insertRememberMeToken(user.id, hashRememberMeToken(token));
        return token;
    } catch (e) {
        throw new Error("Unable to issue a new remember-me token.");
    }
}

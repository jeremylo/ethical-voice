import { randomBytes } from 'crypto';
import { deleteRememberMeToken, findRememberMeToken, insertRememberMeToken } from './persistence/remember-me.js';
import { hashSha256 } from './utils.js';


// Consume remember-me token (tokens are single-use!)
export function consumeRememberMeToken(token, done) {
    const tokenHash = hashSha256(token);
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
        await insertRememberMeToken(user.id, hashSha256(token));
        return token;
    } catch (e) {
        throw new Error("Unable to issue a new remember-me token.");
    }
}

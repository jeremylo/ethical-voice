const dummyUser = {
    refId: 1234567890,
    email: 'test@example.com',
    outwardPostcode: 'SW1',
    sharing: true
};

const authenticator = {

    async getLoggedInUser() {
        return await (await fetch('/api/auth/user')).json();
    },

    async loginWithCredentials(email, password) {
        if (email === 'test@example.com' && password === 'qwerty') {
            return dummyUser;
        }
    },

    async register(refId, email, password) {
        return dummyUser;
    },

    async logout() {

    }
};

export default authenticator;

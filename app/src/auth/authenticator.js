const dummyUser = {
    refId: 1234567890,
    email: 'test@example.com',
    outwardPostcode: 'SW1',
    sharing: true
};

const authenticator = {
    isLoggedIn: false,

    async loginWithCredentials(email, password) {
        if (email === 'test@example.com' && password === 'qwerty') {
            authenticator.isLoggedIn = true;
            return dummyUser;
        }
    },

    async register(refId, email, password) {
        return dummyUser;
    },

    async logout() {
        authenticator.isLoggedIn = false;
    }
};

export default authenticator;

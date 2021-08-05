const dummyUser = {
    refId: 1234567890,
    email: 'test@example.com',
    outwardPostcode: 'SW1',
    sharing: true
};

const authenticator = {

    async getLoggedInUser() {
        const res = await fetch('/api/auth/user');

        if (res.status !== 200) {
            return false;
        }

        return await res.json();
    },

    async loginWithCredentials(email, password) {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (res.status !== 200) {
            return false;
        }

        return await res.json();
    },

    async register(refId, email, password) {
        return dummyUser;
    },

    async logout() {
        await fetch('/api/auth/logout');
    }
};

export default authenticator;

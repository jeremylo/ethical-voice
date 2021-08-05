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
        return {
            refId: 1234567890,
            email: 'test@example.com',
            outwardPostcode: 'SW1',
            sharing: true
        };
    },

    async logout() {
        await fetch('/api/auth/logout');
    },

    async setOutwardPostcode(outwardPostcode) {
        const res = await fetch('/api/auth/user/outwardpostcode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ outwardPostcode })
        });

        return res.status === 200;
    },

    async setSharing(sharing) {
        const res = await fetch('/api/auth/user/sharing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sharing: !!sharing })
        });

        return res.status === 200;
    },
};

export default authenticator;

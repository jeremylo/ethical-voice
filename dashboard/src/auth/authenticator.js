async function fetchPost(url, data) {
    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

const authenticator = {
    async getLoggedInUser() {
        const res = await fetch('/api/sro');
        if (res.status !== 200) {
            return false;
        }

        return await res.json();
    },

    async loginWithCredentials(email, password) {
        const res = await fetchPost('/api/auth/login', { email, password });
        if (res.status !== 200) {
            return false;
        }

        return await res.json();
    },

    async logout() {
        await fetch('/api/auth/logout');
    },
};

export default authenticator;

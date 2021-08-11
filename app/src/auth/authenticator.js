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
        const res = await fetch('/api/user');
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

    async register(referenceId, email) {
        const res = await fetchPost('/api/user/register', { referenceId, email });
        return !("error" in (await res.json()));
    },

    async activate(referenceId, token, password) {
        const res = await fetchPost('/api/user/activate', { referenceId, token, password });
        return !("error" in (await res.json()));
    },

    async logout() {
        await fetch('/api/auth/logout');
    },

    async setEmail(email) {
        const res = await fetchPost('/api/user/email', { email });
        return res.status === 200;
    },

    async setPassword(oldPassword, newPassword) {
        const res = await fetchPost('/api/user/password', { oldPassword, newPassword });
        return res.status === 200;
    },

    async setOutwardPostcode(outwardPostcode) {
        const res = await fetchPost('/api/user/outwardpostcode', { outwardPostcode });
        return res.status === 200;
    },

    async setSharing(sharing) {
        const res = await fetchPost('/api/user/sharing', { sharing: !!sharing });
        return res.status === 200;
    },
};

export default authenticator;

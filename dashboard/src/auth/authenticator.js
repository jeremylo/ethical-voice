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

    async invite(email, trusted) {
        const res = await fetchPost('/api/sro/invite', { email, trusted });
        return res.status === 200 && !("error" in (await res.json()));
    },

    async activate(token, fullname, password) {
        const res = await fetchPost('/api/sro/activate', { token, name: fullname, password });
        return res.status === 200 && !("error" in (await res.json()));
    },

    async requestPasswordReset(email) {
        const res = await fetchPost('/api/sro/password/request-reset', { email });
        return res.status === 200 && !("error" in (await res.json()));
    },

    async resetPassword(sroid, token, password) {
        const res = await fetchPost('/api/sro/password/reset', { sroid, token, password });
        return res.status === 200 && !("error" in (await res.json()));
    },

    async setName(n) {
        const res = await fetchPost('/api/sro/name', { name: n });
        return res.status === 200;
    },

    async setEmail(email) {
        const res = await fetchPost('/api/sro/email', { email });
        return res.status === 200;
    },

    async setPassword(oldPassword, newPassword) {
        const res = await fetchPost('/api/sro/password', { oldPassword, newPassword });
        return res.status === 200;
    },
};

export default authenticator;

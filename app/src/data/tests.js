

const defaultTests = {
    1: {
        id: 1,
        possibleDurations: [10, 30, 60, 90, 120],
        title: "Counting numbers",
        instruction: "Please count out loud up from one clearly at a fast but comfortable speaking pace until the timer runs out."
    },
    2: {
        id: 2,
        possibleDurations: [10, 30, 60, 90, 120],
        title: "Repeating hippopotamus",
        instruction: "Please repeatedly say 'hippopotamus' at a fast but comfortable speaking pace until the timer runs out."
    },
};

export { defaultTests };

export default async function getTests() {
    let cachedAt = sessionStorage.getItem('cachedTestsAt');
    if (cachedAt) {
        if (Date.now() - +cachedAt < 600000) { // cache for ten minutes
            let cachedTests = JSON.parse(sessionStorage.getItem('cachedTests') ?? '{}');
            if (Object.keys(cachedTests).length > 0) {
                return cachedTests;
            }
        }

        sessionStorage.removeItem('cachedTests');
        sessionStorage.removeItem('cachedTestsAt');
    }

    try {
        const tests = await (await fetch('/api/tests')).json();
        if (Object.keys(tests).length > 0) {
            sessionStorage.setItem('cachedTests', JSON.stringify(tests));
            sessionStorage.setItem('cachedTestsAt', Date.now());
            return tests;
        }
    } catch (e) {
        return defaultTests;
    }
}

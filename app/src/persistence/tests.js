

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
    try {
        const tests = await (await fetch('/api/tests')).json();
        if (Object.keys(tests).length > 0) {
            return tests;
        }
    } catch (e) {
        return defaultTests;
    }
}

import calculateResults from './calculateResults';

test('calculates trivial results example correctly', () => {
    const results = calculateResults("hello world", 3);
    expect(results).toMatchObject({
        syllableCount: 3,
        syllablesPerMinute: 60,
        wordCount: 2,
        wordsPerMinute: 40,
        transcription: "hello world",
        duration: 3
    });
});

test('calculates counting example results correctly', () => {
    const results = calculateResults("one two three four five six seven eight nine ten", 10);
    expect(results).toMatchObject({
        syllableCount: 11,
        syllablesPerMinute: 66,
        wordCount: 10,
        wordsPerMinute: 60,
        transcription: "one two three four five six seven eight nine ten",
        duration: 10
    });
});

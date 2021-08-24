import { syllable } from 'syllable';

const round2dp = (x) => Math.round((x + Number.EPSILON) * 100) / 100;

/**
 * Calculates speech results.
 *
 * @param   {string}  transcription  The transcribed speech.
 * @param   {number}  duration       The speech duration.
 *
 * @return  {object}                 The calculated results.
 */
export default function calculateResults(transcription, duration) {
    const words = transcription.split(/\s+/).filter((w) => w.length > 0);

    const durationInMinutes = duration / 60;
    const wordsPerMinute = round2dp(words.length / durationInMinutes);
    const syllables = words.map(syllable).reduce((a, b) => a + b, 0);
    const syllablesPerMinute = round2dp(syllables / durationInMinutes);

    return {
        syllableCount: syllables,
        syllablesPerMinute,
        wordCount: words.length,
        wordsPerMinute,
        transcription: words.join(" "),
        duration
    };
}

import ASRHandler from './kaldi/workerWrappers/asrHandler';
import IDBHandler from './kaldi/workerWrappers/idbHandler';

/**
 * A service for recording audio from a MediaStream and
 * transcribing it using a Kaldi model saved in indexedDB.
 */
export default class SpeechService {

    /**
     * Initialises the SpeechService.
     *
     * Note: setup(downloadModel) must be called before the SpeechService
     * is ready to begin recording and transcribing.
     *
     * @return  {void}
     */
    constructor() {
        this.setup = this.setup.bind(this);
        this.terminate = this.terminate.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);

        this.recorder = null;
        this.idbHandler = null;
        this.asrHandler = null;
    }

    /**
     * Prepares the SpeechService to start recording text by loading
     * the stored Kaldi model (and optionally downloading it if one
     * has not yet been downloaded and stored) into Kaldi.
     *
     * @param   {Function}  downloadModel  This is a function that downloads the model
     *                                     that users of this service must define. It
     *                                     must return a Promise that resolves to a
     *                                     Uint8Array containing the Kaldi model zip file.
     *                                     The function downloadFile(url, callback) in
     *                                     ./downloadFile.js is an example of such a
     *                                     download function that downloads in this format.
     *
     * @return  {Promise<void>}
     */
    setup(downloadModel) {
        this.idbHandler = new IDBHandler();
        this.asrHandler = new ASRHandler();

        return this.idbHandler.init({
            name: 'asr_models',
            version: 1,
            storeInfo: {
                name: 'models',
                keyPath: 'language',
            },
        })
            .then(() => this.idbHandler.get('model'))
            .catch(() => {
                return downloadModel().then((zip) => {
                    this.idbHandler.add('model', zip);
                    return { value: zip };
                });
            })
            .then(({ value: zip }) => new Promise((resolve, reject) => {
                this.asrHandler.terminate()
                    .then(() => { resolve(this.asrHandler.init('model', zip)); })
                    .catch(reject);
            }));
    }

    /**
     * Starts recording from the microphone stream using RecordRTC.
     *
     * @param   {MediaStream}  microphone  The audio stream of the microphone.
     *
     * @return  {void}
     */
    startRecording(microphone) {
        this.recorder = window.RecordRTC(microphone, {
            type: 'audio',
            mimeType: 'audio/webm',
            recorderType: window.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            desiredSampRate: 16000
        });

        this.recorder.startRecording();

        // NOTE: the microphone MUST be released on stopRecording
        this.recorder.microphone = microphone;
    }

    /**
     * Stops recording and transcribes the audio using Kaldi.
     *
     * @return  {Promise<object>}  A promise is returned that resolves to
     *                             { audioBlob, transcription }, where
     *                             audioBlob is a BLOB representation of the
     *                             16kHz int16 PCM .wav audio file, and
     *                             transcription is the text transcribed
     *                             by Kaldi.
     */
    stopRecording() {
        // I would rather write this using completely async code, but RecordRTC
        // does not seem to appreciate it. When this is fixed in an update,
        // feel free to rewrite this method!
        return new Promise((resolve, reject) => {
            this.recorder.stopRecording(() => {
                this.recorder.microphone.stop();
                this.recorder.microphone.getAudioTracks().forEach(track => track.stop());

                const audioBlob = this.recorder.getBlob();
                audioBlob.arrayBuffer() // PCM
                    .then((buffer) => this.asrHandler.process(new Int16Array(buffer)))
                    .then((({ text: transcription }) => {
                        this.asrHandler.reset();
                        resolve({ audioBlob, transcription });
                    }))
                    .catch(reject);
            });
        });
    }

    /**
     * Closes any resources the SpeechService relies on.
     *
     * @return  {void}
     */
    terminate() {
        if (this.idbHandler) {
            this.idbHandler.terminate();
            this.idbHandler = null;
        }

        if (this.asrHandler) {
            this.asrHandler.terminate();
            this.asrHandler = null;
        }

        this.recorder = null;
    }

}

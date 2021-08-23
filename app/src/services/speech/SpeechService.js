import ASRHandler from './kaldi/workerWrappers/asrHandler';
import IDBHandler from './kaldi/workerWrappers/idbHandler';

export default class SpeechService {

    constructor() {
        this.setup = this.setup.bind(this);
        this.terminate = this.terminate.bind(this);

        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);

        this.recorder = null;
        this.idbHandler = null;
        this.asrHandler = null;
    }

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
                const saveModel = (zip) => {
                    return this.idbHandler.add('model', zip);
                };

                return downloadModel(saveModel);
            })
            .then(({ value: zip }) => new Promise((resolve, reject) => {
                this.asrHandler.terminate()
                    .then(() => { resolve(this.asrHandler.init('model', zip)); })
                    .catch(reject);
            }));
    }

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

    stopRecording() {
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

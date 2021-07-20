/* eslint-disable no-restricted-globals */
// eslint-disable-next-line import/no-webpack-loader-syntax
import resampleWasm from '!!file-loader!../computations/resampleTo16bint.wasm';
import resampleJS from '../computations/resampleTo16bint';

let resample = () => { };
let outputInputSampleRateRatio = 1 / 3;

/* Webpack renames resources which makes the locateFile function inside
resampleJS break. The function below replaces locateFile so as to give the
right name when loading the wasm binary.
*/
const resampleMod = resampleJS({
  locateFile(path) {
    if (path.endsWith('.wasm')) return resampleWasm;
    return path;
  },
});

const helper = {
  setConversionRatio(msg) {
    outputInputSampleRateRatio = msg.data.conversionRatio;
    return outputInputSampleRateRatio;
  },
  resample(msg) {
    return resample(msg.data.buffer, outputInputSampleRateRatio);
  },
  reset() {
    resampleMod.reset();
    return '';
  },
  terminate() {
    resampleMod.terminate();
    close();
    return '';
  },
};

onmessage = (msg) => {
  const { command } = msg.data;
  const response = { command, ok: true };

  if (command in helper) response.value = helper[command](msg);
  else {
    response.ok = false;
    response.value = new Error(`Unknown command '${command}'`);
  }
  postMessage(response);
};

resampleMod.onRuntimeInitialized = () => {
  resampleMod.init();
  resample = resampleMod.resampleTo16bint;
};

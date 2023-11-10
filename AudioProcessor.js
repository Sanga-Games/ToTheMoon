class MicProcessor extends AudioWorkletProcessor {
    process(inputs, outputs) {
        const input = inputs[0];
        this.port.postMessage({ audioData: input[0] });
        return true;
    }
}
registerProcessor('mic-processor', MicProcessor);

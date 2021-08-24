/**
 * Downloads the file at the given URL, calling progressCallback every
 * time a chunk is successfully downloaded.
 *
 * @param   {string}    url               The file URL
 * @param   {function}  progressCallback  The function called with the current
 *                                        download completion percentage.
 *
 * @return  {Uint8Array}                  An array of the file downloaded.
 */
export default async function downloadFile(url, progressCallback = (_ => false)) {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');
    const chunks = new Uint8Array(contentLength);

    try {
        let receivedLength = 0;
        while (true) {
            const { done, value: chunk } = await reader.read();
            if (done) {
                break;
            }

            chunks.set(chunk, receivedLength);
            receivedLength += chunk.length;

            progressCallback(receivedLength / contentLength);
        }
    } finally {
        reader.releaseLock();
    }

    return chunks;
}

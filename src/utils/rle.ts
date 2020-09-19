/**
 * Decompress RLE-compressed data
 *
 * Each compressionByte will be repeated as specified by
 * the next byte value plus one, e.g. for compressionByte = 0x0A
 *
 * 0xAB 0x0A 0x02 0x0B  becomes 0xAB 0x0A 0x0A 0x0A 0x0B:
 *
 * All other bytes will not change.
 *
 * @param data Frame compressed data
 * @param compressionByte Byte used for compression
 * @returns {Uint8Array} Decompressed data
 */
export function decompressRLE(data: ArrayBuffer, compressionByte: number) {
    const compressedData = new DataView(data)
    const decompressedData = []
    for (let i = 0; i < compressedData.byteLength; i++) {
        if (compressedData.getUint8(i) === compressionByte) {
            const numberOfRepeats = compressedData.getUint8(i + 1) + 1
            for (
                let processedRepeats = 0;
                processedRepeats < numberOfRepeats;
                processedRepeats++
            ) {
                decompressedData.push(compressionByte)
            }
            i = i + 1
        } else {
            decompressedData.push(compressedData.getUint8(i))
        }
    }
    return new Uint8Array(decompressedData)
}

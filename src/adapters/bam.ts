import BAMTexture from './bam-texture';
import { BamFrameHeader } from '../model/bam-frame';
import { ColorRGB } from '../model/color';

export { BAMTexture };

/**
 * @typedef {Object} BAMTextureArgs
 * @property {string} name
 * @property {FrameHeader} header
 * @property {Color[]} palette
 * @property {FrameEntry[]} frames
 *
 * @typedef {Object} FrameEntry
 * @property {number} width
 * @property {number} height
 * @property {number} centerX
 * @property {number} centerY
 * @property {boolean} compressed Frame data is RLE compressed
 * @property {ArrayBuffer} data Pixels in RGBA
 *
 * @typedef {Object} FrameHeader
 * @property {number} frameEntriesCount
 * @property {number} cyclesCount
 * @property {number} compressedColorIndex
 * @property {number} frameEntriesOffset
 * @property {number} paletteOffset
 * @property {number} frameLookupTableOffset
 *
 * @typedef {Object} Color
 * @property {number} red
 * @property {number} green
 * @property {number} blue
 *
 */

/**
 * @see http://gemrb.org/iesdp/file_formats/ie_formats/bam_v1.htm#bamv1_Header
 */
const offsets = {
    signature: 0x0000,
    version: 0x0004,
    frameEntriesCount: 0x0008,
    cyclesCount: 0x000a,
    compressedColorIndex: 0x000b,
    frameEntries: 0x000c,
    palette: 0x0010,
    frameLookupTable: 0x0014,
};

/**
 * @see http://gemrb.org/iesdp/file_formats/ie_formats/bam_v1.htm#bamv1_FrameEntry
 */
const frameHeaderSize = 12;

/**
 * Adapter for BAM images
 *
 * @property {Function} parse
 * @property {Function} parseHeader
 * @property {Function} parsePalette
 * @property {Function} parseFrames
 */
export default class BAMAdapter {
    /**
     * Parse BAM image binary data
     *
     * @param data BAM image binary data
     * @returns {BAMTexture}
     */
    
    private signature: string = ''

    parse(name: string, data: ArrayBuffer) {
        const header = this.parseHeader(data);
        const frames = this.parseFrames(data, header);
        const palette = this.parsePalette(data, header.paletteOffset, header.frameLookupTableOffset);
        const texture = new BAMTexture(name, header, palette, frames);
        return texture;
    }

    /**
     * Extract header data from BAM image
     *
     * @param data BAM image binary data
     * @throws {Error} When magic word not matched
     */
    parseHeader(data: ArrayBuffer): BamFrameHeader {
        const view = new DataView(data);
        let signature = new Uint8Array(8);
        for (let offset = 0x0000; offset < 0x0008; offset++) {
            signature[offset] = view.getUint8(offset);
        }
        const parsedSignature = new TextDecoder('utf-8').decode(signature);
        if (parsedSignature === 'BAM V1  ') {
            this.signature = parsedSignature;
            return {
                frameEntriesCount: view.getUint16(offsets.frameEntriesCount, true),
                cyclesCount: view.getUint8(offsets.cyclesCount),
                compressedColorIndex: view.getUint8(offsets.compressedColorIndex),
                frameEntriesOffset: view.getUint32(offsets.frameEntries, true),
                paletteOffset: view.getUint32(offsets.palette, true),
                frameLookupTableOffset: view.getUint32(offsets.frameLookupTable, true),
            };
        }
        throw new Error(`Unknown format: ${parsedSignature}`);
    }

    /**
     * Extract palette data from BAM image
     *
     * @param data BAM image binary data
     * @param offset Where palette starts
     * @param end Where palette ends
     */
    parsePalette(data: ArrayBuffer, offset: number, end: number): ColorRGB[] {
        const view = new DataView(data);
        const palette = [];
        for (let i = offset; i < end - 4; i = i + 4) {
            const red = view.getUint8(i);
            const green = view.getUint8(i + 1);
            const blue = view.getUint8(i + 2);
            // const alpha = view.getUint8(i + 3); not used
            palette.push({ red, green, blue });
        }
        return palette;
    }

    /**
     * Extract frames entries and data from BAM binary buffer
     *
     * @param data BAM image binary data
     * @param {FrameHeader} header
     * @param {number} header.frameEntriesOffset Where frame entries starts
     * @param {number} header.frameEntriesCount How many entries there are to read
     * @param {number} header.compressedColorIndex The compressed colour index for RLE encoded bams
     * @returns {FrameEntry[]}
     */
    parseFrames(data: ArrayBuffer, frameHeader: BamFrameHeader) {
        const { frameEntriesOffset, frameEntriesCount, compressedColorIndex } = frameHeader
        const view = new DataView(data);
        const frameEntries = [];
        for (let frameIndex = 0; frameIndex < frameEntriesCount; frameIndex++) {
            const frameOffset = frameEntriesOffset + frameIndex * frameHeaderSize;
            const frameEntry = {
                width: view.getUint16(frameOffset + 0x0000, true),
                height: view.getUint16(frameOffset + 0x0002, true),
                centerX: view.getInt16(frameOffset + 0x0004, true),
                centerY: view.getInt16(frameOffset + 0x0006, true),
                compressed: Boolean(view.getUint8(frameOffset + 0x0008 + 3)),
                data: null as unknown as ArrayBuffer
            };
            // bit 0-30 is actual offset
            const rgbaOffset = view.getUint32(frameOffset + frameHeaderSize - 4, true) << 1 >> 1;
            frameEntry.data = data.slice(rgbaOffset);
            // bit 31 is RLE compression flag
            const compressed = view.getUint32(frameOffset + frameHeaderSize - 4, true) >> 31;
            frameEntry.compressed = !compressed;
            frameEntries.push(frameEntry);
        }
        return frameEntries;
    }
}

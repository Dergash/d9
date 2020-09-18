import { ColorRGB } from '../model/color'
import { BamFrameEntry, BamFrameHeader } from '../model/bam-frame'


type Dimensions = {
    width: number,
    height: number
}

type Range = { start: number, end: number }

type Padding = {
    /**
     * Sum of transparent area left and right of actual image
     */
    horizontal: number,
    /**
     * Transparent area on top of actual image (TODO: bottom probably requires cycles[])
     */
    vertical: number
}

/**
 * BAM texture object
 * @param {Function} decompressFrames
 * @param {Function} combineFrames
 */
export default class BAMTexture {

    constructor(
        public name: string,
        public header: BamFrameHeader,
        public palette: ColorRGB[],
        public frames: BamFrameEntry[]
    ) {}

    /**
     * Decompress frames
     */
    decompressFrames() {
        this.frames.forEach(frame => {
            if (frame.compressed && frame.data) {
                frame.data = decompressRLE(frame.data, this.header.compressedColorIndex)
                frame.compressed = false
            }
        })
    }

    /**
     * Combine frames into one single frame which replace them.
     *
     * TODO: It seems that cycles[] was used to determine how frames attached to each other
     * (along with their centerX/Y fields). Currently this method works only for vertical combinations.
     */
    combineFrames() {
        this.applyPaddedDimensions();
        const dimensions = this.frames.reduce((prev: BamFrameEntry, next: BamFrameEntry) => {
            const { paddedWidth: prevPaddedWidth = 0, paddedHeight: prevPaddedHeight = 0 } = prev
            const { paddedWidth: nextPaddedWidth = 0, paddedHeight: nextPaddedHeight = 0 } = next
            return {
                width: prevPaddedWidth < nextPaddedWidth ? nextPaddedWidth : prevPaddedWidth,
                height: prevPaddedHeight + nextPaddedHeight,
            }
        })
        const spriteSize = dimensions.width * dimensions.height;
        const data = new Uint8Array(spriteSize);
        this.frames.forEach((frame, index) => {
            this.putFrameInSprite(data, dimensions, frame, index);
        });
        this.frames = [{
            data,
            width: dimensions.width,
            height: dimensions.height,
        }];
    }

    /**
     * Extend frame with transparency paddings and place it in sprite data array. 
     *
     * @param frame
     * @param frameIndex
     * @param spriteData
     * @param spriteDimensions
     */
    putFrameInSprite(spriteData: Uint8Array, spriteDimensions: Dimensions, frame: BamFrameEntry, frameIndex: number) {
        // Frame range
        const { start: frameStart, end: frameEnd } = this.getFrameRange(frameIndex, spriteDimensions);
        // Transparent paddings
        const { horizontal, vertical } = this.getFramePadding(frame, spriteDimensions);
        // Actual image range
        const imageRange = { start: frameStart + vertical, end: frameEnd };
        // Fill top padding with transparency
        for (let i = frameStart; i < imageRange.start; i++) {
            spriteData[i] = this.header.compressedColorIndex;
        }
        // Fill image data
        this.putImageInSprite(spriteData, imageRange, frame, horizontal);
    }

    /**
     * Extend frame with horizontal transparent padding and
     * copy frame pixel data into specific range of output data array.
     *
     * Horizontal padding is required to concatenate two frames in one consistent sprite.
     *
     * Example: let T be transparency pixel and P be an actual frame data pixel,
     * and frame data is [P, P, P, P, P, P] with image width of 3.
     *
     * Then, when we set padding of 2, we get
     * [T, T, P, P, P, T, T, P, P, P]
     */
    putImageInSprite(data: Uint8Array, range: Range, frame: BamFrameEntry, padding: number) {
        let frameBytesCounter = 0;
        let paddingBytesCounter = padding;
        let srcPixelIndex = 0;
        for (let i = range.start; i < range.end; i++) {
            if (paddingBytesCounter !== 0) { // Process transparent padding
                data[i] = this.header.compressedColorIndex;
                paddingBytesCounter--;
            } else { // Process actual image pixels
                if (data) {
                    data[i] = frame.data ? new Uint8Array(frame.data)[srcPixelIndex] : 0
                }
                srcPixelIndex++;
                frameBytesCounter++;
            }
            if (frameBytesCounter === frame.width) { // Go to the next padding
                paddingBytesCounter = padding;
                frameBytesCounter = 0;
            }
        }
    }

    /**
     * Add paddedWidth/paddedHeight properties, calculated as (original width/height + transparent padding)
     * for each frame.
     *
     * Frames concatenated with centerX, centerY coordinates.
     * When centerX/centerY is negative, actual image is shifted right/bottom
     */
    applyPaddedDimensions() {
        this.frames = this.frames.map(frame => ({
            ...frame,
            paddedWidth: ((frame.centerX ?? 0) < 0) ? Math.abs(frame.centerX ?? 0) + frame.width : frame.width,
            paddedHeight: ((frame.centerY ?? 0) < 0) ? Math.abs(frame.centerY ?? 0) + frame.height : frame.height,
        }));
    }

    /**
     * Get start/end offsets for the frame in the output array
     *
     * @param frameIndex Frame index
     * @param {Dimensions} spriteDimensions Resulting image dimenstions
     * @returns {Range}
     */
    getFrameRange(frameIndex: number, spriteDimensions: Dimensions) {
        let start = 0;
        for (let i = 0; i < frameIndex; i++) {
            const { paddedWidth = 0, paddedHeight = 0} = this.frames[i]
                start += paddedWidth * paddedHeight
        }
        const end = start + spriteDimensions.width * (this.frames[frameIndex].paddedHeight ?? 0);
        return { start, end };
    }

    /**
     * Get transparent padding around actual image
     */
    getFramePadding(frame: BamFrameEntry, spriteDimensions: Dimensions): Padding {
        return {
            horizontal: spriteDimensions.width - frame.width,
            vertical: spriteDimensions.width * ((frame.paddedHeight ?? 0) - frame.height),
        };
    }
}

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
    const compressedData = new DataView(data);
    const decompressedData = [];
    for (let i = 0; i < compressedData.byteLength; i++) {
        if (compressedData.getUint8(i) === compressionByte) {
            const numberOfRepeats = compressedData.getUint8(i + 1) + 1;
            for (let processedRepeats = 0; processedRepeats < numberOfRepeats; processedRepeats++) {
                decompressedData.push(compressionByte);
            }
            i = i + 1;
        } else {
            decompressedData.push(compressedData.getUint8(i));
        }
    }
    return new Uint8Array(decompressedData);
}

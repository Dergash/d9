import { ColorRGB } from '../model/color'
import { BamFrameEntry, BamFrameHeader, DecompressedFrameEntry } from '../model/bam-frame'
import { decompressRLE } from '../utils/rle'

/**
 * BAM texture object
 *
 * @param {Function} decompressFrames
 * @param {Function} combineFrames
 */
export default class BAMTexture {

    public name: string
    private header: BamFrameHeader
    public palette: ColorRGB[]
    public frames: DecompressedFrameEntry[]

    /**
     * Sprite final dimensions after frames combined
     */
    dimensions = {
        width: 0,
        height : 0
    }

    constructor(
        name: string,
        header: BamFrameHeader,
        palette: ColorRGB[],
        frames: BamFrameEntry[]
    ) {
        this.name = name
        this.header = header
        this.palette = palette
        this.frames = this.decompressFrames(frames)
        if (this.frames.length > 1) {
            this.combineFrames()
        }
    }

    /**
     * Decompress frames
     */
    decompressFrames(frames: BamFrameEntry[]): DecompressedFrameEntry[] {
        return frames.map(frame => {
            const resultFrame = frame as DecompressedFrameEntry
            if (frame.compressed && frame.data) {
                resultFrame.data = decompressRLE(
                    frame.data,
                    this.header.compressedColorIndex
                )
                resultFrame.compressed = false
            }
            const [width, height] = this.getPaddedDimensions(frame)
            resultFrame.paddedWidth = width
            resultFrame.paddedHeight = height
            return resultFrame
        })
        
    }

    /**
     * Combine frames into one single frame which replace them.
     *
     * TODO: It seems that cycles[] was used to determine how frames attached to each other
     * (along with their centerX/Y fields). Currently this method works only for vertical combinations.
     */
    combineFrames() {
        /**
         * TODO: Currently hardcoded for two vertical frames, concatenation will be different
         * for more complex sprites
         */
        this.dimensions.width = Math.max(...this.frames.map(frame => frame.paddedWidth as number))
        this.dimensions.height = this.frames.reduce((prev, next) => {
            return prev + (next.paddedHeight as number)
        }, 0)

        const spriteSize = this.dimensions.width * this.dimensions.height
        // Initialize result sprite with transparent background
        const data = new Uint8Array(spriteSize).fill(this.header.compressedColorIndex)
        this.frames.forEach((frame, index) => {
            this.putFrameInSprite(data, frame)
        })
        this.frames = [
            {
                data,
                width: this.dimensions.width,
                height: this.dimensions.height,
                paddedHeight: this.dimensions.height,
                paddedWidth: this.dimensions.width,
                dataOffset: 0
            },
        ]
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
     * 
     * TODO: It's hardcoded for two vertical frames and overcomplicated, WIP 
     */
    putFrameInSprite(
        data: Uint8Array,
        frame: DecompressedFrameEntry
    ) {
        // From which side transparent padding should be appended
        const paddedHorizontal = this.frames.some(item => item !== frame && item.paddedWidth > frame.paddedWidth)
            ? 'right'
            : 'left'
        // Calculate offset by sum offsets of all previous frames
        const offset = this.frames
        .slice(0, this.frames.findIndex(item => item === frame))
        .reduce((prev, next) => {
            const frameSizeInBytes = next.paddedHeight * this.dimensions.width
            return prev + frameSizeInBytes
        }, 0)
        // If frame was moved vertically by `centerY` we skip transparent rectangle padding
        const verticalPaddingOffset = (frame.paddedHeight - frame.height) * this.dimensions.width
        // Set cursor to starting index of `centered` frame
        let resultByteIndex = offset + verticalPaddingOffset
        // If frame was moved horizontally by `centerX` skip left padding
        resultByteIndex = resultByteIndex + (frame.paddedWidth - frame.width)
        
        // TODO: Will be explained in .MD markdown file
        
        if (paddedHorizontal === 'right') {
            for (let i = 0; i < frame.height * frame.width; i++) {
                const eol = ((i + 1) % frame.width) === 0
                if (eol) {
                    resultByteIndex += (frame.paddedWidth - frame.width) + (this.dimensions.width - frame.paddedWidth)
                }
                data[resultByteIndex] = frame.data[i]
                resultByteIndex++
            }
        }

        if (paddedHorizontal === 'left') {
            for (let i = 0; i < frame.data.length; i++) {
                const eol = ((resultByteIndex) % frame.paddedWidth) === 0
                if (eol) {
                    resultByteIndex += (frame.paddedWidth - frame.width)
                } else {
                    data[resultByteIndex] = frame.data[i]
                }
                resultByteIndex++
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
    getPaddedDimensions(frame: BamFrameEntry) {
        const paddedWidth = (frame.centerX ?? 0) < 0
            ? Math.abs(frame.centerX ?? 0) + frame.width
            : frame.width
        const paddedHeight = (frame.centerY ?? 0) < 0
            ? Math.abs(frame.centerY ?? 0) + frame.height
            : frame.height
        return [paddedWidth, paddedHeight]
    }

}

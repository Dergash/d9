import BAMAdapter, { BAMTexture } from './bam'
import { getBinaryFile } from '../utils/fs'
import { BamFrameHeader } from '../model/bam-frame'

describe.skip('BAM adapter', () => {
    const adapter = new BAMAdapter()
    let uncompressedBam: ArrayBuffer
    let multipleFramesBam: ArrayBuffer

    beforeAll(() => {
        uncompressedBam = getBinaryFile('assets/COLGRAD.BAM')
        multipleFramesBam = getBinaryFile('assets/CEFF1INV.BAM')
    })

    it('should parse header', () => {
        const header = adapter.parseHeader(multipleFramesBam)
        expect(header).toEqual(expectedResult.header)
    })

    it('should parse palette', () => {
        const { paletteOffset, frameLookupTableOffset } = expectedResult.header
        const palette = adapter.parsePalette(
            multipleFramesBam,
            paletteOffset,
            frameLookupTableOffset
        )
        expect(palette).toHaveLength(255)
        expect(palette[0]).toEqual({ red: 0, green: 255, blue: 0 })
        expect(palette[254]).toEqual({ red: 72, green: 71, blue: 0 })
    })

    it('should parse frames', () => {
        const frames = adapter.parseFrames(
            multipleFramesBam,
            expectedResult.header
        )
        expect(frames.length).toBe(expectedResult.frames.length)
        expect(frames[0]).toMatchObject(expectedResult.frames[0])
        expect(frames[0].data.byteLength).toBe(expectedFrame0Length)
        expect(frames[1]).toMatchObject(expectedResult.frames[1])
        expect(frames[1].data.byteLength).toBe(expectedFrame1Length)
    })

    it('should return BAMTexture', () => {
        const texture = adapter.parse('CEFF1INV.BAM', multipleFramesBam)
        texture.palette = [] // skip
        expect(texture).toMatchObject(expectedResult)
    })

    it('should detect compression flag', () => {
        const compressedFrames = adapter.parseFrames(
            multipleFramesBam,
            expectedResult.header
        )
        const uncompressedFrames = adapter.parseFrames(uncompressedBam, {
            frameEntriesOffset: uncompressedBamFramesOffset,
            frameEntriesCount: 1,
        } as BamFrameHeader)
        expect(compressedFrames[0].compressed).toBe(true)
        expect(compressedFrames[1].compressed).toBe(true)
        expect(uncompressedFrames[0].compressed).toBe(false)
    })
})

const expectedResult = new BAMTexture(
    'CEFF1INV.BAM',
    {
        compressedColorIndex: 0,
        cyclesCount: 1,
        frameEntriesCount: 2,
        frameEntriesOffset: 24,
        frameLookupTableOffset: 1076,
        paletteOffset: 52,
    },
    [],
    [
        {
            width: 60,
            height: 60,
            centerX: -31,
            centerY: -20,
            compressed: true,
            // data is ArrayBuffer, just checking length
        },
        {
            width: 53,
            height: 65,
            centerX: -37,
            centerY: 0,
            compressed: true,
        },
    ]
)
const expectedFrame0Length = 4233
const expectedFrame1Length = 2021
const uncompressedBamFramesOffset = 24

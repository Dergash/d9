export type BamFrameHeader = {
    /**
     * How many entries there are to read
     */
    frameEntriesCount: number
    cyclesCount: number
    /**
     * The compressed colour index for RLE encoded bams
     */
    compressedColorIndex: number
    /**
     * Where frame entries start
     */
    frameEntriesOffset: number
    paletteOffset: number
    frameLookupTableOffset: number
}

export type BamFrameEntry = {
    width: number
    height: number
    centerX?: number // TODO: mandatory
    centerY?: number // TODO: mandatory
    /**
     * Frame data is RLE compressed
     */
    compressed?: boolean // TODO: mandatory
    /**
     * Pixels in RGBA
     */
    data: ArrayBuffer,
    dataOffset: number
}

export type PaddedFrameEntry = BamFrameEntry & {
    paddedWidth: number,
    paddedHeight: number
}

export type DecompressedFrameEntry = BamFrameEntry & PaddedFrameEntry & {
    data: Uint8Array
}

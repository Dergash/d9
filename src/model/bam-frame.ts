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
    data?: ArrayBuffer // TODO: mandatory
    // TODO: All properties below are not actually a part of BAM and should be moved elsewhere
    paddedWidth?: number
    paddedHeight?: number
}

import offsets from '../offsets/chr'
import { readString } from '../utils/binary'

export type ChrVersion = 'V1.0' // BG1, BG1: TotS
    | 'V1.2' // PST
    | 'V2.0' // BG2, BG2: TOB
    | 'V2.2' // IWD2
    | 'V9.0' // IWD, IWD:HoW, IWD:TotL

/**
 * Adapter for .CHR files, i.e. character files.
 * They wrap .CRE entity and may itself be part of save files.
 *
 * 
 */
export class ChrEntity {

    signature = 'CHR ' as const
    
    public quickWeapon1: unknown = null
    public quickWeapon2: unknown = null
    public quickWeapon3: unknown = null
    public quickWeapon4: unknown = null
    public showQuickWeapon1: boolean = false
    public showQuickWeapon2: boolean = false
    public showQuickWeapon3: boolean = false
    public showQuickWeapon4: boolean = false

    public quickSpell1: unknown = null
    public quickSpell2: unknown = null
    public quickSpell3: unknown = null

    public quickItem1: unknown = null
    public quickItem2: unknown = null
    public quickItem3: unknown = null
    public showQuickItem1: boolean = false
    public showQuickItem2: boolean = false
    public showQuickItem3: boolean = false

    constructor(
        private version: ChrVersion,
        private name: string,
    ) {

    }

    static parse(buffer: ArrayBuffer): ChrEntity {
        const view = new DataView(buffer)
        let signature = readString(view, offsets.signature, 4, false)
        if (signature !== 'CHR ') {
            throw new Error(`Unknown format: ${signature}`)
        }
        const version = readString<ChrVersion>(view, offsets.version, 4)
        const name = readString(view, offsets.name, 32)
        const result = new ChrEntity(version, name)
        // const creOffset = view.getUint32(offsets.creOffset, true)
        // const creLength = view.getUint32(offsets.creLength, true)
        result.quickWeapon1 = view.getUint16(offsets.quickWeapon1, true)
        result.quickWeapon2 = view.getUint16(offsets.quickWeapon2, true)
        result.quickWeapon3 = view.getUint16(offsets.quickWeapon3, true)
        result.quickWeapon4 = view.getUint16(offsets.quickWeapon4, true)
        // result.showQuickWeapon1 = view.getUint16(offsets.showQuickWeapon1, true) as unknown as boolean
        // result.showQuickWeapon2 = view.getUint16(offsets.showQuickWeapon2, true) as unknown as boolean
        // result.showQuickWeapon3 = view.getUint16(offsets.showQuickWeapon3, true) as unknown as boolean
        // result.showQuickWeapon4 = view.getUint16(offsets.showQuickWeapon4, true) as unknown as boolean
        result.quickSpell1 = readString(view, offsets.quickSpell1, 8)
        result.quickSpell2 = readString(view, offsets.quickSpell2, 8)
        result.quickSpell3 = readString(view, offsets.quickSpell3, 8)
        result.quickItem1 = view.getUint16(offsets.quickItem1, true)
        result.quickItem2 = view.getUint16(offsets.quickItem2, true)
        result.quickItem3 = view.getUint16(offsets.quickItem3, true)
        // result.showQuickItem1 = view.getUint16(offsets.showQuickItem1, true)
        // result.showQuickItem2 = view.getUint16(offsets.showQuickItem2, true)
        // result.showQuickItem3 = view.getUint16(offsets.showQuickItem3, true)
        return result
    }

    /**
     * Format version
     */
    public getVersion() {
        return this.version
    }

    /**
     * getName
    */
    public getName() {
        return this.name
    }
}

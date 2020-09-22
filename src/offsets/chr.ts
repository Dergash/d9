
/**
 * @see https://gibberlings3.github.io/iesdp/file_formats/ie_formats/chr_v1.htm
 */
export default {
    /**
     * Signature ('CHR ')
     */
    signature: 0x0000,
    /**
     * Version of the format
     */
    version: 0x0004,
    /**
     * Name of Protagonist/Player
     */
    name: 0x0008,
    /**
     * Offset to CRE structure
     */
    creOffset: 0x0028,
    /**
     * Length of the CRE structure
     */
    creLength: 0x002c,
    /**
     * Index into slots.ids for Quick Weapon 1 (0xFFFF = none)
     */
    quickWeapon1: 0x0030,
    /**
     * Index into slots.ids for Quick Weapon 2 (0xFFFF = none)
     */
    quickWeapon2: 0x0032,
    /**
     * Index into slots.ids for Quick Weapon 3 (0xFFFF = none)
     */
    quickWeapon3: 0x0034,
    /**
     * Index into slots.ids for Quick Weapon 4 (0xFFFF = none)
     */
    quickWeapon4: 0x0036,
    /**
     * Show Quick Weapon 1
     */
    showQuickWeapon1: 0x0038,
    /**
     * Show Quick Weapon 2
     */
    showQuickWeapon2: 0x003a,
    /**
     * Show Quick Weapon 3
     */
    showQuickWeapon3: 0x003c,
    /**
     * Show Quick Weapon 4
     */
    showQuickWeapon4: 0x003e,
    /**
     * Quick Spell 1 resource
     */
    quickSpell1: 0x0040,
    /**
     * Quick Spell 12 resource
     */
    quickSpell2: 0x0048,
    /**
     * Quick Spell 3 resource
     */
    quickSpell3: 0x0050,
    /**
     * Index into slot.ids for Quick Item 1
     */
    quickItem1: 0x0058,
    /**
     * Index into slot.ids for Quick Item 2
     */
    quickItem2: 0x005a,
    /**
     * Index into slot.ids for Quick Item 3
     */
    quickItem3: 0x005c,
    /**
     * Show Quick Item 1
     */
    showQuickItem1: 0x005e,
    /**
     * Show Quick Item 2
     */
    showQuickItem2: 0x0060,
    /**
     * Show Quick Item 3
     */
    showQuickItem3: 0x0062,
}

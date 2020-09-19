import { AppearanceColorType } from '../../model/color'

export const dictionary = {
    skin: [
        0x53, 0x6B, 0x08, 0x72, 0x09, 0x0A,
        0x55, 0x54, 0x0C, 0x10, 0x0F, 0x11,
        0x6C, 0x6A, 0x71, 0x0E, 0x0D, 0x69
    ],
    hair: [
        0x4F, 0x06, 0x00, 0x02, 0x01, 0x04,
        0x6F, 0x50, 0x03, 0x51, 0x07, 0x52
    ],
    major: [
        36, 37, 38, 39, 40, 41,
        42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 59,
        60, 61, 62, 63, 64, 65,
            66, 67, 68, 69
    ],
    minor: [
        36, 37, 38, 39, 40, 41,
        42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53,
        54, 55, 56, 57, 58, 59,
        60, 61, 62, 63, 64, 65,
            66, 67, 68, 69
    ],
    armor: [
        22, // Leather Armor
        92, // Leather Armor +1
        95, // Leather Armor +2
        91, // Studded Leather Armor
       // 95, // Studded Leather Armor +1
        94, // Studded Leather Armor +2
        21, // Shadow Armor
        6, // Chainmail armor
        97, // Chainmail armor +1
        5, // Chainmail armor +2
        18, // Mithril Chain Mail +4
        27, // Splint Mail
        14, // Splint Mail +1
        28, // Plate Armor
        7, // Ankheg Plate Mail
       // 27, // Full Plate Armor
        29, // Full Plate Armor +1
    ],
    leather: [
        23,// Leather Armor
        21, // Leather Armor +1
        94,// Leather Armor +2
        92, // Studded Leather Armor
        99, // Studded Leather Armor +1
        95, // Studded Leather Armor +2
       // 94, // Shadow Armor
        22, // Chainmail armor
        100, // Chainmail armor +1
       // 99, // Chainmail armor +2
       // 99, // Mithril Chain Mail +4
       // 94, // Splint Mail
       // 94, // Splint Mail +1
       // 23, // Plate Armor
        10, // Ankheg Plate Mail
        91, // Full Plate Armor
       // 23, // Full Plate Armor +1
    ],
    metal: [
        30,// Leather Armor
        93, // Leather Armor +1
        27, // Leather Armor +2
       // 27, // Studded Leather Armor
       // 93, // Studded Leather Armor +1
        25, // Studded Leather Armor +2
       // 27, // Shadow Armor
       // 27, // Chainmail armor
        94, // Chainmail armor +1
       // 25, // Chainmail armor +2
       // 27, // Mithril Chain Mail +4
       // 25, // Splint Mail
       // 25, // Splint Mail +1
       // 30, // Plate Armor,
        44, // Ankheg Plate Mail
       // 30, // Full Plate Armor
        29, // Full Plate Armor +1
    ],
}

export function useColorTable(type: AppearanceColorType | undefined) {
    if (type) {
        return dictionary[type]
    }
    return null
}

import {TextDecoder} from 'text-decoding'

export function readString<T = string>(dataView: DataView, offset: number, length: number, trim = true) {
    let buffer = new Uint8Array(length)
    for (let i = offset; i < offset + length; i++) {
        buffer[i] = dataView.getUint8(i)
    }
    const decodedString = new TextDecoder('utf-8').decode(buffer) as string
    const result = trim
    ? trimString(decodedString)
    : decodedString
    return result as unknown as T
}

export function trimString(input: string) {
    let start = 0
    while (input.charCodeAt(start) === 0 && start < input.length) {
        start++
    }
    let end = input.length - 1
    while (input.charCodeAt(end) === 0 && end > 0) {
        end--
    }
    return input.substring(start, end + 1)
}
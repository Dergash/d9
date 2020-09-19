const fs = require('fs')

/**
 * Synchronously read file content into ArrayBuffer
 *
 * @param filePath
 */
export function getBinaryFile(filePath: string): ArrayBuffer {
  const nodeBuffer = fs.readFileSync(filePath)
  const length = nodeBuffer.byteOffset + nodeBuffer.byteLength
  const arrayBuffer = nodeBuffer.buffer.slice(nodeBuffer.byteOffset, length)
  return arrayBuffer
}

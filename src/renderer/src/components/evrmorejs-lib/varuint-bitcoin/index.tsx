'use strict';
import { Buffer } from 'buffer';

// Number.MAX_SAFE_INTEGER
const MAX_SAFE_INTEGER = 9007199254740991;

function checkUInt53(n: number): void {
  if (n < 0 || n > MAX_SAFE_INTEGER || n % 1 !== 0) throw new RangeError('value out of range');
}

function encode(number: number, buffer?: Buffer, offset?: number): Buffer {
  checkUInt53(number);

  if (!buffer) buffer = Buffer.allocUnsafe(encodingLength(number));
  if (!Buffer.isBuffer(buffer)) throw new TypeError('buffer must be a Buffer instance');
  if (!offset) offset = 0;

  // 8 bit
  if (number < 0xfd) {
    buffer.writeUInt8(number, offset);
    encode.bytes = 1;

    // 16 bit
  } else if (number <= 0xffff) {
    buffer.writeUInt8(0xfd, offset);
    buffer.writeUInt16LE(number, offset + 1);
    encode.bytes = 3;

    // 32 bit
  } else if (number <= 0xffffffff) {
    buffer.writeUInt8(0xfe, offset);
    buffer.writeUInt32LE(number, offset + 1);
    encode.bytes = 5;

    // 64 bit
  } else {
    buffer.writeUInt8(0xff, offset);
    buffer.writeUInt32LE(number >>> 0, offset + 1);
    buffer.writeUInt32LE((number / 0x100000000) | 0, offset + 5);
    encode.bytes = 9;
  }

  return buffer;
}
encode.bytes = 0;

function decode(buffer: Buffer, offset?: number): number {
  if (!Buffer.isBuffer(buffer)) throw new TypeError('buffer must be a Buffer instance');
  if (!offset) offset = 0;

  const first = buffer.readUInt8(offset);

  // 8 bit
  if (first < 0xfd) {
    decode.bytes = 1;
    return first;

    // 16 bit
  } else if (first === 0xfd) {
    decode.bytes = 3;
    return buffer.readUInt16LE(offset + 1);

    // 32 bit
  } else if (first === 0xfe) {
    decode.bytes = 5;
    return buffer.readUInt32LE(offset + 1);

    // 64 bit
  } else {
    decode.bytes = 9;
    const lo = buffer.readUInt32LE(offset + 1);
    const hi = buffer.readUInt32LE(offset + 5);
    const number = hi * 0x0100000000 + lo;
    checkUInt53(number);

    return number;
  }
}
decode.bytes = 0;

function encodingLength(number: number): number {
  checkUInt53(number);

  return (
    number < 0xfd ? 1
      : number <= 0xffff ? 3
        : number <= 0xffffffff ? 5
          : 9
  );
}

export { encode, decode, encodingLength };

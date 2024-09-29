import { Buffer } from 'buffer';

function simpleFunction() {
  const buffer = Buffer.from("Hello from simpleFunction!");
  return buffer.toString();
}


export default simpleFunction;

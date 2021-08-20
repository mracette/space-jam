import { Basic1 } from "./Basic1";
import { Basic2 } from "./Basic2";
import { Basic3 } from "./Basic3";

const args = { preview: true };

export const INSTRUMENT_ENTITIES: any[] = [
  new Basic1(args),
  new Basic2(args),
  new Basic3(args)
];

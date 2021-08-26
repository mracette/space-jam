export interface EnvelopeValue {
  time: number;
  value: number;
  exp?: boolean;
}

export class Sound {
  baseReverb: number;
  envelop: EnvelopeValue[];
  lpFilterEnvelope: EnvelopeValue[];
  constructor(args: any) {}
  play(time: number, note: number) {}
}

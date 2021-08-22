export interface EnvelopeValue {
  time: number;
  value: number;
}

export class Sound {
  envelop: EnvelopeValue[];
  constructor(args: any) {}
}

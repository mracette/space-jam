import { AudioManager } from "../core/AudioManager";
import Scheduler from "../core/AudioScheduler";

export const enum NUM_FREQ_BANDS {
  VALUE = 5
}

export const enum SAMPLE_RATE {
  VALUE = 44100
}

export const enum REVERB_TIME {
  VALUE = 2
}

export const MIXOLYDIAN_SCALE = [0, 4, 5, 7, 10];

export const AUDIO = new AudioManager();

export const SCHEDULER = new Scheduler();

export const BASE_NOTE = 196;

export const enum BPM {
  VALUE = 70,
  BPS = 70 / 60,
  SPB = 60 / 70
}

export const enum DURATIONS {
  WHOLE = BPM.SPB * 4,
  WHOLE_TRIPLETS = (BPM.SPB * 8) / 3,
  HALF = BPM.SPB * 2,
  HALF_TRIPLETS = (BPM.SPB * 4) / 3,
  QUARTER = BPM.SPB,
  QUARTER_TRIPLETS = (BPM.SPB * 2) / 3,
  EIGHTH = BPM.SPB / 2,
  EIGHTH_TRIPLETS = BPM.SPB / 2 / 3,
  SIXTEENTH = BPM.SPB / 4,
  THIRTY_SECONDTH = BPM.SPB / 8
}

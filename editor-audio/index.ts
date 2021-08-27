import { LongSaw } from "../src/entities/sounds/harmonic-synth/LongSaw";
import { Organ } from "../src/entities/sounds/harmonic-synth/Organ";
import { TinSaw } from "../src/entities/sounds/harmonic-synth/TinSaw";
import { TinSine } from "../src/entities/sounds/harmonic-synth/TinSine";
import { TinSquare } from "../src/entities/sounds/harmonic-synth/TinSquare";
import { Eight0Eight } from "../src/entities/sounds/waveform-synth/808";
import { AUDIO, MIXOLYDIAN_SCALE } from "../src/globals/audio";

const testInstruments = [
  {
    name: "organ",
    instrument: new Organ()
  },
  {
    name: "tin-can",
    instrument: new TinSine()
  },
  {
    name: "tin-square",
    instrument: new TinSquare()
  },
  {
    name: "tin-saw",
    instrument: new TinSaw()
  },
  {
    name: "long-saw",
    instrument: new LongSaw()
  },
  {
    name: "808",
    instrument: new Eight0Eight()
  }
];

const init = async () => {
  await AUDIO.init();
  testInstruments.forEach(({ name, instrument }) => {
    const button = document.createElement("button");
    button.innerHTML = name;
    button.style.width = "20vh";
    button.style.height = "20vh";
    button.onclick = () => {
      AUDIO.context.resume();
      instrument.play(
        AUDIO.context.currentTime,
        MIXOLYDIAN_SCALE[Math.floor(Math.random() * MIXOLYDIAN_SCALE.length)]
      );
    };
    document.body.append(button);
  });
};

init();

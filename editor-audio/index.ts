import { AUDIO, MIXOLYDIAN_SCALE } from "../src/globals/audio";
import { ComplexSawSound } from "../src/sounds/harmonic-synth/ComplexSawSound";
import { OrganSound } from "../src/sounds/harmonic-synth/OrganSound";
import { SawSound } from "../src/sounds/harmonic-synth/SawSound";
import { SineSound } from "../src/sounds/harmonic-synth/SineSound";
import { SquareSound } from "../src/sounds/harmonic-synth/SquareSound";
import { HiHatSound } from "../src/sounds/waveform-synth/HiHatSound";
import { KickSound } from "../src/sounds/waveform-synth/KickSound";
import { SnareSound } from "../src/sounds/waveform-synth/SnareSound";
import { TomSound } from "../src/sounds/waveform-synth/TomSound";

const testInstruments = [
  {
    name: "organ",
    instrument: new OrganSound()
  },
  {
    name: "sine-synth",
    instrument: new SineSound()
  },
  {
    name: "tin-square",
    instrument: new SquareSound()
  },
  {
    name: "tin-saw",
    instrument: new SawSound()
  },
  {
    name: "long-saw",
    instrument: new ComplexSawSound()
  },
  {
    name: "808",
    instrument: new KickSound()
  },
  {
    name: "HiHatSound",
    instrument: new HiHatSound()
  },
  {
    name: "TomSound",
    instrument: new TomSound()
  },
  {
    name: "SnareSound",
    instrument: new SnareSound()
  }
];

const init = async () => {
  await AUDIO.init();
  console.log(AUDIO);
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

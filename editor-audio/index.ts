import { AUDIO, MIXOLYDIAN_SCALE } from "../src/globals/audio";
import { ExperimentSound2 } from "../src/sounds/ExperimentSound2";
import { ComplexSawSound } from "../src/sounds/HarmonixSound";
import { HiHatSound } from "../src/sounds/HiHatSound";
import { KickSound } from "../src/sounds/KickSound";
import { OrganSound } from "../src/sounds/OrganSound";
import { ExperimentSound } from "../src/sounds/PlutoniaSound";
import { SawSound } from "../src/sounds/SawSound";
import { SineSound } from "../src/sounds/SineSound";
import { SnareSound } from "../src/sounds/SnareSound";
import { SquareSound } from "../src/sounds/SquareSound";
import { BassSound } from "../src/sounds/ThermalBassSound";
import { TomSound } from "../src/sounds/TomSound";

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
  },
  {
    name: "BassSound",
    instrument: new BassSound()
  },
  {
    name: "ExperimentSound",
    instrument: new ExperimentSound()
  },
  {
    name: "ExperimentSound2",
    instrument: new ExperimentSound2()
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

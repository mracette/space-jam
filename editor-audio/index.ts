import { AUDIO, MIXOLYDIAN_SCALE } from "../src/globals/audio";
import { CosmicRaySound } from "../src/sounds/CosmicRaySound";
import { HarmonixSound } from "../src/sounds/HarmonixSound";
import { HiHatSound } from "../src/sounds/HiHatSound";
import { KickSound } from "../src/sounds/KickSound";
import { OrganSound } from "../src/sounds/OrganSound";
import { PlutoniaSound } from "../src/sounds/PlutoniaSound";
import { SawSound } from "../src/sounds/SawSound";
import { SineSound } from "../src/sounds/SineSound";
import { SnareSound } from "../src/sounds/SnareSound";
import { SquareSound } from "../src/sounds/SquareSound";
import { ThermalBassSound } from "../src/sounds/ThermalBassSound";
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
    name: "harmonix",
    instrument: new HarmonixSound()
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
    instrument: new ThermalBassSound()
  },
  {
    name: "ExperimentSound",
    instrument: new PlutoniaSound()
  },
  {
    name: "CosmicRaySound",
    instrument: new CosmicRaySound()
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

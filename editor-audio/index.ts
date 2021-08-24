import { Organ } from "../src/entities/sounds/synth-sounds/Organ";
import { TinCan } from "../src/entities/sounds/synth-sounds/TinCan";
import { TinSaw } from "../src/entities/sounds/synth-sounds/TinSaw";
import { TinSquare } from "../src/entities/sounds/synth-sounds/TinSquare";
import { AUDIO, MIXOLYDIAN_SCALE } from "../src/globals/audio";

const testInstruments = [
  {
    name: "organ",
    instrument: new Organ()
  },
  {
    name: "tin-can",
    instrument: new TinCan()
  },
  {
    name: "tin-square",
    instrument: new TinSquare()
  },
  {
    name: "tin-square",
    instrument: new TinSaw()
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

import { AudioManager } from "../src/core/AudioManager";
import { Organ } from "../src/entities/sounds/synth-sounds/Organ";

export const AUDIO = new AudioManager();

const testInstruments = [
  {
    name: "organ",
    instrument: new Organ()
  }
];

testInstruments.forEach(({ name, instrument }) => {
  const button = document.createElement("button");
  button.innerHTML = name;
  button.style.width = "20vh";
  button.style.height = "20vh";
  button.onclick = () => {
    AUDIO.context.resume();
    instrument.play(AUDIO.context.currentTime, 0);
  };
  document.body.append(button);
});

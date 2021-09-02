import { AUDIO, SAMPLE_RATE } from "../globals/audio";

interface SingleAudioEvent {
  id: number;
  time: number;
  type: string;
  source: AudioBufferSourceNode;
}

interface RepeatingAudioEvent extends SingleAudioEvent {
  id: number;
  time: number;
  type: string;
  source: AudioBufferSourceNode;
  frequency: number;
  callback: () => unknown;
  count: number;
}

export class Scheduler {
  queue: (SingleAudioEvent | RepeatingAudioEvent)[];
  nextEventId: number;

  constructor() {
    // for events
    this.queue = [];

    // event id
    this.nextEventId = 0;
  }

  scheduleOnce(time: number, callback: () => unknown): number {
    // increment for the next event
    this.nextEventId++;

    // grab the current value of the event id
    const newEventId = this.nextEventId;

    // create a dummy buffer to trigger the event
    const dummyBuffer = AUDIO.context.createBuffer(1, 1, SAMPLE_RATE.VALUE);
    const dummySource = AUDIO.context.createBufferSource();
    dummySource.buffer = dummyBuffer;
    dummySource.connect(AUDIO.context.destination);

    // add to schedule queue
    this.queue.push({
      id: newEventId,
      time,
      type: "single",
      source: dummySource
    });

    dummySource.onended = () => {
      callback();
      this.cancel(newEventId); // ensures GC
    };

    // start buffer
    dummySource.start(time - dummyBuffer.duration);

    return newEventId;
  }

  /* 
  Increment a repeating event
  */
  incrementRepeating(event: RepeatingAudioEvent): void {
    event.count++;
    // the web audio spec doesn't allow buffer source nodes to be reused
    const dummySource = AUDIO.context.createBufferSource();
    dummySource.buffer = event.source.buffer;
    dummySource.connect(AUDIO.context.destination);
    dummySource.onended = () => {
      event.callback();
      // add the next occurence
      this.incrementRepeating(event);
    };
    dummySource.start(
      event.time + event.count * event.frequency - dummySource.buffer.duration
    );
    event.source = dummySource;
  }

  /* 
  Initialize a repeating event
  */
  scheduleRepeating(time: number, frequency: number, callback: () => unknown): number {
    // create a dummy buffer to trigger the event
    const dummyBuffer = AUDIO.context.createBuffer(1, 1, 44100);
    const dummySource = AUDIO.context.createBufferSource();
    dummySource.buffer = dummyBuffer;
    dummySource.connect(AUDIO.context.destination);

    // grab the next event id value
    const newEvent = {
      id: ++this.nextEventId,
      count: 0,
      time,
      frequency,
      type: "repeating",
      callback,
      source: dummySource
    };

    // assign callback
    dummySource.onended = () => {
      callback();
      // add the next occurence
      this.incrementRepeating(newEvent);
    };

    dummySource.start(
      // ensure the start time is positive
      Math.max(0, time - dummyBuffer.duration)
    );

    // initialize the event queue with the first event
    this.queue.push(newEvent);

    return newEvent.id;
  }

  getEvent(id: number): SingleAudioEvent | RepeatingAudioEvent {
    return this.queue.find((e) => e.id === id);
  }

  clear(): void {
    this.queue.forEach((event) => {
      event.source.onended = null;
      event.source.stop();
      event.source.disconnect();
    });
    this.queue.length = 0;
  }

  cancel(id: number): void {
    const event = this.getEvent(id);

    if (event) {
      event.source.onended = null;

      try {
        event.source.stop();
        /* eslint-disable-next-line no-empty */
      } catch (e) {}

      event.source.disconnect();
      this.queue = this.queue.filter((e) => e.id !== event.id);
    }
  }
}

export default Scheduler;

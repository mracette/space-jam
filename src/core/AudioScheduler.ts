import { SAMPLE_RATE } from "../globals";

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
  audioCtx: AudioContext;
  queue: (SingleAudioEvent | RepeatingAudioEvent)[];
  nextEventId: number;

  constructor(audioCtx: AudioContext) {
    // bind audio context
    this.audioCtx = audioCtx;

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
    const dummyBuffer = this.audioCtx.createBuffer(1, 1, SAMPLE_RATE.VALUE);
    const dummySource = this.audioCtx.createBufferSource();
    dummySource.buffer = dummyBuffer;
    dummySource.connect(this.audioCtx.destination);

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
    const dummySource = this.audioCtx.createBufferSource();
    dummySource.buffer = event.source.buffer;
    dummySource.connect(this.audioCtx.destination);
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
    const dummyBuffer = this.audioCtx.createBuffer(1, 1, 44100);
    const dummySource = this.audioCtx.createBufferSource();
    dummySource.buffer = dummyBuffer;
    dummySource.connect(this.audioCtx.destination);

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

  updateCallback(id: number, callback: () => unknown): void {
    const event = this.getEvent(id) as RepeatingAudioEvent;
    if (event) {
      event.callback = callback;
      event.source.onended = () => {
        callback();
        // add the next occurence
        this.incrementRepeating(event);
      };
    }
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

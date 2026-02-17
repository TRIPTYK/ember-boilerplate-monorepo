import EventEmitter from "events";
import type { Serializable } from "worker_threads";

export interface ApplicationEvent<T extends Serializable> {
  type: string;
  timestamp: number;
  payload: T;
}

export class ApplicationEventEmitter {
  private _emitter = new EventEmitter();

  emitEvent<T extends Serializable>(event: ApplicationEvent<T>) {
    this._emitter.emit(event.type, event);
  }

  onEvent<T extends Serializable>(type: string, listener: (event: ApplicationEvent<T>) => void) {
    this._emitter.on(type, listener);
  }
}

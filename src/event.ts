
import type { Provider } from "./provider.js";

export type DDBEventType = "connect" | "disconnect" | "set" | "pub" | "sub" | "unsub";

export interface DDBListener {
  type?: DDBEventType;
  (evt: DDBEvent): void;
}

export interface DDBEvent {
  type: DDBEventType;
  disconnect?: Provider;
  key?: DDBEventKey;
}

export type DDBEventKey = string;
export type DDBEventValue = string;

export interface DDBEventConnect extends DDBEvent {
  type: "connect";
  provider?: Provider;
}
export interface DDBEventDisconnect extends DDBEvent {
  type: "disconnect";
  provider?: Provider;
}
export interface DDBEventSet extends DDBEvent {
  value: DDBEventValue;
}
export interface DDBEventSub extends DDBEvent {
  type: "sub";
}
export interface DDBEventUnSub extends DDBEvent {
  type: "unsub";
}

import { Location as _Location } from "react-router-dom";

export interface Location<TState = unknown> extends _Location {
  state: TState;
}

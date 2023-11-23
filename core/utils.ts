import type { Component } from "./types.ts";

export type ViewOf<T extends Component[]> = {
  [K in T[number]as K["name"]]: K["state"]
};

export interface Component {
  name: string;
  state: { [key: string]: any };
}

export type EntityId = number;
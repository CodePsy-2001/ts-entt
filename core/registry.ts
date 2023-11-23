import type { Component, EntityId } from "./types.ts";
import type { ViewOf } from "./utils.ts";
import { assert } from "https://deno.land/std/assert/mod.ts";

export class EntityRegistry {
  private _entities = new Map<EntityId, { [key: Component["name"]]: Component["state"] }>();

  get entities() {
    return this._entities;
  }

  private getEntityOrThrow(entityId: EntityId) {
    const entity = this.entities.get(entityId);
    assert(entity, `Entity ${entityId} does not exist`);
    return entity;
  }

  /**
   * Creates a new entity
   * @returns a unique ID for the entity
   */
  create(): EntityId {
    const id = Math.random(); // Simple unique ID generator
    this.entities.set(id, {});
    return id;
  }

  /**
   * Destroys an entity and all its associated components.
   * @param entityId the ID of the entity to destroy
   */
  destroy(entityId: EntityId): void {
    this.entities.delete(entityId);
  }

  /**
   * Adds a new component to an entity.
   * @param entityId the ID of the entity to add the component to
   */
  emplace<T extends Component>(entityId: number, name: T["name"], state: T["state"]): void {
    const entity = this.getEntityOrThrow(entityId);
    assert(!entity[name], `Component ${name} already exists on entity ${entityId}`);
    Object.assign(entity, { [name]: state });
  }

  /**
   * Removes a component from an entity.
   * @param entityId the ID of the entity to remove the component from
   */
  remove<T extends Component>(entityId: EntityId, name: T["name"]): void {
    const entity = this.getEntityOrThrow(entityId);
    assert(entity[name], `Component ${name} does not exist on entity ${entityId}`);
    delete entity[name];
  }

  /**
   * Checks if an entity has a certain component.
   * @param entityId the ID of the entity to check
   */
  has<T extends Component>(entityId: EntityId, name: T["name"]): boolean {
    const entity = this.getEntityOrThrow(entityId);
    return !!entity[name];
  }

  /**
   * Checks if an entity has all specified components.
   * @param entityId the ID of the entity to check
   */
  allOf<T extends Component>(entityId: EntityId, names: T["name"][]): boolean {
    const entity = this.getEntityOrThrow(entityId);
    return names.every((name) => !!entity[name]);
  }

  /**
   * Creates a view for entities having certain components.
   */
  view<T extends Component[]>(...names: T[number]["name"][]) {
    return Array.from(this.entities.values()).filter((entity) => names.every((name) => entity[name])) as ViewOf<T>[];
  }

  /**
   * Retrieves a reference to a component of an entity.
   * @param entityId the ID of the entity to retrieve the component from
   */
  get<T extends Component>(entityId: EntityId, name: T["name"]): T["state"] {
    const entity = this.getEntityOrThrow(entityId);
    const comp: T["state"] = entity[name];
    assert(comp, `Component ${name} does not exist on entity ${entityId}`);
    return comp;
  }

  emplaceOrReplace<T extends Component>(entityId: EntityId, name: T["name"], state: T["state"]): void {
    const entity = this.getEntityOrThrow(entityId);
    Object.assign(entity, { [name]: state });
  }

  removeIfExists<T extends Component>(entityId: EntityId, name: T["name"]): void {
    const entity = this.getEntityOrThrow(entityId);
    delete entity[name];
  }

  /**
   * Removes all components of a specific type from all entities.
   */
  clear<T extends Component>(name: T["name"]): void {
    for (const entity of this.entities.values()) {
      delete entity[name];
    }
  }
}

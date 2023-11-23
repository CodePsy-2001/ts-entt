# ts-entt

`ts-entt` is a simple **typescript** mock of **[EnTT](https://github.com/skypjack/entt)**

---

## Code Example

```typescript
import { Component, EntityRegistry } from "./mod.ts";

interface Position extends Component {
  name: "position";
  state: { x: number; y: number };
}

interface Velocity extends Component {
  name: "velocity";
  state: { x: number; y: number };
}

interface Gravity extends Component {
  name: "gravity";
  state: { strength: number };
}

const registry = new EntityRegistry();

const entity1 = registry.create();
registry.emplace<Position>(entity1, "position", { x: 0, y: 0 });
registry.emplace<Velocity>(entity1, "velocity", { x: 0, y: 0 });
registry.emplace<Gravity>(entity1, "gravity", { strength: 1 });

const entity2 = registry.create();
registry.emplace<Position>(entity2, "position", { x: 10, y: 10 });
registry.emplace<Velocity>(entity2, "velocity", { x: 5, y: 1 });
registry.emplace<Gravity>(entity2, "gravity", { strength: 1 });

const gravitySystem = (registry: EntityRegistry, delta: number) => {
  for (const { velocity, gravity } of registry.view<[Velocity, Gravity]>("velocity","gravity")) {
    velocity.y += gravity.strength * delta;
  }
};

const velocitySystem = (registry: EntityRegistry, delta: number) => {
  for (const { position, velocity } of registry.view<[Position, Velocity]>("position","velocity")
  ) {
    position.x += velocity.x * delta;
    position.y += velocity.y * delta;
  }
};

const renderSystem = (registry: EntityRegistry) => {
  for (const { position } of registry.view<[Position]>("position")) {
    console.log(`Entity at ${position.x}, ${position.y}`);
  }
};

const loop = (registry: EntityRegistry, delta: number) => {
  gravitySystem(registry, delta);
  velocitySystem(registry, delta);
  renderSystem(registry);
};

for (let i = 0; i < 10; i++) {
  loop(registry, 1);
}
```

## Motivation

- Implement **some key methods** of the EntityRegistry object in EnTT (e.g. `create()`, `emplace()`, `view()`, ...)
- Problem-free level **type hinting** by method
- Help to use the ECS structure more smoothly for **typescript game prototyping**.

## Precautions

- Some low-level memory controls, such as Group, are not implementable. So it cannot be expected to benefit from performance.
- Hash table has not been implemented. The identity of the entity is managed by uuid.
- In theory, when creating 3.15e+18 entities, the id of the entity can be duplicated with a 50% probability.

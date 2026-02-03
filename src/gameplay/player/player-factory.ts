import { DefaultPlayerEntity, type Player, type World } from "hytopia";

import type { GameConfig } from "../../core/config";
import { gameEvents } from "../../core/events";
import { TemplatePlayerController } from "./template-player-controller";
import type { PlayerSpawnOptions } from "./types";

/**
 * Creates and spawns a DefaultPlayerEntity controlled by the given player.
 */
export function spawnDefaultPlayer(params: {
  world: World;
  player: Player;
  config: GameConfig;
  spawnOptions: PlayerSpawnOptions;
}): DefaultPlayerEntity {
  const { world, player, config, spawnOptions } = params;

  const playerId = String(player.id);

  // BaseEntityOptions supports providing a controller in the entity options.
  const entity = new DefaultPlayerEntity({
    player,
    name: spawnOptions.name ?? "Player",
    controller: new TemplatePlayerController({
      deps: { config },
      playerId,
    }),
  });

  entity.spawn(world, spawnOptions.spawn);

  gameEvents.emitGame("player.spawned", { playerId });

  return entity;
}

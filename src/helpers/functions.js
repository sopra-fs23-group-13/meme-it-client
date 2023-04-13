export const findGame = (games, game_id) =>
  games?.find(({ id }) => String(id) === String(game_id));

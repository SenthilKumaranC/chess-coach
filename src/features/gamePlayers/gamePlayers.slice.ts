import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"

export interface IGamePlayer {
  playerId: string
  status: string
  gameId: string
  pieceColorType: string
}
export const generateGamePlayerUniqueId = (gamePlayer: IGamePlayer) =>
  `${gamePlayer.gameId}_${gamePlayer.playerId}}`
const entityAdapter = createEntityAdapter<IGamePlayer>({
  selectId: generateGamePlayerUniqueId,
})
const gamePlayersSlice = createSlice({
  name: "gamePlayers",
  initialState: entityAdapter.getInitialState(),
  reducers: {
    addGamePlayers: entityAdapter.addMany,
  },
})

export const { addGamePlayers } = gamePlayersSlice.actions

export default gamePlayersSlice

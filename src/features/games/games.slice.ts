import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface IGame {
  id: string
  fenString: string
  gamePlayerIds: string[]
  positionIds: string[]
}
const entityAdapter = createEntityAdapter<IGame>({})
const gamesSlice = createSlice({
  name: "games",
  initialState: entityAdapter.getInitialState(),
  reducers: {
    addGame: entityAdapter.addOne,
    updateGame: entityAdapter.updateOne,
  },
})

export const { addGame, updateGame } = gamesSlice.actions

export const selectGames = (rootState: RootState) => rootState.games
export const {
  selectAll: selectAllGames,
  selectIds: selectGameIds,
  selectEntities: selectGameEntities,
} = entityAdapter.getSelectors(selectGames)

export const selectGameById = (id: string) =>
  createSelector(selectGameEntities, (entities) => {
    return entities[id] as IGame
  })

export default gamesSlice

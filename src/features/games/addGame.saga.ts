import { put, takeEvery } from "redux-saga/effects"
import {
  IGamePlayer,
  addGamePlayers,
  generateGamePlayerUniqueId,
} from "../gamePlayers/gamePlayers.slice"
import { addGame as newGame } from "./games.slice"

const ADD_GAME = "ADD_GAME"
export const addGameCommand = (
  id: string,
  fenString: string,
  gamePlayers: IGamePlayer[],
) => ({
  type: ADD_GAME,
  payload: { id, gamePlayers, fenString },
})

function* addGameHandler(action: ReturnType<typeof addGameCommand>) {
  const gamePlayerIds = action.payload.gamePlayers.map((gamePlayer) =>
    generateGamePlayerUniqueId(gamePlayer),
  )
  yield put(addGamePlayers(action.payload.gamePlayers))
  yield put(
    newGame({
      id: action.payload.id,
      fenString: action.payload.fenString,
      gamePlayerIds: gamePlayerIds,
      positionIds: [],
    }),
  )
}

function* watchForAddGameHandler() {
  yield takeEvery(ADD_GAME, addGameHandler)
}

export default watchForAddGameHandler

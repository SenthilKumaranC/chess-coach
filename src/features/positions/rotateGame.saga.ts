import { takeEvery } from "redux-saga/effects"

const ROTATE_GAME = "ROTATE_GAME"
export const rotateGame = (id: string) => ({
  type: ROTATE_GAME,
  payload: id,
})
function* rotateGameHandler() {}
function* watchForrotateGame() {
  yield takeEvery(ROTATE_GAME, rotateGameHandler)
}
export default watchForrotateGame

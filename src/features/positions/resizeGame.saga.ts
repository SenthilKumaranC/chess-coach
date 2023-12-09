import { put, select, takeEvery } from "redux-saga/effects"
import {
  IPosition,
  selectByPositionId,
  updatePositions,
} from "./positions.slice"
import { selectGameById } from "../games/games.slice"
import { Update } from "@reduxjs/toolkit"
import { getMxMy } from "./constructGame.saga"

const RESIZE_GAME = "RESIIZE_GAME"
export const resizeGame = (
  gameId: string,
  cellSize: number,
  rotation: number,
) => ({
  type: RESIZE_GAME,
  payload: { gameId, cellSize, rotation },
})
function* resizeGameHandler({
  payload: { gameId, cellSize, rotation },
}: ReturnType<typeof resizeGame>) {
  const { positionIds } = yield select(selectGameById(gameId))
  const updates: Update<IPosition>[] = []
  for (
    let positionIdIndex = 0;
    positionIdIndex < positionIds.length;
    positionIdIndex++
  ) {
    const positionId = positionIds[positionIdIndex]
    const { columnIndex, rowIndex }: IPosition = yield select(
      selectByPositionId(positionId),
    )
    const tV = getMxMy(
      columnIndex * cellSize,
      rowIndex * cellSize,
      rotation,
      cellSize,
    )
    updates.push({
      id: positionId,
      changes: {
        ...tV,
        cellSize,
        rotation,
      },
    })
  }
  yield put(updatePositions(updates))
}
function* watchForResizeGame() {
  yield takeEvery(RESIZE_GAME, resizeGameHandler)
}
export default watchForResizeGame

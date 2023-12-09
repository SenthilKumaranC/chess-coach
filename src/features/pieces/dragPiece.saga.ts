import { put, takeEvery } from "redux-saga/effects"
import {
  generatePositionId,
  updatePosition,
} from "../positions/positions.slice"
const DRAG_PIECE = "DRAG_PIECE"
export const dragPieceCommand = (
  gameId: string,
  rowIndex: number,
  columnIndex: number,
  x: number,
  y: number,
) => ({
  type: DRAG_PIECE,
  payload: {
    gameId,
    rowIndex,
    columnIndex,
    x,
    y,
  },
})

function* dragPieceHandler(action: ReturnType<typeof dragPieceCommand>) {
  const { gameId, rowIndex, columnIndex, x, y } = action.payload
  yield put(
    updatePosition({
      id: generatePositionId({
        gameId,
        rowIndex,
        columnIndex,
      }),
      changes: {
        x,
        y,
      },
    }),
  )
}

function* watchForDragPiece() {
  yield takeEvery(DRAG_PIECE, dragPieceHandler)
}

export default watchForDragPiece

import { put, takeEvery } from "redux-saga/effects"
import { updatePosition } from "../positions/positions.slice"

const HIGHLIGHT_SQUARE = "HIGHLIGHT_SQUARE"
export const highlightSquareAction = (id: string, value: boolean) => ({
  type: HIGHLIGHT_SQUARE,
  payload: { id, value },
})
function* highlightSquareHandler(
  action: ReturnType<typeof highlightSquareAction>,
) {
  yield put(
    updatePosition({
      id: action.payload.id,
      changes: {
        highlightSquare: action.payload.value,
      },
    }),
  )
}
function* watchForHighlightSquare() {
  yield takeEvery(HIGHLIGHT_SQUARE, highlightSquareHandler)
}
export default watchForHighlightSquare

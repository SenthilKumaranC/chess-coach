import { put, select, takeEvery } from "redux-saga/effects"
import {
  IPosition,
  generatePositionId,
  selectByPositionId,
  updatePosition,
  updatePositions,
} from "../positions/positions.slice"
import { NO_PIECE, getMxMy, pieceKind } from "../positions/constructGame.saga"
const MOVE_PIECE = "MOVE_PIECE"
export const movePieceCommand = (
  gameId: string,
  rowIndex: number,
  columnIndex: number,
  newRowIndex: number,
  newColumnIndex: number,
  rotation: number,
) => ({
  type: MOVE_PIECE,
  payload: {
    gameId,
    rowIndex,
    columnIndex,
    newRowIndex,
    newColumnIndex,
    rotation,
  },
})

function withinRange(index: number) {
  return index >= 0 && index < 8
}

function movedInsideBoard(action: ReturnType<typeof movePieceCommand>) {
  const { gameId, rowIndex, columnIndex, newRowIndex, newColumnIndex } =
    action.payload
  return (
    withinRange(rowIndex) &&
    withinRange(columnIndex) &&
    withinRange(newRowIndex) &&
    withinRange(newColumnIndex)
  )
}

function notMovedOnSameColor(position1: IPosition, position2: IPosition) {
  return position1.pieceColorType !== position2.pieceColorType
}

function* isValidRookMove(position1: IPosition, position2: IPosition) {
  if (position1.rowIndex === position2.rowIndex) {
    const startIndex = Math.min(position1.columnIndex, position2.columnIndex)
    const endIndex = Math.max(position1.columnIndex, position2.columnIndex)
    let currentIndex = startIndex
    while (currentIndex <= endIndex) {
      currentIndex = currentIndex + 1
      const currentPosition: IPosition = yield getPosition(
        position1.gameId,
        position1.rowIndex,
        currentIndex,
      )
      if (currentPosition.pieceImagePath) {
        return false
      }
    }
    return true
  }
  if (position1.columnIndex === position2.columnIndex) {
    const startIndex = Math.min(position1.rowIndex, position2.rowIndex)
    const endIndex = Math.max(position1.rowIndex, position2.rowIndex)
    let currentIndex = startIndex
    while (currentIndex <= endIndex) {
      currentIndex = currentIndex + 1
      const currentPosition: IPosition = yield getPosition(
        position1.gameId,
        currentIndex,
        position1.columnIndex,
      )
      if (currentPosition.pieceImagePath) {
        return false
      }
    }
    return true
  }
  return false
}

function IsValidMoveBasedOnPieceKind(
  position1: IPosition,
  position2: IPosition,
) {
  if (position1.pieceKind === pieceKind.R) {
    return isValidRookMove(position1, position2)
  }
  return true
}

function* getPosition(gameId: string, rowIndex: number, columnIndex: number) {
  const partialPosition: Partial<IPosition> = {
    gameId,
    rowIndex: rowIndex,
    columnIndex: columnIndex,
  }
  const positionId = generatePositionId(partialPosition)
  const position: IPosition = yield select(selectByPositionId(positionId))
  return position
}

function* resetPiecePosition(
  action: ReturnType<typeof movePieceCommand>,
  rotation: number,
) {
  const { gameId, rowIndex, columnIndex } = action.payload
  const position: IPosition = yield getPosition(gameId, rowIndex, columnIndex)
  const { x, y } = getMxMy(
    columnIndex * position.cellSize,
    rowIndex * position.cellSize,
    rotation,
    position.cellSize,
  )
  yield put(
    updatePosition({
      id: generatePositionId(position),
      changes: {
        x,
        y,
      },
    }),
  )
}

function* movePieceHandler(action: ReturnType<typeof movePieceCommand>) {
  const {
    gameId,
    rowIndex,
    columnIndex,
    newRowIndex,
    newColumnIndex,
    rotation,
  } = action.payload

  if (movedInsideBoard(action)) {
    const position1: IPosition = yield getPosition(
      gameId,
      rowIndex,
      columnIndex,
    )

    const position2: IPosition = yield getPosition(
      gameId,
      newRowIndex,
      newColumnIndex,
    )

    if (
      position1 !== position2 &&
      notMovedOnSameColor(position1, position2) &&
      IsValidMoveBasedOnPieceKind(position1, position2)
    ) {
      const tV = getMxMy(
        newColumnIndex * position2.cellSize,
        newRowIndex * position2.cellSize,
        rotation,
        position2.cellSize,
      )

      yield put(
        updatePositions([
          {
            id: generatePositionId(position1),
            changes: {
              pieceColorType: NO_PIECE,
              pieceImagePath: null,
              pieceKind: null,
              pieceName: "-",
              x: 0,
              y: 0,
            },
          },
          {
            id: generatePositionId(position2),
            changes: {
              pieceColorType: position1.pieceColorType,
              pieceImagePath: position1.pieceImagePath,
              pieceKind: position1.pieceKind,
              pieceName: position1.pieceName,
              x: tV.x,
              y: tV.y,
            },
          },
        ]),
      )
    } else {
      yield resetPiecePosition(action, rotation)
    }
  } else {
    yield resetPiecePosition(action, rotation)
  }
}

function* watchForMovePiece() {
  yield takeEvery(MOVE_PIECE, movePieceHandler)
}

export default watchForMovePiece

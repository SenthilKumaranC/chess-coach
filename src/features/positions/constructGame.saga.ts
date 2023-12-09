/* eslint-disable prettier/prettier */
import { put, takeEvery } from "redux-saga/effects"
import { IPosition, addPositions, generatePositionId } from "./positions.slice"
import { updateGame } from "../games/games.slice"

export interface IConstructGame {
  id: string
}
const CONSTRUCT_GAME = "CONSTRUCT_GAME"
export const constructGame = (
  id: string,
  fenString: string,
  cellSize: number,
  rotation: number,
) => ({
  type: CONSTRUCT_GAME,
  payload: { id, fenString, cellSize, rotation },
})

export const getMxMy = (x: number, y: number, rotation: number,cellSize:number) => {
  const theta = (rotation * Math.PI) / 180
  const a = cellSize*4
  const b = cellSize*4
  const mx = (x - a) * Math.cos(theta) - (y - b) * Math.sin(theta) + a
  const my = (y - b) * Math.cos(theta) + (x - a) * Math.sin(theta) + b
  return { x: Math.floor(mx), y: Math.floor(my) }
}

const getPushCommand =
  (
    positions: IPosition[],
    cellSize: number,
    gameId: string,
    rotation: number,
  ) =>
  (
    rowIndex: number,
    columnIndex: number,
    pieceKind: string | null,
    pieceColorType: string,
    pieceName: string,
    pieceImagePath: string | null,
  ) => {
    const tV = getMxMy(columnIndex * cellSize, rowIndex * cellSize, rotation,cellSize)
    positions.push({
      gameId,
      columnIndex,
      rowIndex,
      x: tV.x,
      y: tV.y,
      rotation,
      cellSize,
      highlightSquare: false,
      file: String.fromCharCode(columnIndex + 97),
      rank: String(8 - rowIndex),

      squareColor: getSquareColor(rowIndex, columnIndex),
      pieceKind,
      pieceColorType,
      pieceName,
      pieceImagePath,
    })
  }
const LIGHT_SQUARE = "WHITE"
const DARK_SQUARE = "GRAY"
export const LIGHT_PIECE = "LIGHT"
export const DARK_PIECE = "DARK"
export const NO_PIECE = "NONE"

const LIGHT_PIECES = "RNBQKP"

function getSquareColor(rowIndex: number, columnIndex: number) {
  if (rowIndex % 2 === 0) {
    if (columnIndex % 2 === 0) {
      return LIGHT_SQUARE
    } else {
      return DARK_SQUARE
    }
  } else {
    if (columnIndex % 2 === 0) {
      return DARK_SQUARE
    } else {
      return LIGHT_SQUARE
    }
  }
}
export const pieceKind = {
  R: "ROOK",
  B: "BISHOP",
  N: "KNIGHT",
  P: "PAWN",
  K: "KING",
  Q: "QUEEN",
}
function* constructGameHandler(action: ReturnType<typeof constructGame>) {
  const positions: IPosition[] = []
  const gameId = action.payload.id
  const push = getPushCommand(
    positions,
    action.payload.cellSize,
    gameId,
    action.payload.rotation,
  )
  const fenString = action.payload.fenString
  if (fenString) {
    const fenSplit = fenString.split("/")

    const rows = fenSplit.slice(0, 8)
    rows[7] = rows[7].split(" ")[0]
    const playerTurn = fenSplit[9]

    rows.forEach((row, rowIndex) => {
      const entities = row.split("")

      let columnIndex = -1
      entities.forEach((entity) => {
        const entityValue = parseInt(entity)
        if (isNaN(entityValue)) {
          if (LIGHT_PIECES.includes(entity)) {
            columnIndex = columnIndex + 1
            push(
              rowIndex,
              columnIndex,
              (pieceKind as any)[entity.toUpperCase()],
              LIGHT_PIECE,
              entity,
              `_${entity}.png`,
            )
          } else {
            columnIndex = columnIndex + 1
            push(
              rowIndex,
              columnIndex,
              (pieceKind as any)[entity.toUpperCase()],
              DARK_PIECE,
              entity,
              `${entity}.png`,
            )
          }
        } else {
          for (let emptyIndex = 0; emptyIndex < entityValue; emptyIndex++) {
            columnIndex = columnIndex + 1
            push(rowIndex, columnIndex, null, NO_PIECE, "-", null)
          }
        }
      })
    })

    yield put(addPositions(positions))
    const positionIds = positions.map((position) =>
      generatePositionId(position),
    )
    yield put(updateGame({ id: gameId, changes: { positionIds } }))
  } else {
    throw new Error("Please pass fen string")
  }
}
function* watchForConstructGame() {
  yield takeEvery(CONSTRUCT_GAME, constructGameHandler)
}
export default watchForConstructGame

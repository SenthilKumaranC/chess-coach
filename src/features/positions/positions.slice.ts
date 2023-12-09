import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export enum Piece {
  ROOK,
}

export interface IPosition {
  gameId: string
  rowIndex: number
  columnIndex: number
  cellSize: number
  x: number
  y: number
  rotation: number
  rank: string
  file: string
  squareColor: string
  highlightSquare: boolean
  pieceKind: string | null
  pieceColorType: string
  pieceName: string
  pieceImagePath: string | null
}

export const generatePositionId = (position: Partial<IPosition>) =>
  `${position.gameId}_${position.rowIndex}_${position.columnIndex}`

const entityAdapter = createEntityAdapter<IPosition>({
  selectId: generatePositionId,
})
const positionsSlice = createSlice({
  name: "positions",
  initialState: {
    highlightedPositionId: "",
    ...entityAdapter.getInitialState(),
  },
  reducers: {
    setHighlightedPositionId: (state, action) => {
      state.highlightedPositionId = action.payload
    },
    addPosition: entityAdapter.addOne,
    addPositions: entityAdapter.addMany,
    updatePositions: entityAdapter.updateMany,
    updatePosition: entityAdapter.updateOne,
  },
})

export const {
  addPosition,
  addPositions,
  updatePositions,
  updatePosition,
  setHighlightedPositionId,
} = positionsSlice.actions
export const selectPositions = (rootState: RootState) => rootState.positions
export const {
  selectAll: selectAllPositions,
  selectIds: selectPositionIds,
  selectEntities: selectPositionEntities,
} = entityAdapter.getSelectors(selectPositions)

export const selectHighlightedPositionId = createSelector(
  selectPositions,
  (positions) => positions.highlightedPositionId,
)
export const selectByPositionId = (id: string) =>
  createSelector(selectPositionEntities, (entities) => {
    return entities[id] as IPosition
  })

export default positionsSlice

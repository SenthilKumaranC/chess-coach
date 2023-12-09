import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"

export interface IPiece {
  id: string
  positionId: string
}
const entityAdapter = createEntityAdapter<IPiece>({})
const piecesSlice = createSlice({
  name: "pieces",
  initialState: entityAdapter.getInitialState(),
  reducers: {},
})

export default piecesSlice

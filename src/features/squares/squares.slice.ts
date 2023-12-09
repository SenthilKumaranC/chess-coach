import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"

export interface ISquare {
  id: string
  positionId: string
}
const entityAdapter = createEntityAdapter<ISquare>({})
const squaresSlice = createSlice({
  name: "squares",
  initialState: entityAdapter.getInitialState(),
  reducers: {},
})

export default squaresSlice

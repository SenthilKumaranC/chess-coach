import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface IMainPlayer {
  playerId: string
}

const mainPlayerSlice = createSlice({
  name: "mainPLayer",
  initialState: {
    playerId: "AAA",
  },
  reducers: {},
})

export const selectMainPlayer = (rootState: RootState) => rootState.mainPlayer

export default mainPlayerSlice

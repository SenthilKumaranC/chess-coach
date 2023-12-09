import {
  configureStore,
  ThunkAction,
  Action,
  MiddlewareArray,
  Middleware,
} from "@reduxjs/toolkit"
import positionsSlice from "../features/positions/positions.slice"
import squaresSlice from "../features/squares/squares.slice"
import piecesSlice from "../features/pieces/pieces.slice"
import createSagaMiddlware from "redux-saga"
import watchForConstructGame from "../features/positions/constructGame.saga"
import gamesSlice from "../features/games/games.slice"
import gamePlayersSlice from "../features/gamePlayers/gamePlayers.slice"
import watchForAddGameHandler from "../features/games/addGame.saga"
import mainPlayerSlice from "../features/mainPlayer/mainPlayer.slice"
import watchForMovePiece from "../features/pieces/movePiece.saga"
import watchForDragPiece from "../features/pieces/dragPiece.saga"
import watchForHighlightSquare from "../features/squares/highlight.saga"
import watchForResizeGame from "../features/positions/resizeGame.saga"

const sagaMiddleware = createSagaMiddlware()

const senderMiddleware: any =
  (store: ReturnType<typeof configureStore>) =>
  (next: any) =>
  (action: any) => {
    ;(window as any).scs?.forEach((sc: any) => {
      if (action?.sendToChild) {
        sc?.send(JSON.stringify(action))
      }
    })
    next(action)
  }

export const store = configureStore({
  middleware: (gM) => [...gM(), sagaMiddleware, senderMiddleware],
  reducer: {
    games: gamesSlice.reducer,
    positions: positionsSlice.reducer,
    squares: squaresSlice.reducer,
    pieces: piecesSlice.reducer,
    gamePlayers: gamePlayersSlice.reducer,
    mainPlayer: mainPlayerSlice.reducer,
  },
})

sagaMiddleware.run(watchForConstructGame)
sagaMiddleware.run(watchForAddGameHandler)
sagaMiddleware.run(watchForMovePiece)
sagaMiddleware.run(watchForDragPiece)
sagaMiddleware.run(watchForHighlightSquare)
sagaMiddleware.run(watchForResizeGame)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

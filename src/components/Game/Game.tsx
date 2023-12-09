import { createContext, useCallback, useEffect, useRef, useState } from "react"
import "./Game.css"

//imges
import { useDispatch } from "react-redux"
import { IGame } from "../../features/games/games.slice"
import { constructGame } from "../../features/positions/constructGame.saga"
import SquareLayer from "../SquareLayer/SquareLayer"
import PieceLayer from "../PieceLayer/PieceLayer"
import { resizeGame } from "../../features/positions/resizeGame.saga"

export const GameContext = createContext({
  cellSize: 0,
  rotation: 12,
})

const Game = (props: IGame) => {
  const [gameSize, setGameSize] = useState({ cellSize: 0 })
  const [rotation, setRotation] = useState<number>(0)
  const dispatch = useDispatch()
  useEffect(() => {
    if (gameSize.cellSize > 0) {
      dispatch(
        constructGame(props.id, props.fenString, gameSize.cellSize, rotation),
      )
    }
  }, [dispatch, gameSize.cellSize, props.fenString, props.id, rotation])

  const gameRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const resizeFunc = () => {
      if (!gameRef.current) return
      setGameSize({ cellSize: gameRef.current.clientWidth / 8 })
    }
    window.addEventListener("resize", resizeFunc)
    return () => {
      window.removeEventListener("resize", resizeFunc)
    }
  }, [])

  const onGameCreated = useCallback((ref: HTMLDivElement) => {
    if (ref) {
      gameRef.current = ref
      const bounds = gameRef.current.getBoundingClientRect()
      setGameSize({ cellSize: bounds.width / 8 })
    }
  }, [])

  const renderBoard = useCallback(() => {
    if (gameRef.current) {
      const bounds = gameRef.current.getBoundingClientRect()
      const cellSize = bounds.width / 8
      setGameSize({ cellSize })
      console.log(cellSize)
      dispatch(resizeGame(props.id, cellSize, rotation))
    }
  }, [dispatch, props.id, rotation])

  useEffect(() => {
    renderBoard()
  }, [renderBoard])

  useEffect(() => {
    window.addEventListener("resize", renderBoard)
    return () => window.removeEventListener("resize", renderBoard)
  }, [dispatch, props.id, renderBoard, rotation])

  return (
    <>
      <GameContext.Provider value={{ ...gameSize, rotation: rotation }}>
        <div className="Game aspect-square origin-center" ref={onGameCreated}>
          {/* <UnrotatedSquareLayer id={props.id}></UnrotatedSquareLayer> */}
          <SquareLayer id={props.id}></SquareLayer>
          <PieceLayer id={props.id}></PieceLayer>
        </div>
      </GameContext.Provider>
    </>
  )
}

export default Game

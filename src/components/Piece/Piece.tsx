// export interface IPiece {
//     kind: string
//     rowIndex: string
//     columnIndex: string
// }

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { GameContext } from "../Game/Game"
import {
  generatePositionId,
  selectByPositionId,
  selectHighlightedPositionId,
  setHighlightedPositionId,
} from "../../features/positions/positions.slice"
import { movePieceCommand } from "../../features/pieces/movePiece.saga"
import { useChildDispatch } from "../../app/hooks"
import { dragPieceCommand } from "../../features/pieces/dragPiece.saga"
import { useSelector } from "react-redux"
import { getMxMy } from "../../features/positions/constructGame.saga"
import { highlightSquareAction } from "../../features/squares/highlight.saga"

const Piece = ({ id }: any) => {
  const [dragMode, setDragMode] = useState<boolean>(false)
  const { pieceImagePath, columnIndex, rowIndex, gameId, x, y } = useSelector(
    selectByPositionId(id),
  )
  const { cellSize, rotation } = useContext(GameContext)
  const pieceRef = useRef<HTMLDivElement | null>(null)
  const bound = useRef<any>()
  const offset = useRef<any>()
  const dispatchToChild = useChildDispatch()

  const [zIndex, setZIndex] = useState<number>(0)

  const dragPiece = useCallback(
    (x: number, y: number) => {
      dispatchToChild(dragPieceCommand(gameId, rowIndex, columnIndex, x, y))
    },
    [dispatchToChild, gameId, columnIndex, rowIndex],
  )

  const highlightedId = useSelector(selectHighlightedPositionId)

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      var rect = pieceRef.current?.parentElement?.getBoundingClientRect()
      if (rect) {
        dragPiece(event.clientX - rect.left, event.clientY - rect.top)

        const { x, y } = getMxMy(
          event.clientX - rect.left,
          event.clientY - rect.top,
          -rotation,
          cellSize,
        )

        const columnIndex = Math.round(x / cellSize)
        const rowIndex = Math.round(y / cellSize)

        const positionId = generatePositionId({
          gameId,
          columnIndex,
          rowIndex,
        })

        if (!!highlightedId && highlightedId !== positionId) {
          dispatchToChild(highlightSquareAction(highlightedId, false))
        }

        if (highlightedId !== positionId) {
          dispatchToChild(setHighlightedPositionId(positionId))

          dispatchToChild(highlightSquareAction(positionId, true))
        }
      }
    },
    [cellSize, dispatchToChild, dragPiece, gameId, highlightedId, rotation],
  )

  const onMouseUp = useCallback(
    (event: MouseEvent) => {
      setDragMode(false)
      setZIndex(() => 0)
      var rect = pieceRef.current?.parentElement?.getBoundingClientRect()
      if (!rect) return

      const { x, y } = getMxMy(
        event.clientX - rect.left,
        event.clientY - rect.top,
        -rotation,
        cellSize,
      )

      const transformedColumnIndex = Math.round(x / cellSize)
      const transformedRowIndex = Math.round(y / cellSize)

      if (highlightedId) {
        dispatchToChild(highlightSquareAction(highlightedId, false))
      }

      dispatchToChild(
        movePieceCommand(
          gameId,
          rowIndex,
          columnIndex,
          transformedRowIndex,
          transformedColumnIndex,
          rotation,
        ),
      )
    },
    [
      rotation,
      cellSize,
      highlightedId,
      dispatchToChild,
      gameId,
      rowIndex,
      columnIndex,
    ],
  )

  const onMouseDown = useCallback(
    (event: any) => {
      setDragMode(true)
      bound.current = pieceRef.current?.getBoundingClientRect()
      const parent = pieceRef.current?.parentElement
      var rect = parent?.getBoundingClientRect()

      if (rect) {
        const parentX = rect.left
        const parentY = rect.top
        const childX = event.nativeEvent.clientX
        const childY = event.nativeEvent.clientY

        console.log(childX, childY, parentX, parentY)

        const cx = Math.floor((childX - parentX) / cellSize) * cellSize
        const cy = Math.floor((childY - parentY) / cellSize) * cellSize
        offset.current = {
          x: childX - parentX - cx,
          y: childY - parentY - cy,
        }
        setZIndex(() => 64)
        if (rect) {
          dragPiece(childX - parentX, childY - parentY)
        }
      }
    },

    [cellSize, dragPiece],
  )

  useEffect(() => {
    if (dragMode) {
      window.addEventListener("pointermove", onMouseMove)
      window.addEventListener("pointerup", onMouseUp)
    }
    return () => {
      window.removeEventListener("pointermove", onMouseMove)
      window.removeEventListener("pointerup", onMouseUp)
    }
  }, [dragMode, onMouseMove, onMouseUp])

  const transform = useMemo(() => {
    return `translate(${x}px,${y}px)`
  }, [x, y])

  return (
    <>
      {pieceImagePath && (
        <div
          data-gameid={gameId}
          ref={pieceRef}
          draggable={false}
          style={{
            zIndex: zIndex,
            transform,
            width: `0px`,
            height: `0px`,
            textAlign: "end",
          }}
          className="absolute  top-0 left-0 bg-no-repeat bg-cover "
        >
          <div
            onPointerDown={onMouseDown}
            draggable={false}
            style={{
              backgroundImage: `url(./assets/${pieceImagePath})`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              transform: `translate(-50% , -50%) scale(1) rotate(${rotation}deg)`,
            }}
            className="w-full h-full bg-cover"
          ></div>
        </div>
      )}
    </>
  )
}

export default Piece

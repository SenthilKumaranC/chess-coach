import { useContext } from "react"
import { selectByPositionId } from "../../features/positions/positions.slice"
import { GameContext } from "../Game/Game"
import { useSelector } from "react-redux"

const Square = ({ id }: any) => {
  const { cellSize } = useContext(GameContext)
  const {
    squareColor,
    columnIndex,
    rowIndex,
    gameId,
    file,
    rank,
    highlightSquare,
  } = useSelector(selectByPositionId(id))
  return (
    <>
      <div
        data-gameid={gameId}
        style={{
          opacity: 0.3,
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          transform: `translate(${columnIndex * cellSize}px,${
            rowIndex * cellSize
          }px)`,
        }}
        className="absolute top-0 left-0 w-full h-full"
      >
        <div
          className="w-full h-full"
          style={{
            transform: `translate(-50% , -50%)`,
            backgroundColor: `${
              highlightSquare ? "green" : squareColor.toLowerCase()
            }`,
          }}
        ></div>
      </div>

      {columnIndex === 0 && (
        <div
          className=" select-none text-sm text-black absolute top-0 left-0 font-semibold text-[15px] leading-[15px]"
          style={{
            transform: `translate(${columnIndex * cellSize}px,${
              rowIndex * cellSize
            }px)`,
          }}
        >
          {rank}
        </div>
      )}
      {rowIndex === 7 && (
        <div
          className=" select-none text-sm text-black absolute top-0 left-0 font-semibold  text-[15px] leading-[15px]"
          style={{
            transform: `translate(${
              columnIndex * cellSize + cellSize - cellSize * 0.15
            }px,${rowIndex * cellSize + cellSize - cellSize * 0.25}px)`,
          }}
        >
          {file}
        </div>
      )}
    </>
  )
}

export default Square

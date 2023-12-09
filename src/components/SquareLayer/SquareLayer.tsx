import { useContext, useMemo } from "react"
import { useSelector } from "react-redux"
import { selectGameById } from "../../features/games/games.slice"
import Square from "../Square/Square"
import { GameContext } from "../Game/Game"

const SquareLayer = ({ id }: any) => {
  const { positionIds } = useSelector(selectGameById(id))

  const { rotation } = useContext(GameContext)

  const squaresUI = useMemo(() => {
    return positionIds.map((positionId) => {
      return <Square key={positionId} id={positionId}></Square>
    })
  }, [positionIds])

  return (
    <div
      className={`w-full h-full absolute top-0 left-0 origin-center`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {squaresUI}
    </div>
  )
}

export default SquareLayer

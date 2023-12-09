import { useMemo } from "react"
import { useSelector } from "react-redux"
import { selectGameById } from "../../features/games/games.slice"
import Piece from "../Piece/Piece"

const PieceLayer = ({ id }: any) => {
  const { positionIds } = useSelector(selectGameById(id))

  const piecesUI = useMemo(() => {
    return positionIds.map((positionId) => {
      return <Piece key={positionId} id={positionId}></Piece>
    })
  }, [positionIds])

  return <>{piecesUI}</>
}

export default PieceLayer

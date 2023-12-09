import { useDispatch, useSelector } from "react-redux"
import "./App.css"
import Game from "./components/Game/Game"
import { selectAllGames } from "./features/games/games.slice"
import { useCallback, useEffect, useRef, useState } from "react"
import { addGameCommand } from "./features/games/addGame.saga"
import {
  DARK_PIECE,
  LIGHT_PIECE,
} from "./features/positions/constructGame.saga"
import { useSearchParams } from "react-router-dom"
import { useChildDispatch } from "./app/hooks"

declare var Peer: new (id: string) => any
;(window as any).scs = []

const scs = (window as any).scs

function App() {
  const [searchParams] = useSearchParams()
  const peer = useRef<any>()
  const games = useSelector(selectAllGames)
  const dispatch = useDispatch()
  const dispatchToChild = useChildDispatch()

  const role: string = searchParams.get("role") as string

  useEffect(() => {
    const role = searchParams.get("role")
    if (role === "master") {
      const masterId = searchParams.get("masterid")
      if (masterId) peer.current = new Peer(masterId)
      peer.current.on("open", function () {
        console.log("master ready")
        peer.current.on("connection", function (conn: any) {
          var studentConn = peer.current.connect(conn.peer)
          // on open will be launch when you successfully connect to PeerServer
          studentConn?.on("open", function () {
            // here you have conn.id
            scs.push(conn)
            //conn.send(JSON.stringify({ type: "ADD_GAME" }))
          })
          conn.on("data", function (data: any) {
            console.log("getting data from student", data)
          })
        })
      })
    } else {
      if (role === "student") {
        const studentId = searchParams.get("studentid")
        const masterId = searchParams.get("masterid")
        if (studentId) peer.current = new Peer(studentId)
        peer.current.on("open", function () {
          var conn = peer.current.connect(masterId)
          // on open will be launch when you successfully connect to PeerServer
          conn.on("open", function () {
            // here you have conn.id
            console.log("connected with master")
            conn.send("sending message from student")
          })
          conn.on("data", function (data: any) {
            // Will print 'hi!'
            console.log("getting data from master", data)
            dispatch(JSON.parse(data))
          })
        })
      }
    }
  }, [dispatch, searchParams])

  const addGameHandler = useCallback(() => {
    const role = searchParams.get("role")
    if (role === "master") {
      dispatchToChild(
        addGameCommand(
          "game_1",
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          [
            {
              playerId: "AAA",
              status: "ACTIVE",
              gameId: "game_1",
              pieceColorType: LIGHT_PIECE,
            },
            {
              playerId: "BBB",
              status: "ACTIVE",
              gameId: "game_1",
              pieceColorType: DARK_PIECE,
            },
          ],
        ),
      )
      /*  dispatchToChild(
        addGameCommand(
          "game_2",
          "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
          [
            {
              playerId: "AAA",
              status: "ACTIVE",
              gameId: "game_2",
              pieceColorType: LIGHT_PIECE,
            },
            {
              playerId: "BBB",
              status: "ACTIVE",
              gameId: "game_2",
              pieceColorType: DARK_PIECE,
            },
          ],
        ),
      ) */
    }
  }, [dispatchToChild, searchParams])
  return (
    <div className="App">
      {role === "master" && <button onClick={addGameHandler}>Add Game</button>}
      <div className="w-full h-full flex items-center justify-center">
        {games.map((game) => {
          return <Game key={game.id} {...game}></Game>
        })}
      </div>
    </div>
  )
}

export default App

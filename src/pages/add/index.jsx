import { useContext, useState } from "react"
import { AuthContext } from "../../services/firebaseContext"
import { database } from "../../services/firebase"
import { ref, push, update, get } from "firebase/database"
import { FaEdit, FaUserPlus, FaAngleLeft, FaPlus } from 'react-icons/fa'
import { useNavigate } from "react-router-dom"

function Add() {

    const { user } = useContext(AuthContext)

    const navigateTo = useNavigate()

    const [view, setView] = useState('Default')

    const [roomName, setRoomName] = useState("")
    const [roomCode, setRoomCode] = useState("")

    function handleChangeView(viewToSet) {
        setView(viewToSet)
    }

    function handleCreateRoom() {
        if (roomName.trim() === "") {
            return
        }

        const firebaseRoom = push(ref(database, 'Rooms'), {
            members: {
                [user.uid]: {
                    joinDate: new Date().getTime()
                }
            },
            name: roomName
        })

        update(ref(database, `Users/${user.uid}/rooms`), {
            [firebaseRoom.key]: {
                name: roomName
            }
        })



        setRoomName('')
        navigateTo('/room/' + firebaseRoom.key)
    }

    function handleJoinRoom() {
        
        if (roomCode.trim() === "") {
            return
        }

        get(ref(database, `Rooms/${roomCode}`)).then((res) => {
            if (res.val() === null) {
                return alert('Nao existe')
            }

            const roomJoinName = res.val().name

            get(ref(database, `Users/${user.uid}/rooms/${roomCode}`)).then((res) => {
                if (res.val() != null) {
                    return alert('ja esta')
                }

                //colocar na sala que existe um novo usuario

                update(ref(database, `Users/${user.uid}/rooms/${roomCode}`), {
                    name: roomJoinName
                })
                update(ref(database, `Rooms/${roomCode}/members/${user.uid}`), {
                    joinDate: new Date().getTime()
                })



            })

        })

        setRoomCode("")
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            {view === 'Default' && (
                <>
                    <h1>Join or create your room</h1>
                    <div className='flex my-5'>
                        <button onClick={() => { handleChangeView('Create') }} className="h-10 mx-4 px-4 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <FaEdit className='mx-1 w-[17px] h-[17px]' />Create
                        </button>

                        <button onClick={() => { handleChangeView('Join') }} className="h-10 mx-4 px-4 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <FaUserPlus className='mx-1 w-[17px] h-[17px]' />Join
                        </button>
                    </div>
                </>
            )}

            {view === 'Join' && (
                <>

                    <div className="text-center">
                        <h1>Join</h1>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleJoinRoom()
                            }}>
                            <input
                                type="text"
                                placeholder="Type the room code here"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => { 
                                    const realCode = e.target.value.trim() 
                                    setRoomCode(realCode)
                                }}
                                value={roomCode}
                            />
                        </form>
                    </div>

                    <div className="flex my-5">
                        <button onClick={() => { handleChangeView('Default') }} className="h-10 mx-4 px-4 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <FaAngleLeft className='mx-1 w-[17px] h-[17px]' />Back
                        </button>
                        <button onClick={() => { handleJoinRoom() }} className="h-10 mx-4 px-4 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <FaUserPlus className='mx-1 w-[17px] h-[17px]' />Join
                        </button>
                    </div>
                </>
            )}

            {view === 'Create' && (
                <>

                    <div className="text-center">
                        <h1>Create</h1>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleCreateRoom()
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Room Name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => { setRoomName(e.target.value) }}
                                value={roomName}
                            />
                        </form>
                    </div>

                    <div className="flex my-5">
                        <button onClick={() => { handleChangeView('Default') }} className="h-10 mx-4 px-4 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <FaAngleLeft className='mx-1 w-[17px] h-[17px]' />Back
                        </button>
                        <button onClick={() => { handleCreateRoom() }} className="h-10 mx-4 px-4 flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <FaPlus className='mx-1 w-[17px] h-[17px]' />Create
                        </button>
                    </div>
                </>
            )}

        </div>
    )
}

export default Add
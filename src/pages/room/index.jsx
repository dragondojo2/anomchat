import { useContext, useEffect, useRef, useState } from "react"
import { FaRegClipboard, FaRegPaperPlane, FaSignOutAlt, FaUsers } from "react-icons/fa"
import { useParams, useNavigate } from "react-router-dom"
import { database } from "../../services/firebase"
import { get, onValue, push, ref, remove } from "firebase/database"
import { AuthContext } from "../../services/firebaseContext"

function Room() {
    const { user } = useContext(AuthContext)
    const navigateTo = useNavigate()
    const [message, setMessage] = useState({})
    const [messageText, setMessageText] = useState('')
    const [roomData, setRoomData] = useState([])
    let { pageId } = useParams()
    //console.log(pageId)
    //console.log(date)
    const defaultClassMsg = "flex flex-col bg-red-400 w-fit max-w-[80%] h-fit my-5 px-4 py-1/2 rounded-lg"
    function handleSendMessage() {
        //criar um novo objeto na ref roomMessages com o nome do id atual
        //cada mensagem vai ser um push na ref 
        //

        if (messageText.trim() === '') {
            return;
        }

        const date = new Date().getTime()

        push(ref(database, `roomMessages/${pageId}`), {
            message: messageText,
            sentBy: { uid: user.uid, name: user.displayName },
            date: date
        })
        setMessageText('')

    }

    function loadRoomData(pageIdParam) {
        return (get(ref(database, `Rooms/${pageIdParam}`)).then((res) => {
            const name = res.val().name
            const membersCount = res.val().members == null ? null : Object.keys(res.val().members).length
            setRoomData([
                name, membersCount
            ])
        }))
    }

    function leaveRoom() {
        if (confirm("You sure you wanna leave?")) {
            remove(ref(database, `Users/${user.uid}/rooms/${pageId}`))
            remove(ref(database, `Rooms/${pageId}/members/${user.uid}`))

            navigateTo('/add')

            if (roomData[1] == 1) {
                console.log('sala vazia')
                remove(ref(database, `Rooms/${pageId}`))
                remove(ref(database, `roomMessages/${pageId}`))
                navigateTo('/add')

            }

        } else {
            return
        }
    }

    function getDate(timestamp) {
        const today = new Date()
        const sendDay = new Date(timestamp)
        const day = sendDay.getDate() <= 9 ? `0${sendDay.getDate()}` : sendDay.getDate()
        const month = sendDay.getMonth() <= 9 ? `0${sendDay.getMonth()}` : sendDay.getMonth()
        const hours = sendDay.getHours() <= 9 ? `0${sendDay.getHours()}` : sendDay.getHours()
        const minutes = sendDay.getMinutes() <= 9 ? `0${sendDay.getMinutes()}` : sendDay.getMinutes()

        if (today.getDate() != day) {
            return `${day}/${month} ${hours}:${minutes}`
        }

        return `${hours}:${minutes}`

    }

    useEffect(() => {
        if(user) {
            get(ref(database, `Users/${user.uid}/rooms/${pageId}`)).then((res)=>{
                if(res.val() == null){
                    navigateTo('/add')
                }

    
                loadRoomData(pageId).then(() => {
                    const dbref = ref(database, `roomMessages/${pageId}`)
                    onValue(dbref, (res) => {
                        setMessage(res.val())
                    })
        
                    onValue(ref(database, `Rooms/${pageId}`), (res) => {
                        const name = res.val().name
                        const membersCount = res.val().members == null ? null : Object.keys(res.val().members).length
                        setRoomData([
                            name, membersCount
                        ])
                    })
                })
            })
        }
        
        

    }, [pageId])

    return (
        <div className="w-full h-screen flex flex-col justify-between	">
            <div className="text-center text-xl py-3 px-2 bg-gray-800 flex justify-between">
                <div className="flex justify-center items-center">
                    <FaUsers className="mr-2" />
                    {roomData[1]}
                </div>
                <div>
                    {roomData[0]}
                </div>
                <div >
                    <button
                        className="flex justify-center items-center"
                        onClick={() => navigator.clipboard.writeText(pageId)}
                        title="Copy room code!">
                        <FaRegClipboard />
                        Code
                    </button>
                </div>
            </div>
            <div className="h-full overflow-y-auto">
                {message &&
                    //cada letra que eu aperto executa o comando abaixo
                    Object.entries(message).map((value, index) => {
                        return (
                            <div key={index} className={user.uid === value[1].sentBy.uid ? `${defaultClassMsg} ml-auto` : `${defaultClassMsg} items-start mr-auto`}>
                                <div className="text-sm" title={value[1].sentBy.uid}>
                                    {user.uid != value[1].sentBy.uid ? value[1].sentBy.name : ''}
                                </div>
                                <div className="mx-auto">
                                    {value[1].message}
                                </div>
                                <div className="text-xs ml-auto">
                                    {getDate(value[1].date)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="bg-gray-800 h-12">
                <form
                    className="flex h-full"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                    }}
                >
                    <div className="w-[5%] flex justify-center">
                        <button type="button" onClick={() => { leaveRoom() }}>
                            <FaSignOutAlt className="w-7 h-7" />
                        </button>
                    </div>
                    <input
                        className="w-[90%] rounded-md"
                        type="text"
                        placeholder="Type your mensage"
                        onChange={e => setMessageText(e.target.value)}
                        value={messageText}
                    />
                    <div className="w-[5%] flex justify-center">
                        <button
                            type="submit"
                        >
                            <FaRegPaperPlane className="w-7 h-7" />
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Room
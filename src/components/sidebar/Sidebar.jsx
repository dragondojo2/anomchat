import { FaUser, FaPlus } from "react-icons/fa";
import { Link } from 'react-router-dom'
import { AuthContext } from "../../services/firebaseContext"
import { database } from "../../services/firebase"
import { ref, get, onValue } from "firebase/database"
import { useContext, useState } from "react";
import { useEffect } from "react";

function Sidebar() {
    const { user } = useContext(AuthContext)
    const [roomItems, setRoomItems] = useState({})

    useEffect(() => {

        if (user) {
            const dbref = ref(database, `Users/${user.uid}/rooms`)

            onValue(dbref, (res) => {
                setRoomItems(res.val())
            })

        }
    }, [user])

    let sidebarIems = [
        {
            display: 'Me',
            icon: <FaUser />,
            link: "/account"
        },
        {
            display: 'Add room',
            icon: <FaPlus />,
            link: '/add'
        }
    ]

    return (
        <div className="h-screen w-1/6 flex flex-col justify-between items-center mx-6 py-8">
            <div className="header">
                {
                    sidebarIems.map((item, index) => (
                        <Link to={item.link} className="flex flex-row justify-center" key={index}>
                            <div className="flex justify-center items-center">
                                {item.icon}
                            </div>
                            <div>
                                {item.display}
                            </div>
                        </Link>
                    ))
                }
            </div>
            <div className="rooms flex flex-col text-center w-full">
                Your rooms:
                {roomItems &&

                    Object.keys(roomItems)
                        .map((key) => (
                            <Link to={`/room/${key}`} className="truncate" key={key}>{roomItems[key].name}</Link>
                        ))

                }
            </div>
            <div className="footer">
                Light | Dark
            </div>
        </div>
    )
}

export default Sidebar
import { useContext } from "react"
import { AuthContext } from "../../services/firebaseContext"
import { FaUserCircle } from "react-icons/fa"

function Account() {
    const { user } = useContext(AuthContext)

    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="flex flex-row">
                <FaUserCircle className="w-24 h-24 m-5" />
                <div className="flex flex-col">
                    <p className="text-2xl">Your nick:</p>
                    <input disabled type="text" className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={user ? user.displayName : "Nickname"} required></input>
                    <p className="text-xs mb-1">(You can edit your nick but not your id)</p>
                    <p className="text-xs">Your id: {user ? user.uid : "No id"}</p>
                </div>
            </div>
        </div>
    )
}

export default Account
import { AuthContext } from "../../services/firebaseContext"
import { Outlet } from "react-router-dom"
import Sidebar from "../sidebar/Sidebar"
import './styles.css'
import { useContext } from "react"

function Layout() {
  const {user, createNewUser} = useContext(AuthContext)

  return (
    <div className="flex">
      <Sidebar />

      <div className="w-5/6">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
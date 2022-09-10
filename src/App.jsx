import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./services/firebaseContext";
import Add from "./pages/add"
import Account from "./pages/account"
import Room from "./pages/room";

import './App.css'
import Layout from "./components/layout";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path='add' element={<Add />} />
            <Route path='account' element={<Account />} />
            <Route path="room/:pageId" element={<Room />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App

import React, { useEffect, useState } from "react";

import { auth, database } from "./firebase";
import { ref, set, child, get } from "firebase/database"

import {
  signInAnonymously,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

import { generateUsername } from "unique-username-generator";

export const AuthContext = React.createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const randomUsername = generateUsername()

  function createNewUser() {

    signInAnonymously(auth).then((res) => {
      const resUser = res.user

      get(ref(database, `Users/${resUser.uid}`)).then((res) => {
        const usersDB = res.val()
        //console.log(usersDB);

        if (usersDB === null) {
          updateProfile(resUser, { displayName: randomUsername })

          const usersRef = ref(database, "Users")
          const userChild = child(usersRef, resUser.uid)
          set(userChild, {
            rooms: {
            },
            userName: randomUsername
          })
        }

        /* for (const [key, val] of Object.entries(usersDB)) {
          if (key == resUser.uid) {
            console.log('ja existe');
            return
          }
          console.log('nao existe');

          updateProfile(resUser, { displayName: randomUsername })

          const usersRef = ref(database, "Users")
          const userChild = child(usersRef, resUser.uid)
          set(userChild, {
            rooms: {
              0: ""
            }
          })

        } */

      }).catch((err) => {
        console.log(err);
      })


    })


  }

  useEffect(() => {
    onAuthStateChanged(auth, setUser)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      createNewUser
    }}>
      {children}
    </AuthContext.Provider>
  )
};

/* 
const auth = getAuth();

const user = auth.currentUser;

function createNewUser() {
  signInAnonymously(auth);
}

function loadUser() {
  console.log(user);
}

function changeDisplayName(userToChange, newDisplayName) {
  updateProfile(userToChange, { displayName: newDisplayName });
}

export { createNewUser, user, changeDisplayName, loadUser }; 

*/
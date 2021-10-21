import React, { createContext, useState, useEffect } from "react";

import * as Google from "expo-google-app-auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "../database/firebaseConnection";

interface User {
  userName: string;
  uid: string;
  tag: string;
  avatar?: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  isAnonymous: boolean;

  login(firebaseUser: any): void;
  loginAnonymously(): void;
  signOut(): void;
  signInWithGoogleAsync(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [finishedLogin, setFinishedLogin] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  async function handleStateChanged(firebaseUser: any) {
    //Verifica se o usuário é anônimo, de forma a escapar da requisição
    if (isAnonymous) {
      return setSigned(true);
    }
  }

  useEffect(() => {
    // Observer: verifica quando o usuário sofre alterações (loga ou desloga)
    firebase.auth().onAuthStateChanged(handleStateChanged);

    // Implementar: salvar o usuário logado no dispositivo
  }, []);

  async function login(firebaseUser: any) {
    // setUser({ ...props });
    // console.log(user);

    if (firebaseUser.isAnonymous || isAnonymous) {
      return setSigned(true);
    }

    //Ajusta as condições de estado do usuário
    setFinishedLogin(true);
    setIsAnonymous(false);

    await firebase
      .firestore()
      .collection("users")
      .doc(firebaseUser.uid)
      .get()
      .then((doc) => {
        const userName = doc.data().userName;
        const tag = doc.data().tag;
        const avatar = doc.data().userImage;
        const uid = firebaseUser.uid;

        setUser({ userName, uid, tag, avatar });

        // Se você vir essa mensagem no console, quer dizer que tudo deu certo
        console.log("Fé na sogrinha login");

        // Navega para o StackRoutes
        setSigned(true);
      });

    // // Execução da handleStateChanged de maneira forçada
    // const auth = firebase.auth().currentUser;
    // handleStateChanged(auth);
  }

  async function loginAnonymously() {
    // Ajusta primeiro as condições de estado do usuário, pois a função handleStateChanged só é chamada depois da requisição no firebase
    setIsAnonymous(true);
    setFinishedLogin(false);

    await firebase
      .auth()
      .signInAnonymously()
      .then((cred) => {
        login(cred.user);
      })
      .catch((error) => {
        if (error.code === "auth/operation-not-allowed") {
          console.log("Enable anonymous login in your firebase console");
        } else {
          console.log(error.code);
        }
      });
  }

  async function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
    //Ajusta as condições de estado do usuário
    setIsAnonymous(false);
    setFinishedLogin(false);
    setSigned(false);

    await firebase.auth().signOut();
  }

  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "402831587288-o8sm81qel545r1oinhs21gvmgq5489fh.apps.googleusercontent.com",
        iosClientId:
          "402831587288-537l0p9v2r574up5tm49937c4bkqarru.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed,
        user,
        loading,
        isAnonymous,
        login,
        loginAnonymously,
        signOut,
        signInWithGoogleAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBd8Dnn7p-sLLpz-lqA05GJydCuX9hnIlY",
  authDomain: "tenedores-f0aae.firebaseapp.com",
  databaseURL: "https://tenedores-f0aae.firebaseio.com",
  projectId: "tenedores-f0aae",
  storageBucket: "tenedores-f0aae.appspot.com",
  messagingSenderId: "1064074016463",
  appId: "1:1064074016463:web:934f1c1f1a15a6ece269ba",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

import firebase, { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAxzQCfFkM51mnnUws9drzylDYFFrt8xjg",
  authDomain: "tenedores-60c34.firebaseapp.com",
  databaseURL: "https://tenedores-60c34.firebaseio.com",
  projectId: "tenedores-60c34",
  storageBucket: "tenedores-60c34.appspot.com",
  messagingSenderId: "212561312613",
  appId: "1:212561312613:web:ea7358fe5a71db38807f8c",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

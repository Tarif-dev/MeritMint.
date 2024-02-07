import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCcIH8ykH1ELx7GGIhlIAyGw5cAYsKWv38",
  authDomain: "diversion2k24-5e36d.firebaseapp.com",
  projectId: "diversion2k24-5e36d",
  storageBucket: "diversion2k24-5e36d.appspot.com",
  messagingSenderId: "873015031613",
  appId: "1:873015031613:web:1460df197dc095265df754",
  measurementId: "G-EXMFK6L1Q9",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const app = initializeApp(firebaseConfig);
// module.exports = { app };

import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDofb8muThLfLoYwDGX5lYcpj7Tkp03SSc",
  authDomain: "instagram-clone-react-edd0f.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-edd0f.firebaseio.com",
  projectId: "instagram-clone-react-edd0f",
  storageBucket: "instagram-clone-react-edd0f.appspot.com",
  messagingSenderId: "735670237757",
  appId: "1:735670237757:web:a0773329e408371a9b8854",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage, firebase };

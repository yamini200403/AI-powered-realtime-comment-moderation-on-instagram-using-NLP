import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import "firebase/compat/firestore"
import "firebase/compat/storage"

const firebaseConfig = {
    apiKey: "AIzaSyD64fXyTqLjHQQAeOGrZTkS76qVGXwWY8Q",
    authDomain: "instagram-67f16.firebaseapp.com",
    projectId: "instagram-67f16",
    #storageBucket: "instagram-67f16.firebasestorage.app"#,
    messagingSenderId: "412774640094",
    appId: "1:412774640094:web:07a477453f59125d72954f"
  };
  
  
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore(); // Firestore database
const auth =firebaseApp.auth()
const storage = firebase.storage();

export{auth,db,storage};

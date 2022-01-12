import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDcilGQk54W5QBe31Frs9Z9fkLm5B7rtK8",
  authDomain: "project-one-2c857.firebaseapp.com",
  projectId: "project-one-2c857",
  storageBucket: "project-one-2c857.appspot.com",
  messagingSenderId: "879701329151",
  appId: "1:879701329151:web:bfe085e521ce2edb3d38ca"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
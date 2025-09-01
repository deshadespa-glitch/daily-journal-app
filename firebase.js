import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDceCoqBei2G9XxpmJ57v3pr6wJgsMlgko",
  authDomain: "expofirebase-fffb9.firebaseapp.com",
  projectId: "expofirebase-fffb9",
  storageBucket: "expofirebase-fffb9.firebasestorage.app",
  messagingSenderId: "832167983802",
  appId: "1:832167983802:web:340105ede37fb97a5f6083",
};

// ✅ Only initialize once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);

const itemsCol = collection(db, "items");

// ---- Simple CRUD helpers over 'items'
export async function createItem(text) {
  if (!text?.trim()) return;
  await addDoc(itemsCol, {
    text: text.trim(),
    done: false,
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
  });
}

export function subscribeItems(cb) {
  const q = query(itemsCol, orderBy("createdAtMs", "desc"));
  return onSnapshot( 
    q,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      cb(rows);
    },
    (err) => console.error("subscribeItems error:", err)
  );
}

export async function updateItem(id, data) {
  await updateDoc(doc(db, "items", id), data);
}

export async function deleteItem(id) {
  await deleteDoc(doc(db, "items", id));
}
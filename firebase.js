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
  apiKey: "AIzaSyBR4g78BpRjqx5paCn5R73AdtlHtE0tUEM",
  authDomain: "daily-journal-app-85d51.firebaseapp.com",
  projectId: "daily-journal-app-85d51",
  storageBucket: "daily-journal-app-85d51.firebasestorage.app",
  messagingSenderId: "881893774620",
  appId: "1:881893774620:web:d7786b287134595e07d6d9"
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
import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Check Login
onAuthStateChanged(auth, (user) => {
  if (!user && location.pathname.includes("dashboard")) {
    window.location.href = "index.html";
  }
});

// Logout
window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

// Customer Form
const form = document.getElementById("customerForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    await addDoc(collection(db, "customers"), {
      name,
      phone,
      address
    });

    alert("Customer Saved");

    form.reset();
    loadData();
  });
}

// Load Data
async function loadData() {
  const list = document.getElementById("list");

  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "customers"));

  snapshot.forEach((doc) => {
    const data = doc.data();

    const li = document.createElement("li");
    li.innerHTML = `
      <b>${data.name}</b><br>
      ${data.phone}<br>
      ${data.address}
      <hr>
    `;

    list.appendChild(li);
  });
}

loadData();
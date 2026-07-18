// ==========================================
console.log("app.js loaded");
// ChatApp Todo Dashboard
// app.js
// Part 4A
// ==========================================

// ==============================
// Firebase Imports
// ==============================

import {
    auth,
    db,
    signOut,
    onAuthStateChanged
} from "./firebase.js";

import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==============================
// DOM Elements
// ==============================

const loader = document.getElementById("loader");
const app = document.getElementById("app");

const profilePic = document.getElementById("profilePic");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const logoutBtn = document.getElementById("logoutBtn");

const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskContainer = document.getElementById("taskContainer");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");
const themeBtn = document.getElementById("themeBtn");

// ==============================
// Variables
// ==============================

let currentUser = null;

let tasks = [];

let currentFilter = "all";

// ==============================
// Loader Functions
// ==============================

function showLoader() {

    loader.style.display = "flex";

    app.classList.add("hidden");

}

function hideLoader() {

    loader.style.display = "none";

    app.classList.remove("hidden");

}

// ==============================
// Logout
// ==============================

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    }

    catch (error) {

        console.error(error);

        alert("Logout failed.");

    }

});

// ==============================
// Authentication Check
// ==============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    userName.textContent = user.displayName || "User";

    userEmail.textContent = user.email;

    profilePic.src =
        user.photoURL ||
        `https://ui-avatars.com/api/?background=667eea&color=fff&name=${encodeURIComponent(
            user.displayName || user.email
        )}`;

    hideLoader();

    startRealtimeListener();

});



// ==============================
// Firestore Collection
// ==============================

let unsubscribe = null;

function startRealtimeListener() {

    if (unsubscribe) {

        unsubscribe();

    }

    const taskRef = collection(
        db,
        "users",
        currentUser.uid,
        "tasks"
    );

    unsubscribe = onSnapshot(taskRef, (snapshot) => {


        tasks = [];

        snapshot.forEach((docSnap) => {

            tasks.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        renderTasks();

        updateStatistics();

        updateProgress();

    });

}

// ==============================
// Empty State
// ==============================

function toggleEmptyState() {

    if (tasks.length === 0) {

        emptyState.style.display = "block";

        taskContainer.style.display = "none";

    } else {

        emptyState.style.display = "none";

        taskContainer.style.display = "grid";

    }

}

// ==============================
// Statistics
// ==============================

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

    toggleEmptyState();

}

// ==============================
// Progress Bar
// ==============================

function updateProgress() {

    if (tasks.length === 0) {

        progressFill.style.width = "0%";

        progressPercent.textContent = "0%";

        return;

    }

    const completed = tasks.filter(task => task.completed).length;

    const percent = Math.round(
        (completed / tasks.length) * 100
    );

    progressFill.style.width = percent + "%";

    progressPercent.textContent = percent + "%";

}

// ==============================
// Render Placeholder
// ==============================

// Full renderTasks() function

const firebaseConfig = {

apiKey: "AIzaSyAXh-QGBAslhXjf3FRwNIYA2hNmCzSCPhU",

authDomain: "login-f5c62.firebaseapp.com",

projectId: "login-f5c62",

storageBucket: "login-f5c62.firebasestorage.app",

messagingSenderId: "618951041850",

appId: "1:618951041850:web:06c744a7d988d86bd9a603",

measurementId: "G-TSDBHNZBTP"

};



// ==========================================
// PART 4B
// Render Tasks
// ==========================================

function renderTasks() {

    taskContainer.innerHTML = "";

    let filteredTasks = [...tasks];

    // Filter

    if (currentFilter === "completed") {

        filteredTasks = filteredTasks.filter(task => task.completed);

    }

    if (currentFilter === "pending") {

        filteredTasks = filteredTasks.filter(task => !task.completed);

    }

    // Search

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    if (keyword !== "") {

        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(keyword)
        );

    }

    // Empty

    if (filteredTasks.length === 0) {

        taskContainer.innerHTML = `
            <div class="emptyState">
                <i class="fa-solid fa-box-open"></i>
                <h2>No Tasks Found</h2>
                <p>Create a new task.</p>
            </div>
        `;

        return;

    }

    // Cards

    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.className =
            task.completed
            ? "task completed"
            : "task";

        card.innerHTML = `

            <span class="priority ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

            <h3>${task.title}</h3>

            <p>

                Created :
                ${
                    task.createdAt
                    ? new Date(
                        task.createdAt.seconds * 1000
                      ).toLocaleString()
                    : "Just Now"
                }

            </p>

            <div class="taskButtons">

                <button
                    class="completeBtn"
                    data-id="${task.id}">

                    ${
                        task.completed
                        ? "Undo"
                        : "Complete"
                    }

                </button>

                <button
                    class="editBtn"
                    data-id="${task.id}">

                    Edit

                </button>

                <button
                    class="deleteBtn"
                    data-id="${task.id}">

                    Delete

                </button>

            </div>

        `;

        taskContainer.appendChild(card);

    });

    attachButtonEvents();

}

// ==========================================
// Button Events
// ==========================================

function attachButtonEvents() {

    document
    .querySelectorAll(".completeBtn")
    .forEach(button => {

        button.onclick = () => {

            toggleTask(button.dataset.id);

        };

    });

    document
    .querySelectorAll(".editBtn")
    .forEach(button => {

        button.onclick = () => {

            editTask(button.dataset.id);

        };

    });

    document
    .querySelectorAll(".deleteBtn")
    .forEach(button => {

        button.onclick = () => {

            deleteTask(button.dataset.id);

        };

    });

}

// ==========================================
// Search
// ==========================================

searchInput.addEventListener("input", () => {

    renderTasks();

});

// ==========================================
// Filters
// ==========================================

allBtn.onclick = () => {

    currentFilter = "all";

    setActive(allBtn);

    renderTasks();

};

completedBtn.onclick = () => {

    currentFilter = "completed";

    setActive(completedBtn);

    renderTasks();

};

pendingBtn.onclick = () => {

    currentFilter = "pending";

    setActive(pendingBtn);

    renderTasks();

};

function setActive(button){

    document
        .querySelectorAll(".navBtn")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

}





// ==========================================
// PART 4C
// Firebase CRUD Functions
// ==========================================

// ---------- Add Task ----------

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        addTask();

    }

});

async function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;

    }

    try {

        await addDoc(

            collection(
                db,
                "users",
                currentUser.uid,
                "tasks"
            ),

            {

                title: title,

                priority: priority.value,

                completed: false,

                createdAt: serverTimestamp()

            }

        );

        taskInput.value = "";

        priority.value = "High";

    }

    catch (error) {

    console.error(error);

    alert(error.code + "\n\n" + error.message);

}

}

// ---------- Complete / Undo ----------

async function toggleTask(id) {

    try {

        const task = tasks.find(t => t.id === id);

        if (!task) return;

        await updateDoc(

            doc(
                db,
                "users",
                currentUser.uid,
                "tasks",
                id
            ),

            {

                completed: !task.completed

            }

        );

    }

    catch (error) {

        console.error(error);

        alert("Unable to update task.");

    }

}

// ---------- Delete ----------

async function deleteTask(id) {

    const ok = confirm("Delete this task?");

    if (!ok) return;

    try {

        await deleteDoc(

            doc(
                db,
                "users",
                currentUser.uid,
                "tasks",
                id
            )

        );

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete task.");

    }

}

// ---------- Edit ----------

async function editTask(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    const newTitle = prompt(

        "Edit Task",

        task.title

    );

    if (newTitle === null) return;

    if (newTitle.trim() === "") {

        alert("Task cannot be empty.");

        return;

    }

    try {

        await updateDoc(

            doc(
                db,
                "users",
                currentUser.uid,
                "tasks",
                id
            ),

            {

                title: newTitle.trim()

            }

        );

    }

    catch (error) {

        console.error(error);

        alert("Unable to edit task.");

    }

}






// ==========================================
// PART 4D
// Final Initialization
// ==========================================

// ---------- Dark Mode ----------

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i> Light Mode';

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i> Light Mode';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i> Dark Mode';

    }

});

// ---------- Active Navigation ----------

function activateButton(button) {

    document.querySelectorAll(".navBtn").forEach(btn => {

        btn.classList.remove("active");

    });

    button.classList.add("active");

}

allBtn.addEventListener("click", () => {

    currentFilter = "all";

    activateButton(allBtn);

    renderTasks();

});

completedBtn.addEventListener("click", () => {

    currentFilter = "completed";

    activateButton(completedBtn);

    renderTasks();

});

pendingBtn.addEventListener("click", () => {

    currentFilter = "pending";

    activateButton(pendingBtn);

    renderTasks();

});

// ---------- Initial Theme Button ----------

if (document.body.classList.contains("dark")) {

    themeBtn.innerHTML =
        '<i class="fa-solid fa-sun"></i> Light Mode';

} else {

    themeBtn.innerHTML =
        '<i class="fa-solid fa-moon"></i> Dark Mode';

}

// ---------- Loader Safety ----------

window.addEventListener("load", () => {

    setTimeout(() => {

        if (loader.style.display !== "none") {

            hideLoader();

        }

    }, 800);

});

// ---------- Cleanup ----------

window.addEventListener("beforeunload", () => {

    if (unsubscribe) {

        unsubscribe();

    }

});

console.log("✅ ChatApp Todo Dashboard Loaded Successfully");
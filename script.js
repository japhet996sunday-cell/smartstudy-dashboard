// ================= ELEMENTS =================
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const authContainer = document.getElementById('authContainer');
const dashboard = document.getElementById('dashboard');
const welcomeText = document.getElementById('welcomeText');
const notification = document.getElementById('notification');
const themeBtn = document.getElementById('themeBtn');
const clock = document.getElementById('clock');

// ================= NOTIFICATION =================
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// ================= LOGIN SYSTEM =================
usernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") loginBtn.click();
});

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();

  if (!username) {
    showNotification('Please enter your name');
    return;
  }

  localStorage.setItem('smartstudyUser', username);
  loadDashboard();
});

function loadDashboard() {
  const savedUser = localStorage.getItem('smartstudyUser');

  if (savedUser) {
    authContainer.style.display = 'none';
    dashboard.style.display = 'flex';
    welcomeText.textContent = `Welcome, ${savedUser}`;
  }
}

loadDashboard();

// ================= CLOCK =================
function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

// ================= THEME =================
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

// ================= SECTION SWITCH =================
function showSection(section, element) {
  const sections = [
    "homeSection",
    "tasksSection",
    "aiSection",
    "notesSection",
    "weatherSection",
    "tutorSection",
    "settingsSection"
  ];

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const activeSection = document.getElementById(section + "Section");
  if (activeSection) activeSection.classList.remove("hidden");

  document.querySelectorAll(".nav-item")
    .forEach(item => item.classList.remove("active"));

  if (element) element.classList.add("active");

  document.querySelector(".sidebar").classList.remove("active");
  document.querySelector(".overlay").classList.remove("active");
}

// ================= SIDEBAR TOGGLE =================
function toggleMenu() {
  document.querySelector(".sidebar").classList.toggle("active");
  document.querySelector(".overlay").classList.toggle("active");
}

// ================= COLLAPSE SIDEBAR =================
const collapseBtn = document.getElementById("collapseBtn");

if (collapseBtn) {
  collapseBtn.addEventListener("click", () => {
    dashboard.classList.toggle("collapsed");
  });
}

// ================= POMODORO TIMER =================
let time = 1500;
let timer = null;
let isRunning = false;

function updateTimerDisplay() {
  const m = Math.floor(time / 60);
  const s = time % 60;

  const el = document.getElementById("timer");
  if (el) el.innerText = `${m}:${s < 10 ? "0" + s : s}`;
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {
    if (time <= 0) {
      clearInterval(timer);
      isRunning = false;

      showNotification("Pomodoro completed!");
      increaseStreak();

      time = 1500;
      updateTimerDisplay();
      return;
    }

    time--;
    updateTimerDisplay();
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  time = 1500;
  updateTimerDisplay();
}

// ================= STREAK SYSTEM =================
let streak = localStorage.getItem("streak")
  ? parseInt(localStorage.getItem("streak"))
  : 0;

function increaseStreak() {
  streak++;
  localStorage.setItem("streak", streak);

  const el = document.getElementById("streakText");
  if (el) el.innerText = streak + " Days";
}

// ================= TASK SYSTEM =================
let tasks = JSON.parse(localStorage.getItem("smartstudyTasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

function saveTasks() {
  localStorage.setItem("smartstudyTasks", JSON.stringify(tasks));
}

function updateTaskCount() {
  const el = document.getElementById("taskCount");
  if (el) el.innerText = tasks.length + " Tasks";
}

function updateProgress() {
  const completed = tasks.filter(t => t.done).length;
  const percent = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const el = document.getElementById("progressText");
  if (el) el.innerText = percent + "% Completed";
}

function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = "";

  let filtered = tasks;

  if (currentFilter === "completed") {
    filtered = tasks.filter(t => t.done);
  } else if (currentFilter === "pending") {
    filtered = tasks.filter(t => !t.done);
  }

  filtered.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.done ? "checked" : ""}
          onchange="toggleTask(${index})">
        <span style="text-decoration:${task.done ? "line-through" : "none"}">
          ${task.text}
        </span>
      </div>

      <button onclick="deleteTask(${index})">Delete</button>
    `;

    taskList.appendChild(li);
  });

  updateTaskCount();
  updateProgress();
}

function addTask() {
  const value = taskInput.value.trim();

  if (!value) {
    showNotification("Please enter a task");
    return;
  }

  tasks.push({ text: value, done: false });
  taskInput.value = "";

  saveTasks();
  renderTasks();
  showNotification("Task added");
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showNotification("Task deleted");
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

// EVENTS
if (addTaskBtn) {
  addTaskBtn.addEventListener("click", addTask);
}

if (taskInput) {
  taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
  });
}

// INIT TASKS
renderTasks();
updateTimerDisplay();
updateProgress();
updateTaskCount();

// ================= AI SIMPLE SYSTEM =================
const askAiBtn = document.getElementById("askAiBtn");
const aiInput = document.getElementById("aiInput");
const aiResponse = document.getElementById("aiResponse");

if (askAiBtn) {
  askAiBtn.addEventListener("click", () => {
    const q = aiInput.value.toLowerCase();

    if (q.includes("tired")) {
      aiResponse.textContent = "Take a short break.";
    } else if (q.includes("study")) {
      aiResponse.textContent = "Focus on hardest topic first.";
    } else if (q.includes("motivate")) {
      aiResponse.textContent = "Consistency beats motivation.";
    } else {
      aiResponse.textContent = "Stay focused and keep going.";
    }
  });
}

// ================= QUOTES =================
const quotes = [
  "Success is built through consistency.",
  "Small progress every day leads to big results.",
  "Discipline beats motivation.",
  "Push yourself because nobody else will do it for you.",
  "Your future is created by what you do today."
];

const quoteText = document.getElementById("quoteText");
const newQuoteBtn = document.getElementById("newQuoteBtn");

if (newQuoteBtn) {
  newQuoteBtn.addEventListener("click", () => {
    const i = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[i];
  });
}

// ================= WEATHER =================
const weatherBtn = document.getElementById("weatherBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

const WEATHER_KEY = "YOUR_OPENWEATHER_KEY";

if (weatherBtn) {
  weatherBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();

    if (!city) {
      showNotification("Enter city");
      return;
    }

    weatherResult.innerHTML = "Loading...";

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_KEY}&units=metric`
      );

      const data = await res.json();

      if (data.cod !== 200) {
        weatherResult.innerHTML = "City not found";
        return;
      }

      weatherResult.innerHTML = `
        <h4>${data.name}</h4>
        <p>${data.main.temp}°C</p>
        <p>${data.weather[0].main}</p>
      `;
    } catch (err) {
      weatherResult.innerHTML = "Error fetching weather";
    }
  });
}

// ================= BOOKING =================
document.querySelectorAll(".book-btn")
  .forEach(btn => {
    btn.addEventListener("click", () => {
      showNotification("Session booked");
    });
  });

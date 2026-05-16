    // ================= ELEMENTS =================

    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const authContainer = document.getElementById('authContainer');
    const dashboard = document.getElementById('dashboard');
    const welcomeText = document.getElementById('welcomeText');
    const notification = document.getElementById('notification');
    const themeBtn = document.getElementById('themeBtn');
    const clock = document.getElementById('clock');

// ================= POMODORO TIMER SYSTEM =================
// Handles study timing using the Pomodoro technique (25 minutes session).
// Includes start, reset, and live countdown functionality.
// Tracks timer state to prevent multiple intervals from running.
// On completion, it triggers a notification and increases study streak.

let time = 1500;
let timer = null;
let isRunning = false;

function updateTimerDisplay() {
  let m = Math.floor(time / 60);
  let s = time % 60;

  document.getElementById("timer").innerText =
    `${m}:${s < 10 ? "0" + s : s}`;
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

let streak = localStorage.getItem("streak")
  ? parseInt(localStorage.getItem("streak"))
  : 0;
  
  document.getElementById("streakText").innerText =
  streak + " Days";
  
 function increaseStreak() {
  streak++;
  localStorage.setItem("streak", streak);

const streakElement = document.getElementById("streakText");
  if (streakElement) {
    streakElement.innerText = streak + " Days";
  }
}

    // ================= LOGIN SYSTEM =================

usernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loginBtn.click();
  }
});
    loginBtn.addEventListener('click', () => {
      const username = usernameInput.value.trim();

      if(username === '') {
        showNotification('Please enter your name');
        return;
      }

      localStorage.setItem('smartstudyUser', username);

      loadDashboard();
    });

    function loadDashboard() {
      const savedUser = localStorage.getItem('smartstudyUser');

      if(savedUser) {
        authContainer.style.display = 'none';
        dashboard.style.display = 'flex';

        welcomeText.textContent = `Welcome, ${savedUser}`;
      }
    }

    loadDashboard();

    // ================= TASK MANAGER =================

    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

taskInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter") {
    addTaskBtn.click();
  }
});

    let tasks = JSON.parse(localStorage.getItem('smartstudyTasks')) || [];

function updateProgress() {

  const completed =
    tasks.filter(t => t.done === true).length;

  const percent = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  document.getElementById("progressText").innerText =
    percent + "% Completed";
}

function updateTaskCount() {

  document.getElementById("taskCount").innerText =
    tasks.length + " Tasks";
}

    function saveTasks() {
      localStorage.setItem('smartstudyTasks', JSON.stringify(tasks));
    }

    function renderTasks() {

  taskList.innerHTML = '';

  let filteredTasks = tasks;

  if(currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.done);
  }

  if(currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.done);
  }

filteredTasks.forEach((task) => {
  const index = tasks.indexOf(task);

  const li = document.createElement('li');

  li.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">

      <input
        type="checkbox"
        ${task.done ? "checked" : ""}
        onchange="toggleTask(${index})"
      >

      <span style="
        text-decoration:${task.done ? "line-through" : "none"};
      ">
        ${task.text}
      </span>

    </div>

    <button onclick="deleteTask(${index})">
      Delete
    </button>
  `;

  taskList.appendChild(li);

});

  document.getElementById("taskCount").innerText =
    tasks.length + " Tasks";
}

let currentFilter = 'all';

    renderTasks();
    updateProgress();
    updateTimerDisplay();
    
    addTaskBtn.addEventListener('click', () => {
      const task = taskInput.value.trim();
      

      if(task === '') {
        showNotification('Please enter a task');
        return;
      }

      tasks.push({
  text: task,
  done: false
});
      saveTasks();
      renderTasks();
      updateProgress();
      updateTaskCount();
      taskInput.value = '';

      showNotification('Task added successfully');
    });

    function deleteTask(index) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      updateProgress();
      updateTaskCount();
      showNotification('Task deleted');
    }



function toggleTask(index) {

  tasks[index].done = !tasks[index].done;

  saveTasks();

  renderTasks();

  updateProgress();
  updateTaskCount();
}

function filterTasks(type) {

  currentFilter = type;

  renderTasks();
}

    // ================= NOTIFICATIONS =================

    function showNotification(message) {
      notification.textContent = message;
      notification.style.display = 'block';

      setTimeout(() => {
        notification.style.display = 'none';
      }, 3000);
    }

    // ================= THEME =================

    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');

      if(document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });

    const savedTheme = localStorage.getItem('theme');

    if(savedTheme === 'dark') {
      document.body.classList.add('dark');
    }

    // ================= CLOCK =================

    function updateClock() {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString();
    }

    setInterval(updateClock, 1000);
    updateClock();

    // ================= AI ASSISTANT =================

    const askAiBtn = document.getElementById('askAiBtn');
    const aiInput = document.getElementById('aiInput');
    const aiResponse = document.getElementById('aiResponse');

aiInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    askAiBtn.click();
  }
});

    askAiBtn.addEventListener('click', () => {
      const question = aiInput.value.toLowerCase();

      if(question.includes('tired')) {
        aiResponse.textContent = 'Take a short break and continue later.';
      }

      else if(question.includes('study')) {
        aiResponse.textContent = 'Focus on your most difficult subject first.';
      }

      else if(question.includes('motivate')) {
        aiResponse.textContent = 'Success comes from consistency. Keep going!';
      }

      else {
        aiResponse.textContent = 'Stay focused and believe in yourself.';
      }
    });

// ================= QUOTE SYSTEM =================

const quotes = [

  "Success is built through consistency.",

  "Small progress every day leads to big results.",

  "Discipline beats motivation.",

  "Push yourself because nobody else will do it for you.",

  "Your future is created by what you do today."

];

const quoteText = document.getElementById("quoteText");
const newQuoteBtn = document.getElementById("newQuoteBtn");

newQuoteBtn.addEventListener("click", () => {

  const randomIndex = Math.floor(Math.random() * quotes.length);

  quoteText.textContent = quotes[randomIndex];

});

// ================= WEATHER API =================

const weatherBtn = document.getElementById("weatherBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    weatherBtn.click();
  }
});

const API_KEY = "f90bf2f2827b12123392cffc017ca8e2";

weatherBtn.addEventListener("click", async () => {

  const city = cityInput.value.trim();

  if(city === "") {
    showNotification("Please enter a city");
    return;
  }

weatherResult.innerHTML = `
  <p style="color:#2563eb;">
    Fetching weather data...
  </p>
`;

  try {

    const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
);

    const data = await response.json();

    if(data.cod !== 200) {
      weatherResult.innerHTML = "City not found";
      return;
    }

    weatherResult.innerHTML = `
      <h4>${data.name}</h4>
      <p>🌡 Temperature: ${data.main.temp}°C</p>
      <p>☁ Weather: ${data.weather[0].main}</p>
      <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
    `;

  } catch(error) {
    weatherResult.innerHTML = "Unable to fetch weather data";
  }

});

    // ================= BOOKING BUTTONS =================

    const bookButtons = document.querySelectorAll('.book-btn');

    bookButtons.forEach(button => {
      button.addEventListener('click', () => {
        showNotification('Session booked successfully');
      });
    });

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

    if (el) {
      el.classList.add("hidden");
    }
  });

  const activeSection =
    document.getElementById(section + "Section");

  if (activeSection) {
    activeSection.classList.remove("hidden");
  }

  // REMOVE ACTIVE CLASS FROM ALL NAV ITEMS
  document.querySelectorAll(".nav-item")
    .forEach(item => {
      item.classList.remove("active");
    });

  // ADD ACTIVE CLASS TO CLICKED ITEM
  if (element) {
    element.classList.add("active");
  }

  // AUTO CLOSE MOBILE SIDEBAR
  document.querySelector(".sidebar")
    .classList.remove("active");

  document.querySelector(".overlay")
    .classList.remove("active");
}

// ================= SETTINGS =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

  localStorage.removeItem("smartstudyUser");

  dashboard.style.display = "none";

  authContainer.style.display = "flex";

  usernameInput.value = "";

  showNotification("Logged out successfully");

});

// ================= NOTES SYSTEM =================

const notesInput = document.getElementById("notesInput");
const saveNotesBtn = document.getElementById("saveNotesBtn");

notesInput.value = localStorage.getItem("studyNotes") || "";

saveNotesBtn.addEventListener("click", () => {

  localStorage.setItem("studyNotes", notesInput.value);

  showNotification("Notes saved successfully");

});

function toggleMenu() {

  document.querySelector(".sidebar")
    .classList.toggle("active");

  document.querySelector(".overlay")
    .classList.toggle("active");
}

// ================= MODAL SYSTEM =================

const taskModal =
  document.getElementById("taskModal");

function openModal() {
  taskModal.classList.add("active");
}

function closeModal() {
  taskModal.classList.remove("active");
}

taskModal.addEventListener("click", (e) => {

  if(e.target === taskModal) {
    closeModal();
  }

});

showSection("home");

const collapseBtn =
  document.getElementById("collapseBtn");

collapseBtn.addEventListener("click", () => {

  dashboard.classList.toggle("collapsed");

});

document.querySelector(".sidebar")
  .classList.remove("active");

document.querySelector(".overlay")
  .classList.remove("active");

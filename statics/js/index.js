let minutes = 0;
let seconds = 0;
let timer;
let timerRunning = false;
let countdownEnded = false;
const audioElement = new Audio("/statics/assets/ring.wav");
let touchStartY = 0;
let touchMoveY = 0;

document.addEventListener("touchstart", function (e) {
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchmove", function (e) {
  touchMoveY = e.touches[0].clientY;
  const deltaY = touchMoveY - touchStartY;

  window.scrollBy(0, -deltaY);

  e.preventDefault();
});

function updateSystemTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString();
  document.getElementById("systemTime").textContent = `${formattedTime}`;
}
setInterval(updateSystemTime, 1000);
updateSystemTime();

async function loadTimetable() {
  try {
    const response = await fetch("/statics/data/timetable.json");
    if (!response.ok) throw new Error("网络响应不正常");
    const data = await response.json();

    return new Promise((resolve) => {
      const table = document.querySelector("table");
      const headerRow = table.querySelector("tr");
      while (headerRow.children.length > 1) {
        headerRow.removeChild(headerRow.lastChild);
      }
      data.days.forEach((day) => {
        const th = document.createElement("th");
        th.textContent = day;
        headerRow.appendChild(th);
      });

      const rows = Array.from(table.querySelectorAll("tr")).slice(1);
      rows.forEach((row) => table.removeChild(row));

      data.sections.forEach((section) => {
        const row = document.createElement("tr");
        const sectionCell = document.createElement("td");
        sectionCell.textContent = section.name;
        row.appendChild(sectionCell);

        section.courses.forEach((course) => {
          const td = document.createElement("td");
          td.textContent = course;
          row.appendChild(td);
        });

        table.appendChild(row);
      });

      highlightCurrentDay();
      resolve();
    });
  } catch (error) {
    console.error("加载课程表时出错:", error);
    throw error;
  }
}

async function loadButtons() {
  try {
    const response = await fetch("/statics/data/buttons.json");
    if (!response.ok) throw new Error("网络响应不正常");
    const data = await response.json();

    return new Promise((resolve) => {
      const buttonContainer = document.querySelector(".button-container");
      const dynamicButtons = Array.from(
        buttonContainer.querySelectorAll("a.button")
      );
      dynamicButtons.forEach((button) => button.remove());

      data.buttons.forEach((buttonData) => {
        const button = document.createElement("a");
        button.textContent = buttonData.text;
        button.className = buttonData.class;

        if (buttonData.href) {
          button.href = buttonData.href;
        }

        if (buttonData.onclick) {
          button.setAttribute("onclick", buttonData.onclick);
        }

        if (buttonData.target) {
          button.target = buttonData.target;
        }

        const searchInput = buttonContainer.querySelector("input");
        buttonContainer.insertBefore(button, searchInput);
      });
      resolve();
    });
  } catch (error) {
    console.error("加载快捷按钮数据时出错:", error);
    throw error;
  }
}

async function initializeApp() {
  try {
    await Promise.all([loadTimetable(), loadButtons()]);
    loadTimerData();
  } catch (error) {
    throw error;
  }
}

function highlightCurrentDay() {
  const today = new Date().getDay();
  const timetable = document.querySelector("table");

  if (timetable && today >= 1 && today <= 5) {
    const tableRows = timetable.querySelectorAll("tr");

    tableRows.forEach((row) => {
      const cells = row.querySelectorAll("td, th");
      cells[today].classList.add("highlight-column");
    });
  }
}
setInterval(highlightCurrentDay, 1000);

function searchBing() {
  const searchInput = document.getElementById("searchInput").value;
  let bingUrl =
    "https://www.bing.com/search?q=" + encodeURIComponent(searchInput);
  if (searchInput !== "") {
    window.open(bingUrl, "_blank");
  }
}

function saveTimerData() {
  const timerData = { minutes, seconds, timerRunning, countdownEnded };
  sessionStorage.setItem("timerData", JSON.stringify(timerData));
}

function loadTimerData() {
  const storedData = sessionStorage.getItem("timerData");
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    minutes = parsedData.minutes;
    seconds = parsedData.seconds;
    timerRunning = parsedData.timerRunning;
    countdownEnded = parsedData.countdownEnded;

    updateTimerDisplay();
    if (timerRunning && !(minutes === 0 && seconds === 0 && countdownEnded)) {
      startTimer();
    }
  }
}

function updateTimerDisplay() {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  document.getElementById(
    "timerDisplay"
  ).textContent = `${formattedMinutes}:${formattedSeconds}`;

  if (
    formattedMinutes === "00" &&
    formattedSeconds === "00" &&
    countdownEnded === false
  ) {
    document.getElementById("timerDisplay").style.color = "red";
  } else {
    document.getElementById("timerDisplay").style.color = "black";
  }
}

function setQuickTime(min, sec = 0) {
  minutes = min;
  seconds = sec;
  countdownEnded = false;
  updateTimerDisplay();
  saveTimerData();
  if (timerRunning) {
    pauseTimer();
  }
}

function decreaseMinute() {
  if (minutes > 0) {
    minutes--;
    updateTimerDisplay();
  }
}

function increaseMinute() {
  minutes++;
  updateTimerDisplay();
}

function decreaseSecond() {
  if (seconds > 0) {
    seconds--;
    updateTimerDisplay();
  }
}

function increaseSecond() {
  if (seconds < 59) {
    seconds++;
  } else {
    seconds = 0;
    increaseMinute();
  }
  updateTimerDisplay();
}

function startTimer() {
  if (!timerRunning) {
    timer = setInterval(() => {
      const currentTotal = minutes * 60 + seconds;

      if (currentTotal === 4) {
        audioElement.play();
      }

      if (seconds > 0) {
        seconds--;
      } else {
        if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          clearInterval(timer);
          timerRunning = false;
          countdownEnded = true;
          document.getElementById("startPauseButton").textContent = "开始";
        }
      }
      saveTimerData();
      updateTimerDisplay();
    }, 1000);
    timerRunning = true;
    countdownEnded = false;
    document.getElementById("startPauseButton").textContent = "暂停";
  } else {
    pauseTimer();
  }
}

function pauseTimer() {
  if (minutes * 60 + seconds <= 4) return;
  clearInterval(timer);
  timerRunning = false;
  saveTimerData();
  document.getElementById("startPauseButton").textContent = "开始";
}

function stopTimer() {
  clearInterval(timer);
  minutes = 0;
  seconds = 0;
  updateTimerDisplay();
  timerRunning = false;
  countdownEnded = false;
  saveTimerData();
  sessionStorage.removeItem("timerData");
  document.getElementById("startPauseButton").textContent = "开始";
}

function toggleStartPause() {
  const totalSeconds = minutes * 60 + seconds;
  if (totalSeconds <= 4) return;

  if (timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

document
  .getElementById("increaseMinute")
  .addEventListener("click", increaseMinute);
document
  .getElementById("decreaseMinute")
  .addEventListener("click", decreaseMinute);
document
  .getElementById("increaseSecond")
  .addEventListener("click", increaseSecond);
document
  .getElementById("decreaseSecond")
  .addEventListener("click", decreaseSecond);
document
  .getElementById("startPauseButton")
  .addEventListener("click", toggleStartPause);
document.getElementById("resetButton").addEventListener("click", stopTimer);

function scrollToBottom() {
  const timerContainer = document.querySelector(".timer-container");
  if (timerContainer) {
    timerContainer.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

initializeApp();

$(document).ready(function() {
    // Inicializar o Owl Carousel
    const owl = $('.owl-carousel').owlCarousel({
        items: 3,
        loop: true,
        margin: 20,
        center: true,
        nav: false,
        dots: true, 
        startPosition: 1,
        slideTransition: 'ease-in',
        responsive: {
            0: {
                items: 1,
                margin: 10
            },
            600: {
                items: 1,
                margin: 20
            },
            1000: {
                items: 1
            }
        }
    });
});


// Mostrar o modal
document.getElementById('show-map').addEventListener('click', function (event) {
    event.preventDefault(); // Evita o scroll para o ID
    document.getElementById('map-modal').style.display = 'block';
});

// Fechar o modal
document.getElementById('close-map').addEventListener('click', function () {
    document.getElementById('map-modal').style.display = 'none';
});

const emotions = document.querySelectorAll(".emotion");
      const slider = document.getElementById("mood-slider");
      const calendar = document.querySelector(".calendar");

      // Enhanced mood storage structure
      let moodData = JSON.parse(localStorage.getItem("moodData")) || {};

      function getColorForMood(value) {
        const colors = [
          { value: 1, color: "#9b59b6" },
          { value: 2, color: "#3498db" },
          { value: 3, color: "#f1c40f" },
          { value: 4, color: "#2ecc71" },
          { value: 5, color: "#27ae60" },
        ];

        const exactMatch = colors.find((c) => c.value === Math.round(value));
        if (exactMatch) return exactMatch.color;

        const lower = Math.floor(value);
        const upper = Math.ceil(value);
        const fraction = value - lower;

        const lowerColor =
          colors.find((c) => c.value === lower)?.color || colors[0].color;
        const upperColor =
          colors.find((c) => c.value === upper)?.color ||
          colors[colors.length - 1].color;

        return interpolateColors(lowerColor, upperColor, fraction);
      }

      function interpolateColors(color1, color2, factor) {
        const c1 = hexToRgb(color1);
        const c2 = hexToRgb(color2);

        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);

        return `rgb(${r},${g},${b})`;
      }

      function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;
      }

      function updateEmotions(value) {
        emotions.forEach((emotion) => {
          const emotionValue = parseInt(emotion.dataset.value);
          if (Math.abs(emotionValue - value) <= 0.5) {
            emotion.classList.add("selected");
          } else {
            emotion.classList.remove("selected");
          }
        });
      }

      function generateCalendar() {
        calendar.innerHTML = ""; // Clear existing calendar

        const header = document.createElement("div");
        header.className = "calendar-header";
        const monthYear = document.createElement("h3");
        const currentDate = new Date();
        monthYear.textContent = currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        header.appendChild(monthYear);
        calendar.appendChild(header);

        const calendarGrid = document.createElement("div");
        calendarGrid.className = "calendar-grid";

        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekdayTranslations = {
          Sun: "Dom",
          Mon: "Seg",
          Tue: "Ter",
          Wed: "Qua",
          Thu: "Qui",
          Fri: "Sex",
          Sat: "Sáb",
        };
        weekdays.forEach((day) => {
          const weekdayEl = document.createElement("div");
          weekdayEl.className = "weekday";
          weekdayEl.textContent = weekdayTranslations[day];
          calendarGrid.appendChild(weekdayEl);
        });

        const firstDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const lastDay = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        const totalDays = lastDay.getDate();
        const firstDayIndex = firstDay.getDay();

        for (let i = 0; i < firstDayIndex; i++) {
          const emptyDay = document.createElement("div");
          emptyDay.className = "day empty";
          calendarGrid.appendChild(emptyDay);
        }

        for (let day = 1; day <= totalDays; day++) {
          const dayElement = document.createElement("div");
          dayElement.className = "day";
          dayElement.textContent = day;

          if (day === currentDate.getDate()) {
            dayElement.classList.add("today");
          }

          if (moodData[day]) {
            dayElement.classList.add("has-entry");
            const moodColor = getColorForMood(moodData[day].mood);
            dayElement.style.backgroundColor = moodColor;
            dayElement.style.color = "white";
            dayElement.style.border = "none";
            dayElement.title = `Mood: ${moodData[day].mood}\nNotes: ${
              moodData[day].description || "No description"
            }`;
          }

          dayElement.addEventListener("click", () => {
            if (moodData[day]) {
              showDayModal(day, moodData[day]);
            }
          });

          calendarGrid.appendChild(dayElement);
        }

        calendar.appendChild(calendarGrid);
      }

      function updateCalendar() {
        document.querySelectorAll(".day").forEach((day) => {
          const dayNumber = parseInt(day.textContent);
          const dayData = moodData[dayNumber];
          if (dayData) {
            day.classList.add("has-entry");
            const moodColor = getColorForMood(dayData.mood);
            day.style.backgroundColor = moodColor;
            day.style.color = "white";
            day.style.border = "none";
            day.title = `Mood: ${dayData.mood}\nNotes: ${
              dayData.description || "No description"
            }`;
          }
        });
      }

      function loadTodayData() {
        const today = new Date().getDate();
        const todayData = moodData[today];
        if (todayData) {
          document.getElementById("dayDescription").value =
            todayData.description || "";
          document.getElementById("events").value = todayData.events || "";
          slider.value = todayData.mood;
          updateEmotions(todayData.mood);
        }
      }

      function saveMoodData() {
        const today = new Date().getDate();
        const moodValue = parseFloat(slider.value);
        const dayDescription = document.getElementById("dayDescription").value;
        const events = document.getElementById("events").value;

        moodData[today] = {
          mood: moodValue,
          description: dayDescription,
          events: events,
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem("moodData", JSON.stringify(moodData));
        updateCalendar();
        showSuccessMessage();
        toggleInputSection(false);

        calendar.classList.add("visible");
      }

      function toggleInputSection(show) {
        const inputSection = document.querySelector(".input-section");

        if (show) {
          inputSection.classList.add("visible");
          calendar.classList.add("visible");
        } else {
          inputSection.classList.remove("visible");
          document.getElementById("dayDescription").value = "";
          document.getElementById("events").value = "";
        }
      }

      function showSuccessMessage() {
        const successMessage = document.getElementById("successMessage");
        successMessage.style.display = "block";

        // Add fade out animation
        setTimeout(() => {
          successMessage.style.opacity = "0";
          setTimeout(() => {
            successMessage.style.display = "none";
            successMessage.style.opacity = "1";
          }, 300);
        }, 2000);
      }

      function showDayModal(dayNumber, dayData) {
        const modal = document.getElementById("dayModal");
        const modalDayDescription = document.getElementById(
          "modalDayDescription"
        );
        const modalEvents = document.getElementById("modalEvents");
        const editBtn = document.getElementById("editBtn");

        modalDayDescription.value = dayData.description;
        modalEvents.value = dayData.events;

        modalDayDescription.disabled = true;
        modalEvents.disabled = true;

        modal.style.display = "block";

        editBtn.onclick = () => {
          if (editBtn.textContent === "Alterar") {
            modalDayDescription.disabled = false;
            modalEvents.disabled = false;
            editBtn.textContent = "Salvar";
          } else {
            moodData[dayNumber] = {
              ...dayData,
              description: modalDayDescription.value,
              events: modalEvents.value,
              timestamp: new Date().toISOString(),
            };
            localStorage.setItem("moodData", JSON.stringify(moodData));
            updateCalendar();
            modal.style.display = "none";
            showSuccessMessage();
          }
        };

        document.querySelector(".close-modal").onclick = () => {
          modal.style.display = "none";
        };
      }

      document.addEventListener("DOMContentLoaded", () => {
        calendar.classList.add("visible");
        generateCalendar();
        loadTodayData();

        // Set default to "Okay" (value 3)
        slider.value = 3;
        updateEmotions(3);

        // Find and select the "Okay" emotion
        const okayEmotion = document.querySelector('.emotion[data-value="3"]');
        if (okayEmotion) {
          okayEmotion.classList.add("selected");
        }
      });

      emotions.forEach((emotion) => {
        emotion.addEventListener("click", () => {
          const value = emotion.dataset.value;
          slider.value = value;
          updateEmotions(value);
          toggleInputSection(true);
        });
      });

      slider.addEventListener("input", () => {
        updateEmotions(slider.value);
        toggleInputSection(true);
      });

      document
        .getElementById("registerBtn")
        .addEventListener("click", saveMoodData);
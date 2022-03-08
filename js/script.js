let monthIndex = 0;

/**************************** GET CALENDAR FUNCTION **************************/
const getCalendar = () => {
  let date = new Date();
  monthIndex !== 0 && date.setMonth(new Date().getMonth() + monthIndex);

  let day = date.getDate();
  let monthNb = date.getMonth();
  let monthStr = date.toLocaleString("en-us", { month: "long" });
  let year = date.getFullYear();

  // dynamic calendar header => year & month
  let monthYear = document.querySelector(".calendar-container__title");
  monthYear.innerText = `${monthStr} ${year}`;

  // calendar content
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let calendarTable = document.querySelector(".calendar-table__body");

  // first and last day in the current month
  const firstDayInMonth = new Date(year, monthNb, 1).toLocaleDateString(
    "en-us",
    {
      weekday: "short",
      //   year: "numeric",
      //   month: "numeric",
      //   day: "numeric",
    }
  );
  const lastDayInMonth = new Date(year, monthNb + 1, 0).getDate();

  // inactive days (of the prev month)
  const prevInactiveDays = days.indexOf(firstDayInMonth.split(", ")[0]);
  calendarTable.innerHTML = "";
  for (let i = 1; i <= prevInactiveDays + lastDayInMonth; i++) {
    calendarCol = document.createElement("div");
    calendarCol.classList.add("calendar-table__col");
    calendarItem = document.createElement("div");
    calendarItem.classList.add("calendar-table__item");
    calendarItemValue = document.createElement("span");
    calendarCol.append(calendarItem);
    calendarItem.append(calendarItemValue);

    // days of current month
    if (i > prevInactiveDays) {
      calendarItemValue.innerText = i - prevInactiveDays;
      calendarCol.addEventListener("click", () =>
        displayAddEvent(`${monthNb + 1}/${i - prevInactiveDays}/${year}`)
      );

      // current day style
      i - prevInactiveDays === day &&
        new Date().toLocaleString("en-us", { month: "long" }) ==
          monthYear.innerText.split(" ")[0] &&
        calendarCol.classList.add("calendar-table__today");
    }
    // days of prev/next month
    else if (i === prevInactiveDays) {
      calendarCol.classList.add("calendar-table__inactive");
      calendarItemValue.innerText = lastDayInMonth;
    } else {
      calendarCol.classList.add("calendar-table__inactive");
      calendarItemValue.innerText = lastDayInMonth - i;
    }
    //   calendarItemValue.innerText = lastDayInMonth-1

    calendarTable.appendChild(calendarCol);

  }
  displayAllEvents()
};

/**************************** PREV & NEXT MONTH ******************************/
const prevNextButtons = () => {
  document
    .querySelector(".calendar-container__btn--right")
    .addEventListener("click", () => {
      monthIndex++;
      getCalendar();
    });
  document
    .querySelector(".calendar-container__btn--left")
    .addEventListener("click", () => {
      monthIndex--;
      getCalendar();
    });
};

/***************************** EVENTS ***************************************/
let clickedDay = null;
let eventInput = document.querySelector(".event_input");
let errorMsg = document.querySelector(".error_msg");
// check if events is not empty else return emty array ( you don't need undefined)
let events = localStorage.getItem("events")
? JSON.parse(localStorage.getItem("events"))
: [];
console.log(events)

/*** HIDE ADD NEW EVENT BLOCK ***/
const hideAddEvent = () => {
  document.querySelector(".add_event").style.display = "none";
  eventInput.value = "";
  clickedDay = null;
  eventInput.classList.remove("error");
  errorMsg.innerText = "";
  getCalendar();
};

/*** DISPLAY ADD NEW EVENT BLOCK ***/
const displayAddEvent = (date) => {
  errorMsg.innerText = "";
  clickedDay = date;
  console.log(clickedDay);
  const eventForDay = events.find((event) => event.date === clickedDay);
  if (!eventForDay) {
    document.querySelector(".add_event").style.display = "flex";
    let t = document.querySelector(".calendar-table__col");
    t.classList.add("calendar-table__event");

  } else {
    errorMsg.innerText = "Event already exist at this day !!";
    //   alert("Event already exist !!");
  }
};

/*** ADD NEW EVENT ***/
const addNewEvent = () => {
  if (eventInput.value) {
    eventInput.classList.remove("error");
    events.push({ date: clickedDay, eventTitle: eventInput.value });
    localStorage.setItem('events', JSON.stringify(events))
    // for (let j = 0; j < events.length; j++) {
    //   localStorage.setItem(
    //     `Event of ${events[j].date}`,
    //     JSON.stringify(events[j])
    //   );
    // }
  } else {
    eventInput.classList.add("error");
  }
};

/*** ADD AND CANCEL EVENT FUNCTIONALITIES ***/
const addCancelEvent = () => {
  document
    .querySelector(".add_event_btn")
    .addEventListener("click", addNewEvent);
  document
    .querySelector(".cancel_event_btn")
    .addEventListener("click", hideAddEvent);
    hideAddEvent();

};

/*** DISPLAY LIST OF EVENTS ***/
const displayAllEvents = () => {
    let eventsList = document.querySelector(".events__list");
    console.log({events : events.length})
  
    for (let i = events.length-1; i >=0; i--) {
      let eventItem = document.createElement("li");
      let eventItemLeft = document.createElement("div");
      let eventName = document.createElement("span");
      let eventDate = document.createElement("span");
  
      eventItem.classList.add("events__item");
      eventItemLeft.classList.add("events__item--left");
      eventName.classList.add("events__name");
      eventDate.classList.add("events__date");
  
      eventName.innerText = events[i].eventTitle;
      eventDate.innerText = events[i].date;
  
      eventItemLeft.appendChild(eventDate);
      eventItemLeft.appendChild(eventName);
      eventItem.appendChild(eventItemLeft);
      eventsList.appendChild(eventItem);
    }
  };

prevNextButtons();
addCancelEvent();
getCalendar();


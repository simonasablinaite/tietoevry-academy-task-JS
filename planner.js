// Paselektinu formoje esancius elementus
const plannerForm = document.querySelector('#planner-form');
const workingScope = document.querySelector('#working-scope');
const deadline = document.querySelector('#deadline');
const busyDate = document.querySelector('#busy-date');
const busyTime = document.querySelector('#busy-time');
const addBtn = document.querySelector('.add-btn');
const submitBtn = document.querySelector('.submit-btn');
const responseContainer = document.querySelector('.response-container')


//variables
let countDays;
let alertMsg = '';
let freeTimeCount = 0;

// Susikuriu sventiniu dienu masyva:
const celebrationDays = [[1, 1], [2, 16], [3, 11], [4, 20], [4, 21], [5, 1], [6, 24], [7, 6], [8, 15], [11, 1], [11, 2], [12, 24], [12, 25], [12, 26]];

const busyDayData = [];

// Add date mygtukui sukuriu funkcionaluma: prideti elementus i lista
addBtn.addEventListener('click', () => {
   const busyDate = plannerForm['busy-date'].value;
   const busyTime = plannerForm['busy-time'].value;

   let addedObj =
   {
      date: busyDate,
      time: busyTime
   }

   busyDayData.push(addedObj);
   console.log(busyDayData);

   const busyDateAndTimeList = document.querySelector('#busy-date-and-time-list');
   const busyDataItem = document.createElement('div');
   busyDataItem.classList.add('busy-data-item');

   const busyDateElement = document.createElement('p');
   busyDateElement.innerHTML = `<p style="color:white">Date: ${busyDate}</p>`;

   const busyTimeElement = document.createElement('p');
   busyTimeElement.innerHTML = `<p style="color:white">Time: ${busyTime}</p>`;

   // Sukuriu elemento istrynimo mygtuka
   const deleteItemBtn = document.createElement('button');
   deleteItemBtn.classList.add('btn', 'del-btn')
   deleteItemBtn.textContent = ('X');

   deleteItemBtn.addEventListener('click', () => {
      busyDataItem.remove();

      const deletedMsgText = `Date ${busyDate} and Time ${busyTime} hours was deleted!`;
      renderAlertMsg(deletedMsgText, 'red');

   })
   busyDataItem.append(busyDateElement, busyTimeElement, deleteItemBtn);
   busyDateAndTimeList.append(busyDataItem);
})

// Sukuriu formai ivyki: kai forma submitinama, gaunami formos duomenys, kurie panaudojami lsiko apskaiciavimui:
plannerForm.addEventListener('submit', (event) => {
   event.preventDefault();
   alertMsg.textContent = '';

   const form = event.target;

   const workingScope = form['working-scope'].value;
   const deadline = form.deadline.value;
   const busyDate = form['busy-date'].value;
   const busyTime = form['busy-time'].value;

   console.log(formValidation()); //false

   if (!formValidation()) {
      return false;
   }

   const deadlineValue = new Date(event.target.deadline.value);
   let day = new Date();
   console.log(day);

   countDays = 0;
   console.log(totalWorkingScope(day, deadlineValue));

   getTimeInHours(day, deadlineValue);
})

function totalWorkingScope(day, deadlineValue) {
   while (day.getTime() <= deadlineValue.getTime()) {
      day.setDate(day.getDate() + 1);

      const isWeekend = day.getDay() === 0 || day.getDay() === 6;

      const dateMonth = (day.getMonth() + 1); // datos menuo
      const dateDay = day.getDate(); // datos diena

      const isHoliday = celebrationDays.some(holiday => dateMonth === holiday[0] && dateDay === holiday[1]);

      if (!isWeekend && !isHoliday) {
         countDays++;
      }
   }

   console.log(countDays);

   freeTimeCount = (24 - 8) * countDays;
   console.log(freeTimeCount);
   return freeTimeCount;
}

function getTimeInHours(day, deadlineValue) {
   let time = 0;
   // Pasiskaiciuoju turima laika valandomis:
   if (!busyDayData) {
      freeTimeCount = (24 - 8) * countDays;
   } else {

      busyDayData.map(data => {
         time += Number(data.time);
         console.log(new Date(data.date).getDate());

         console.log(data.time);
      })
   }
   if (freeTimeCount < workingScope.value) {
      const negativeAnswer = 'There is not enough time!😞';
      renderAlertMsg(negativeAnswer, 'red');
      // console.log('There is not enough time ');
   } else {
      const positiveAnswer = 'Get ready to work!😉';
      renderAlertMsg(positiveAnswer, 'green');
      // console.log('Get ready to work!');
   }
   console.log(totalWorkingScope(day, deadlineValue) - time);
}

// Issokancios zinutes sukurimo f-ja
function renderAlertMsg(text, color) {
   const alertMsg = document.querySelector('#alert-msg');
   alertMsg.textContent = text;
   alertMsg.style.color = color;
   alertMsg.style.display = 'block';

   setTimeout(() => {
      alertMsg.textContent = '';
   }, 5000)
}

function formValidation() {
   workingScope.value;
   deadline.value;
   busyDate.value;
   console.log(busyTime.value);
   let isValid = true;

   if (workingScope.value.length == 0 || deadline.value == '') {
      const inputMsg = 'Must fill the workscope and deadline fields!';
      renderAlertMsg(inputMsg, 'red');
      isValid = false;
   }
   return isValid;
}
function showResponse() {
   setTimeout(() => {
      responseContainer.style.display = 'flex'
   })
}



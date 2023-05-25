let plannerForm = document.querySelector('#planner-form');
const workingScope = document.querySelector('#working-scope');
const deadline = document.querySelector('#deadline');
const busyDate = document.querySelector('#busy-date');
const busyTime = document.querySelector('#busy-time');
const addBtn = document.querySelector('.add-btn');
const submitBtn = document.querySelector('.submit-btn');
const responseContainer = document.querySelector('.response-container');
const titleName = document.querySelector('h1');
const logo = document.querySelector('img');

let countDays;
let alertMsg = '';
let freeTimeCount = 0;

const celebrationDays = [[1, 1], [2, 16], [3, 11], [4, 20], [4, 21], [5, 1], [6, 24], [7, 6], [8, 15], [11, 1], [11, 2], [12, 24], [12, 25], [12, 26]];
let busyDayData = [];

let workingScopeDays = [];


const addZero = (i) => {
   if (i < 10) {
      i = "0" + i;
   }
   return i;
}
const formatDate = (date) => {
   let yearFormat = date.getFullYear();
   let month = addZero(date.getMonth() + 1);
   let day = addZero(date.getDate());

   let dateArr = [yearFormat, month, day];

   let result = dateArr.join('-').concat(" ");
   return result;
}

addBtn.addEventListener('click', (event) => {
   event.preventDefault();
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
   busyDateElement.innerHTML = `<p style="color:white">Date: ${busyDate}</p>`
   const busyTimeElement = document.createElement('p');
   busyTimeElement.innerHTML = `<p style="color:white">Time: ${busyTime}</p>`;

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
   showResponse();
})

plannerForm.addEventListener('submit', (event) => {
   event.preventDefault();

   alertMsg.textContent = '';

   const form = event.target;
   const workingScope = form['working-scope'].value;
   // const deadline = form.deadline.value;
   // const busyDate = form['busy-date'].value;
   // const busyTime = form['busy-time'].value;

   formValidation();

   if (!formValidation()) {
      return false;
   }

   const deadlineValue = new Date(event.target.deadline.value);
   let day = new Date();

   countDays = 0;
   totalWorkingScope(day, deadlineValue);
   getTimeInHours(day, deadlineValue);

   for (let i = 0; i < workingScopeDays.length - 1; i++) {
      for (let j = 0; j < busyDayData.length; j++) {
         if (workingScopeDays[i].date.trim() == busyDayData[j].date) {
            workingScopeDays[i].time -= busyDayData[j].time;
         }
      }
   }

   let count = 0;
   let workingHours = Number(workingScope); //10 val

   workingScopeDays.map((element) => {
      if (workingHours > element.time) {
         workingHours -= element.time;
         count++;
      } else if (workingHours > 0) {
         element.time = workingHours;
         workingHours = 0;
         count++;
      }
   });
   const counting = workingScopeDays.slice(0, count);
   console.log(counting);
   console.log(busyDayData);

   const mainContentEl = document.getElementById('main-content');

   if (counting) {
      const ulEl = document.createElement('ul');

      counting.map((item) => {
         const liEl = document.createElement('li');
         liEl.textContent = `${item.date} ${item.time}`;

         ulEl.appendChild(liEl);
      });

      mainContentEl.append(ulEl);
   }

   plannerForm.reset();
});

function totalWorkingScope(day, deadlineValue) {

   while (day.getTime() <= deadlineValue.getTime()) {

      day.setDate(day.getDate() + 1);
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      const dateMonth = (day.getMonth() + 1);
      const dateDay = day.getDate();
      const isHoliday = celebrationDays.some(holiday => dateMonth === holiday[0] && dateDay === holiday[1]);

      if (!isWeekend && !isHoliday) {
         let workingDaysObj = {
            date: formatDate(day),
            time: 8
         }
         workingScopeDays.push(workingDaysObj);

         console.log(workingDaysObj);
         console.log(day);
         countDays++;

      }
   }
   console.log(workingScopeDays);

   freeTimeCount = (24 - 8 - 8) * countDays;
   console.log(freeTimeCount);
   return freeTimeCount;
}

function getTimeInHours(day, deadlineValue) {
   let time = 0;

   if (!busyDayData) {
      freeTimeCount = (24 - 8) * countDays;
   } else {
      console.log(busyDayData);
      busyDayData.map(data => {
         time += Number(data.time);
         console.log(new Date(data.date).getDate());
         console.log(new Date(data.date).getFullYear());

         formatDate(new Date(data.date));
      })


      if (freeTimeCount < workingScope.value) {

         const negativeAnswer = 'There is not enough time!😞';
         renderAlertMsg(negativeAnswer, 'red');
      }
      totalWorkingScope(day, deadlineValue) - time;
      console.log(day);
      console.log(deadlineValue);
      console.log(time);
   }

   const workingPlan = Math.floor(Number(workingScope.value / countDays));
   const workingPlanText = 'Get ready to work!😉' + ` You must to written ${workingPlan} hours/day`;
   renderAlertMsg(workingPlanText, 'green');
   if (workingPlan > 24) {
      const workingPlanText = ' There are not enough hours in the day';
      renderAlertMsg(workingPlanText, 'red');
   }

}

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
   busyTime.value;
   let isValid = true;
   let inputMsg = '';

   if (workingScope.value.length == 0 || deadline.value == '') {
      inputMsg = 'Must fill the workscope and deadline fields!';
      renderAlertMsg(inputMsg, 'red');
      isValid = false;
   }

   if (busyDate.value > deadline.value) {
      inputMsg = 'The entered date exceeds the deadline!';
      renderAlertMsg(inputMsg, 'red');
      isValid = false;
   }

   if (busyTime.value > 23) {
      inputMsg = 'There are only 24 hours in a day!';
      renderAlertMsg(inputMsg, 'red');
      isValid = false;
   }

   if (busyTime.value < 0) {
      inputMsg = 'Input can not be a negative number!';
      renderAlertMsg(inputMsg, 'red');
      isValid = false;
   }

   if (workingScope.value < 0) {
      inputMsg = 'Input can not be a negative number!';
      renderAlertMsg(inputMsg, 'red');
      isValid = false;
   }
   return isValid;
}

function showResponse() {
   setTimeout(() => {
      responseContainer.style.display = 'flex';
      titleName.style.display = 'none';
   })
}



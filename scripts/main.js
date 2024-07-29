/////////////////// FinEase Web Application
//////////////////
'use strict';

import { openModal } from './services/modal.js';
import { dateFormatOptions, accounts, locales } from './utils/constants.js';
import * as DomElements from './utils/elements.js';
import {
  createUsernames,
  formatCurrency,
  formatMovementDate,
} from './utils/helpers.js';
import { initLocale } from './utils/locale.js';

/////////////////////////////////////////////////
// Functions

const displaySelectedLocale = () => {
  DomElements.selectedLocaleLabel.textContent =
    'Selected: ' + currentAccount.locale;
};

const getCardDates = acc => {
  DomElements.cardName.textContent = `${acc.owner}`;
  DomElements.cardNumber.textContent = `${acc.cardNumber}`;
  DomElements.cardValid.textContent = `${acc.cardValid}`;
};

const displayMovements = (acc, sort = false) => {
  DomElements.containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    DomElements.containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Display Balance
const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  DomElements.labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
  const now = new Date();
  DomElements.labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    dateFormatOptions
  ).format(now);
};

//Display Summary
const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  DomElements.labelSumIn.textContent = formatCurrency(
    incomes,
    acc.locale,
    acc.currency
  );

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  DomElements.labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  DomElements.labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

//Update UI
const updateUI = acc => {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);

  //Display card name
  getCardDates(acc);

  displaySelectedLocale();
};

// Countdown timer
const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    DomElements.labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      DomElements.labelWelcome.textContent = `Log in to get started`;
      DomElements.containerApp.style.opacity = 0;
    }
    // Decrese 1s
    time--;
  };
  // Set time to 2 minutes
  let time = 180;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Function to populate the select dropdown
const populateLocaleSelect = () => {
  locales.forEach(locale => {
    const option = document.createElement('option');
    option.value = locale[1];
    option.textContent = locale[0];
    DomElements.dropdown.appendChild(option);
  });
};

// Function to handle on locale change event
const onLocaleChange = () => {
  currentAccount.locale =
    DomElements.dropdown.options[DomElements.dropdown.selectedIndex].value;
  updateUI(currentAccount);
};

///////////////////////////////////////
// Event handlers

let sorted = false;

DomElements.btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

let currentAccount, timer;

DomElements.btnLogin.addEventListener('click', e => {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === DomElements.inputLoginUsername.value
  );

  if (currentAccount?.pin === +DomElements.inputLoginPin.value) {
    // Display UI and message
    DomElements.labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    DomElements.containerApp.style.opacity = 100;

    // Clear input fields
    DomElements.inputLoginUsername.value = DomElements.inputLoginPin.value = '';
    DomElements.inputLoginPin.blur();
    // Countdown timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    initLocale(currentAccount.locale);
    updateUI(currentAccount);
  } else {
    openModal(
      DomElements.inputLoginUsername,
      DomElements.inputLoginPin,
      'Wrong user or PIN. Try again!'
    );
  }
});

DomElements.btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +DomElements.inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === DomElements.inputTransferTo.value
  );
  DomElements.inputTransferAmount.value = DomElements.inputTransferTo.value =
    '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  //Check transfer inputs
  if (!receiverAcc)
    openModal(
      DomElements.inputTransferTo,
      DomElements.inputTransferAmount,
      'Unable to transfer. The receiver user does not exist.'
    );

  if (currentAccount.balance < amount)
    openModal(
      DomElements.inputTransferTo,
      DomElements.inputTransferAmount,
      'Unable to transfer. Not enough balance.'
    );

  if (receiverAcc.username === currentAccount.username)
    openModal(
      DomElements.inputTransferTo,
      DomElements.inputTransferAmount,
      'Unable to transfer to your own account.'
    );
});

DomElements.btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(DomElements.inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Process loan time=2500s
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  } else {
    //Check loan input
    openModal(
      DomElements.inputLoanAmount,
      DomElements.inputTransferAmount,
      'Unable to loan.'
    );
  }
  DomElements.inputLoanAmount.value = '';
});

DomElements.btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    DomElements.inputCloseUsername.value === currentAccount.username &&
    Number(DomElements.inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    DomElements.containerApp.style.opacity = 0;
  } else {
    //Check close inputs
    openModal(
      DomElements.inputCloseUsername,
      DomElements.inputClosePin,
      'Wrong user or PIN. Try again!'
    );
  }

  DomElements.inputCloseUsername.value = DomElements.inputClosePin.value = '';
});

// Call the function to populate the select dropdown on page load
window.onload = () => {
  populateLocaleSelect();
  document
    .getElementById('localeSelect')
    .addEventListener('change', onLocaleChange);
};
createUsernames(accounts);

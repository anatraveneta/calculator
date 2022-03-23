const buttonLabels = [  'AC', '\u00B1', '\u215F', '/',
                        '7', '8', '9', '*',
                        '4', '5', '6', '-',
                        '1', '2', '3', '+',
                        '.', '0', '='];
const specialKeys = ['AC'];
const numberKeys = ['7', '8', '9',
                    '4', '5', '6',
                    '1', '2', '3',
                    '.', '0'];
const operatorKeys = ['\u00B1', '\u215F', '/',
                        '*', '-', '+', '='];
const errorArray = ['Overflow', 'Div. by zero']
const maxPlaces = 13;

let pushedButton;
let currentDisplayString;
let previousDisplayString;
let bookedOperator;

const keyBoard = document.querySelector('.buttons-container');
const display = document.querySelector('.display');

initializeButtons();

const numberButtons = document.querySelectorAll('.number-key')
const operatorButtons = document.querySelectorAll('.operator-key')
const specialButtons = document.querySelectorAll('.special-key')

resetCalc();


/* Functions */
function initializeButtons() {
    for (let calcButtonLabel of buttonLabels) {
        const key = document.createElement('button');
        key.classList.add('calc-button');
        if (calcButtonLabel === '=') key.classList.add('equal-button');
        if (specialKeys.includes(calcButtonLabel)) {
            key.classList.add('special-key');
            key.setAttribute('data-key', `special-key`);
        }
        if (numberKeys.includes(calcButtonLabel)) {
            key.classList.add('number-key');
            key.setAttribute('data-key', `number-key`);
        }
        if (operatorKeys.includes(calcButtonLabel)) {
            key.classList.add('operator-key');
            key.setAttribute('data-key', `operator-key`);
        }
        key.textContent = calcButtonLabel;
        key.setAttribute('id', `${calcButtonLabel}`);
        keyBoard.appendChild(key);
    }
}

function clickButton(e) {
    pushedButton.key = this.getAttribute('id');
    pushedButton.type = this.getAttribute('data-key');
    switch (pushedButton.type) {
        case 'number-key':
            pushNumber();
            break;
        case 'operator-key':
            pushOperator();
            break;
        default:
            resetCalc();
    }
}

function pushNumber() {
    if (pushedButton.key == '.') {
            if (!currentDisplayString.includes('.')) {
                currentDisplayString += pushedButton.key;
            }
    } else {
            /* We book one place for . and one for - sign */
            if (numberDigits() >= maxPlaces - 2) return;
            if (currentDisplayString == '0') {
                currentDisplayString = pushedButton.key;
            } else {
                currentDisplayString += pushedButton.key;
            }
    }
    updateDisplay();
}

function pushOperator() {
    switch (pushedButton.key) {
        case '\u00B1':
            if (Number(currentDisplayString) == 0) return;
            if (currentDisplayString[0] == '-') {
                currentDisplayString = 
                    currentDisplayString.slice(1);
            } else {
                currentDisplayString = '-' + currentDisplayString;
            }
            parseDisplay();
            break;
        case '\u215F':
            if (Number(currentDisplayString) == 0) return;
            currentDisplayString = 1/currentDisplayString;
            parseDisplay();
            break;
        case '=':
            if (bookedOperator) operate();
            bookedOperator = '';
            previousDisplayString = currentDisplayString;
            break;
        default:
            if (bookedOperator) operate();
            bookedOperator = pushedButton.key;
            previousDisplayString = currentDisplayString;
            currentDisplayString = '0';
    }
}

function resetCalc() {
    currentDisplayString = '0';
    previousDisplayString = '';
    bookedOperator = '';
    pushedButton = {key: '', type: ''}
    parseDisplay();
    enableButtons();
}
function numberDigits() {
    if (errorArray.includes(currentDisplayString)) return 0;
    return currentDisplayString.length -
            currentDisplayString.includes('.') -
            currentDisplayString.includes('-');
}

function updateDisplay() {
    display.textContent = currentDisplayString;
}

function parseDisplay() {
    if (errorArray.includes(currentDisplayString)) {
        updateDisplay();
        return;
    }
    currentDisplayString = String(Number(currentDisplayString));
    const intPart = String(Math.floor(Math.abs(currentDisplayString)));
    let initDecLength = numberDigits() - intPart.length;
    /* We book one place for . and another for - sign */
    const maxDecLength = maxPlaces - 2 - intPart.length ;
    const decLength = Math.min(initDecLength, maxDecLength)
    if (maxDecLength < 0) {
        currentDisplayString = raiseError[0];
    } else if (currentDisplayString.slice(-1) != '.' &&
            initDecLength != decLength) {
                currentDisplayString =
                    Number(currentDisplayString).toFixed(decLength);
            }
    updateDisplay();
}

function add(a, b) {
    return a + b;
}

function substract(a,b) {
    return a - b;
}

function mutltiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b == 0) return raiseError(1);
    return a / b;
}

function operate() {
    switch(bookedOperator) {
        case '/':
            currentDisplayString = divide(previousDisplayString,
                currentDisplayString);
            parseDisplay();
            break;
        case '*':
            currentDisplayString = mutltiply(previousDisplayString,
                currentDisplayString);
            parseDisplay();
            break;
        case '-':
            currentDisplayString = substract(previousDisplayString,
                currentDisplayString);
            parseDisplay();
            break;
        case '+':
            currentDisplayString = add(Number(previousDisplayString),
                Number(currentDisplayString));
            parseDisplay();
            break;
    }
}

function raiseError(err) {
    disableButtons();
    return errorArray[err];
}

function disableButtons() {
    numberButtons.forEach(x => 
        x.removeEventListener('click', clickButton));
    operatorButtons.forEach(x => 
        x.removeEventListener('click', clickButton));
}

function enableButtons() {
    numberButtons.forEach(x => 
        x.addEventListener('click', clickButton));
    operatorButtons.forEach(x => 
        x.addEventListener('click', clickButton));
    specialButtons.forEach(x => 
        x.addEventListener('click', clickButton));
}
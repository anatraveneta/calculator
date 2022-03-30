const buttonLabels = [  'AC', '\u232B',
                        '\u00B1\u2A2F', '\u215F\u2A2F', 
                        '\u221A\u2A2F', '\u2A2F\u00B2',
                        '7', '8', '9', '/',
                        '4', '5', '6', 'x',
                        '1', '2', '3', '-',
                        '.', '0', '=', '+'];
const specialKeys = ['AC'];
const bigButtonKeys = ['AC', '\u232B'];
const numberKeys = ['7', '8', '9',
                    '4', '5', '6',
                    '1', '2', '3',
                    '.', '0', '\u232B'];
const operatorKeys = ['\u00B1\u2A2F', '\u215F\u2A2F', 
                        '\u221A\u2A2F', '\u2A2F\u00B2',
                        '/', 'x', '-', '+', '='];
const errorArray = ['Overflow', 'Div. by zero',
                    'Im. Number']
const maxPlaces = 12;

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

const enablableArray = Array.from(numberButtons).
    concat(Array.from(operatorButtons));



resetCalc();


/* Functions */
function initializeButtons() {
    for (let calcButtonLabel of buttonLabels) {
        const key = document.createElement('button');
        key.classList.add('calc-button');
        if (specialKeys.includes(calcButtonLabel)) {
            key.classList.add('special-key');
            key.setAttribute('data-key', `special-key`);
        }
        if (bigButtonKeys.includes(calcButtonLabel))
            key.classList.add('big-button');
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

function pushKey(e) {
    const key = e.key;
    const keyCode = e.keyCode;
    const shiftKey = e.shiftKey;
    if (numberKeys.includes(key)) { //0 numbers
        pushedButton.key = key;
        pushedButton.type = 'number-key';
    } else if (operatorKeys.includes(key)) { //1 operators
        pushedButton.key = key;
        pushedButton.type = 'operator-key';
    } else if (keyCode == 88 || key == '*') { //2 multiply 
        pushedButton.key = 'x';
        pushedButton.type = 'operator-key';
    } else if (shiftKey && keyCode == 50) { //3 square
        pushedButton.key = buttonLabels[5];
        pushedButton.type = 'operator-key';
    } else if (keyCode == 8) { //7 backspace
        pushedButton.key = buttonLabels[1];
        pushedButton.type = 'number-key';
    } else if (keyCode == 46 || keyCode == 27) { //8 AC
        pushedButton.key = buttonLabels[0];
        pushedButton.type = 'special-key';
    } else if (keyCode == 13) { //9 =
        pushedButton.key = '=';
        pushedButton.type = 'operator-key';
    } else if (keyCode == 9) {
        e.preventDefault();
        return;
    } else {
        return;
    }
    switchAction();
}

function clickButton(e) {
    if (e.pointerId == -1) {
        this.blur();
        return;
    }
    pushedButton.key = this.getAttribute('id');
    pushedButton.type = this.getAttribute('data-key');
    this.blur();
    switchAction();
}

function switchAction() {
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
    switch (pushedButton.key) {
        case '.':
            if (!currentDisplayString.includes('.'))
                currentDisplayString += pushedButton.key;
            break;
        case buttonLabels[1]: // Backspace
            if (currentDisplayString == '0') return;
            currentDisplayString = currentDisplayString.slice(0, -1);
            if (currentDisplayString.length == 0)
                currentDisplayString = '0';
            break;
        default:
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
        case buttonLabels[2]: // +/- x
            if (Number(currentDisplayString) == 0) return;
            if (currentDisplayString[0] == '-') {
                currentDisplayString = 
                    currentDisplayString.slice(1);
            } else {
                currentDisplayString = '-' + currentDisplayString;
            }
            parseDisplay();
            break;
        case buttonLabels[3]: // 1/x
            if (Number(currentDisplayString) == 0) {
                currentDisplayString = raiseError(1);
                updateDisplay();
                return;
            }
            currentDisplayString = 1/currentDisplayString;
            parseDisplay();
            break;
        case buttonLabels[4]: // sqrt(x)
            if (Number(currentDisplayString) == 0) return;
            currentDisplayString = sqrt(currentDisplayString);
            parseDisplay();
            break;
        case buttonLabels[5]: // x^2
            if (Number(currentDisplayString) == 0) return;
            currentDisplayString = square(currentDisplayString);
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
        currentDisplayString = raiseError(0);
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

function sqrt(a) {
    if (a < 0) return raiseError(2);
    return a**.5;
}

function square(a) {
    return a**2;
}

function operate() {
    switch(bookedOperator) {
        case '/':
            currentDisplayString = divide(previousDisplayString,
                currentDisplayString);
            parseDisplay();
            break;
        case 'x':
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
    for (let x of enablableArray) {
        x.removeEventListener('click', clickButton);
        x.setAttribute('style', 'pointer-events: none;');
    }
    window.removeEventListener('keydown', pushKey);
}

function enableButtons() {
    for(let x of enablableArray) {
        x.addEventListener('click', clickButton);
        x.setAttribute('style', 'pointer-events: auto;');
    }
    window.addEventListener('keydown', pushKey);
    specialButtons.forEach(x => 
        x.addEventListener('click', clickButton));
}
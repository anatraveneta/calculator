
const buttonLabels = [  '+', '-', '*', '/',
                        '7', '8', '9', 'AC',
                        '4', '5', '6', 'C',
                        '1', '2', '3', '.',
                        '0', '='];

const keyBoard = document.querySelector('.buttons-container')

initializeButtons();

/* Functions */
function initializeButtons() {
    for (let calcButtonLabel of buttonLabels) {
        const key = document.createElement('button');
        key.classList.add('calc-button');
        key.textContent = calcButtonLabel;
        key.setAttribute('id', `button${calcButtonLabel}`);
        key.addEventListener('click', clickButton);
        keyBoard.appendChild(key);
    }
}

function clickButton(e) {
    console.log(this.getAttribute('id'));
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
    return a / b;
}

function operate(a, b, operator) {
    return operator(a, b);
}

const numbersContainer = document.querySelector('.numbers-container');
const generateBtn = document.getElementById('generate-btn');

function generateNumbers() {
    numbersContainer.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    for (const number of numbers) {
        const numberEl = document.createElement('div');
        numberEl.classList.add('number');
        numberEl.textContent = number;
        numberEl.style.backgroundColor = getNumberColor(number);
        numbersContainer.appendChild(numberEl);
    }
}

function getNumberColor(number) {
    if (number <= 10) {
        return '#f9c942'; // Yellow
    } else if (number <= 20) {
        return '#3f88c5'; // Blue
    } else if (number <= 30) {
        return '#ff6b6b'; // Red
    } else if (number <= 40) {
        return '#51cf66'; // Green
    } else {
        return '#999'; // Gray
    }
}

generateBtn.addEventListener('click', generateNumbers);

// Initial generation
generateNumbers();

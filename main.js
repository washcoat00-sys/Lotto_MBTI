
// Lotto Number Generator
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
    if (number <= 10) return '#f9c942'; // Yellow
    if (number <= 20) return '#3f88c5'; // Blue
    if (number <= 30) return '#ff6b6b'; // Red
    if (number <= 40) return '#51cf66'; // Green
    return '#999'; // Gray
}

if (generateBtn) {
    generateBtn.addEventListener('click', generateNumbers);
    generateNumbers(); // Initial generation
}

// MBTI Assessment
const mbtiSubmitBtn = document.getElementById('mbti-submit-btn');
const mbtiResultEl = document.getElementById('mbti-result');

const mbtiDescriptions = {
    ISTJ: 'The Inspector - Responsible, sincere, and analytical. They are practical and matter-of-fact.',
    ISFJ: 'The Protector - Warm, considerate, and gentle. They are devoted and protective of their loved ones.',
    INFJ: 'The Advocate - Insightful, creative, and inspiring. They seek meaning and connection in ideas.',
    INTJ: 'The Architect - Imaginative and strategic thinkers, with a plan for everything.',
    ISTP: 'The Crafter - Bold and practical experimenters, masters of all kinds of tools.',
    ISFP: 'The Artist - Flexible and charming artists, always ready to explore and experience something new.',
    INFP: 'The Mediator - Poetic, kind, and altruistic people, always eager to help a good cause.',
    INTP: 'The Thinker - Innovative inventors with an unquenchable thirst for knowledge.',
    ESTP: 'The Dynamo - Smart, energetic, and very perceptive people, who truly enjoy living on the edge.',
    ESFP: 'The Performer - Spontaneous, energetic, and enthusiastic people - life is never boring around them.',
    ENFP: 'The Champion - Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.',
    ENTP: 'The Debater - Smart and curious thinkers who cannot resist an intellectual challenge.',
    ESTJ: 'The Executive - Excellent administrators, unsurpassed at managing things - or people.',
    ESFJ: 'The Consul - Extraordinarily caring, social and popular people, always eager to help.',
    ENFJ: 'The Giver - Charismatic and inspiring leaders, able to mesmerize their listeners.',
    ENTJ: 'The Commander - Bold, imaginative and strong-willed leaders, always finding a way - or making one.'
};

function calculateMbti() {
    const answers = {
        E: 0, I: 0, S: 0, N: 0,
        T: 0, F: 0, J: 0, P: 0
    };

    const questions = document.querySelectorAll('#mbti-questions .question');
    let allAnswered = true;

    for (let i = 1; i <= questions.length; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) {
            answers[selected.value]++;
        } else {
            allAnswered = false;
            break;
        }
    }

    if (!allAnswered) {
        mbtiResultEl.textContent = 'Please answer all questions.';
        return;
    }

    let result = '';
    result += answers.E > answers.I ? 'E' : 'I';
    result += answers.S > answers.N ? 'S' : 'N';
    result += answers.T > answers.F ? 'T' : 'F';
    result += answers.J > answers.P ? 'J' : 'P';

    mbtiResultEl.innerHTML = `
        <p>Your MBTI type is: <strong>${result}</strong></p>
        <p>${mbtiDescriptions[result] || ''}</p>
    `;
}

if (mbtiSubmitBtn) {
    mbtiSubmitBtn.addEventListener('click', calculateMbti);
}

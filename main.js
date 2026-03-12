
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
    ISTJ: '청렴결백한 논리주의자 - 사실에 근거하여 사고하며 이들의 행동이나 결정은 매우 현실적입니다.',
    ISFJ: '용감한 수호자 - 소중한 이들을 수호하는 데 헌신적이며 따뜻하고 다정합니다.',
    INFJ: '선의의 옹호자 - 조용하고 신비로우며 샘솟는 영감으로 지칠 줄 모르는 이상주의자입니다.',
    INTJ: '용의주도한 전략가 - 상상력이 풍부하며 철두철미한 계획을 세우는 전략가입니다.',
    ISTP: '만능 재주꾼 - 대담하고 현실적인 성향으로 다양한 도구 사용에 능숙합니다.',
    ISFP: '호기심 많은 예술가 - 항시 새로운 것을 찾아 시도하거나 도전할 준비가 되어 있는 융통성 있는 예술가입니다.',
    INFP: '열정적인 중재자 - 최악의 상황이나 악한 사람에게서도 좋은 면만을 바라보며 긍정적이고 더 나은 상황을 만들고자 노력합니다.',
    INTP: '논리적인 사색가 - 끊임없이 새로운 지식에 목말라 하는 혁신가입니다.',
    ESTP: '모험을 즐기는 사업가 - 벼랑 끝의 아슬아슬한 삶을 진정으로 즐길 줄 아는 이들로 명석한 두뇌와 에너지, 그리고 뛰어난 직관력을 가지고 있습니다.',
    ESFP: '자유로운 영혼의 연예인 - 주위에 있으면 인생이 지루할 새가 없을 정도로 즉흥적이고 열정과 에너지가 넘칩니다.',
    ENFP: '재기발랄한 활동가 - 창의적이고 항상 웃을 거리를 찾아다니는 활력 넘치는 소유자입니다.',
    ENTP: '뜨거운 논쟁을 즐기는 변론가 - 지적인 도전을 두려워하지 않는 똑똑한 호기심쟁이입니다.',
    ESTJ: '엄격한 관리자 - 사물이나 사람을 관리하는 데 타의 추종을 불허하는 뛰어난 실력을 갖추었습니다.',
    ESFJ: '사교적인 외교관 - 타인을 향한 세심한 관심과 사교적인 성향으로 사람들 내에서 인기가 많습니다.',
    ENFJ: '정의로운 사회운동가 - 넘치는 카리스마와 영향력으로 청중을 압도하는 리더입니다.',
    ENTJ: '대담한 통솔자 - 크고 작은 난관을 헤쳐나가는 데 있어 그들만의 기발한 방법이나 해결책을 찾는 리더입니다.'
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
        mbtiResultEl.textContent = '모든 질문에 답해주세요.';
        return;
    }

    let result = '';
    result += answers.E > answers.I ? 'E' : 'I';
    result += answers.S > answers.N ? 'S' : 'N';
    result += answers.T > answers.F ? 'T' : 'F';
    result += answers.J > answers.P ? 'J' : 'P';

    mbtiResultEl.innerHTML = `
        <p>당신의 MBTI 유형은: <strong>${result}</strong></p>
        <p>${mbtiDescriptions[result] || ''}</p>
    `;
}

if (mbtiSubmitBtn) {
    mbtiSubmitBtn.addEventListener('click', calculateMbti);
}

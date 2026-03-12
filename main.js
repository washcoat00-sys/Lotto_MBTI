
// Navigation Logic
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a, .footer-links a, .hero-btns a');
    const sections = document.querySelectorAll('.content-section');

    function showSection(id) {
        const targetId = id.replace('#', '');
        sections.forEach(section => {
            section.style.display = section.id === targetId ? 'block' : 'none';
        });
        window.scrollTo(0, 0);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                showSection(href);
                // Update URL hash without jumping
                history.pushState(null, null, href);
            }
        });
    });

    // Initial load based on hash
    const initialHash = window.location.hash || '#home';
    showSection(initialHash);
});

// Lotto Number Generator
const numbersContainer = document.querySelector('.numbers-container');
const generateBtn = document.getElementById('generate-btn');

function generateNumbers() {
    if (!numbersContainer) return;
    numbersContainer.innerHTML = '';
    
    // Generate 5 sets of numbers
    for (let i = 0; i < 5; i++) {
        const setWrapper = document.createElement('div');
        setWrapper.classList.add('number-set');
        
        const setLabel = document.createElement('div');
        setLabel.classList.add('set-label');
        setLabel.textContent = `${String.fromCharCode(65 + i)} 세트`;
        setWrapper.appendChild(setLabel);

        const ballsContainer = document.createElement('div');
        ballsContainer.classList.add('balls-container');

        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        for (const number of sortedNumbers) {
            const numberEl = document.createElement('div');
            numberEl.classList.add('number');
            numberEl.textContent = number;
            numberEl.style.backgroundColor = getNumberColor(number);
            ballsContainer.appendChild(numberEl);
        }
        
        setWrapper.appendChild(ballsContainer);
        numbersContainer.appendChild(setWrapper);
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
    generateNumbers();
}

// MBTI Assessment
const mbtiSubmitBtn = document.getElementById('mbti-submit-btn');
const mbtiResultEl = document.getElementById('mbti-result');

const mbtiDescriptions = {
    ISTJ: {
        title: '청렴결백한 논리주의자',
        desc: '사실에 근거하여 사고하며 이들의 행동이나 결정은 매우 현실적입니다. 신중하고 조용하며 집중력이 강합니다. 한번 시작한 일은 끝까지 완수하려는 책임감이 매우 돋보이는 유형입니다.',
        advice: '완벽주의적인 성향 때문에 자신을 너무 몰아세울 수 있습니다. 가끔은 여유를 가져보세요.'
    },
    ISFJ: {
        title: '용감한 수호자',
        desc: '소중한 이들을 수호하는 데 헌신적이며 따뜻하고 다정합니다. 타인의 감정을 잘 살피고 협력적인 태도를 보입니다. 꼼꼼하고 믿음직스러운 성격으로 주변 사람들에게 신뢰를 얻습니다.',
        advice: '자신의 필요보다 타인의 필요를 먼저 생각하는 경향이 있습니다. 가끔은 "아니오"라고 말하는 연습이 필요합니다.'
    },
    INFJ: {
        title: '선의의 옹호자',
        desc: '조용하고 신비로우며 샘솟는 영감으로 지칠 줄 모르는 이상주의자입니다. 깊은 통찰력을 가지고 있으며 사람들에게 영감을 주는 능력이 탁월합니다. 자신의 신념이 확고합니다.',
        advice: '완벽한 세상을 꿈꾸다 보면 현실에 실망할 수 있습니다. 작은 성취에도 만족하는 법을 배워보세요.'
    },
    INTJ: {
        title: '용의주도한 전략가',
        desc: '상상력이 풍부하며 철두철미한 계획을 세우는 전략가입니다. 독립심이 강하고 비판적인 사고를 즐깁니다. 목표를 달성하기 위해 논리적이고 효율적인 방법을 찾아내는 데 능숙합니다.',
        advice: '지나치게 논리적인 태도가 타인에게는 차갑게 느껴질 수 있습니다. 공감의 표현을 늘려보세요.'
    },
    ISTP: {
        title: '만능 재주꾼',
        desc: '대담하고 현실적인 성향으로 다양한 도구 사용에 능숙합니다. 냉철한 이성과 왕성한 호기심을 가지고 세상을 탐구합니다. 적응력이 뛰어나며 필요할 때만 에너지를 쏟는 효율주의자입니다.',
        advice: '계획을 세우는 것보다 즉흥적인 것을 선호하여 마감이 닥쳤을 때 힘들어질 수 있습니다. 미리 준비하는 습관을 가져보세요.'
    },
    ISFP: {
        title: '호기심 많은 예술가',
        desc: '항시 새로운 것을 찾아 시도하거나 도전할 준비가 되어 있는 융통성 있는 예술가입니다. 말보다는 행동으로 자신의 따뜻함을 표현합니다. 현재의 순간을 즐기며 미적 감각이 뛰어납니다.',
        advice: '갈등을 피하려다 보니 본인의 의견을 제대로 전달하지 못할 때가 있습니다. 자신의 권리를 주장해보세요.'
    },
    INFP: {
        title: '열정적인 중재자',
        desc: '최악의 상황이나 악한 사람에게서도 좋은 면만을 바라보며 긍정적이고 더 나은 상황을 만들고자 노력합니다. 내성적이고 조용해 보이지만 내면에는 뜨거운 열정이 가득합니다.',
        advice: '현실적인 제약 때문에 이상을 포기해야 할 때 크게 좌절할 수 있습니다. 현실과 이상의 조화를 찾아보세요.'
    },
    INTP: {
        title: '논리적인 사색가',
        desc: '끊임없이 새로운 지식에 목말라 하는 혁신가입니다. 비논리적인 것을 참지 못하며 지적인 도전을 즐깁니다. 조용하고 과묵하지만 관심 분야에 대해서는 열정적으로 대화합니다.',
        advice: '생각만 하다가 행동으로 옮기지 못하는 경우가 많습니다. "일단 시작하기" 전략을 활용해보세요.'
    },
    ESTP: {
        title: '모험을 즐기는 사업가',
        desc: '벼랑 끝의 아슬아슬한 삶을 진정으로 즐길 줄 아는 이들로 명석한 두뇌와 에너지, 그리고 뛰어난 직관력을 가지고 있습니다. 활동적이고 즉흥적인 성향이 강합니다.',
        advice: '자극적인 것을 쫓다 보니 일상의 사소한 즐거움을 놓칠 수 있습니다. 차분하게 명상하는 시간을 가져보세요.'
    },
    ESFP: {
        title: '자유로운 영혼의 연예인',
        desc: '주위에 있으면 인생이 지루할 새가 없을 정도로 즉흥적이고 열정과 에너지가 넘칩니다. 사람들과 어울리는 것을 좋아하며 분위기 메이커 역할을 톡톡히 합니다.',
        advice: '현재의 즐거움에만 집중하다 보니 미래에 대한 준비가 소홀할 수 있습니다. 저축이나 계획적인 삶을 시도해보세요.'
    },
    ENFP: {
        title: '재기발랄한 활동가',
        desc: '창의적이고 항상 웃을 거리를 찾아다니는 활력 넘치는 소유자입니다. 자유로운 영혼이며 사람들과 깊은 감정적 유대를 맺는 것을 중요하게 생각합니다. 열정적이고 상상력이 풍부합니다.',
        advice: '흥미가 금방 식어 마무리가 부족할 수 있습니다. 하나의 일을 끝까지 마치는 끈기를 길러보세요.'
    },
    ENTP: {
        title: '뜨거운 논쟁을 즐기는 변론가',
        desc: '지적인 도전을 두려워하지 않는 똑똑한 호기심쟁이입니다. 타성이 젖은 방식에 의문을 제기하며 새로운 해결책을 제안하는 것을 즐깁니다. 재치 있고 박학다식합니다.',
        advice: '논쟁을 즐기다 보니 의도치 않게 타인에게 상처를 줄 수 있습니다. 상대방의 감정도 고려하며 대화해보세요.'
    },
    ESTJ: {
        title: '엄격한 관리자',
        desc: '사물이나 사람을 관리하는 데 타의 추종을 불허하는 뛰어난 실력을 갖추었습니다. 실질적이고 현실적이며 목표 지향적입니다. 질서와 규칙을 중요시하며 리더십이 뛰어납니다.',
        advice: '변화를 받아들이는 데 다소 시간이 걸릴 수 있습니다. 다른 사람의 의견에도 귀를 기울여보세요.'
    },
    ESFJ: {
        title: '사교적인 외교관',
        desc: '타인을 향한 세심한 관심과 사교적인 성향으로 사람들 내에서 인기가 많습니다. 조화를 중요하게 생각하며 타인을 돕는 일에 앞장섭니다. 책임감이 강하고 협력적입니다.',
        advice: '타인의 비판에 매우 예민할 수 있습니다. 모든 사람을 만족시킬 수 없다는 사실을 인정해보세요.'
    },
    ENFJ: {
        title: '정의로운 사회운동가',
        desc: '넘치는 카리스마와 영향력으로 청중을 압도하는 리더입니다. 사람들을 이끄는 능력이 탁월하며 타인의 성장을 돕는 데 큰 보람을 느낍니다. 이타적이고 동정심이 많습니다.',
        advice: '타인의 문제를 자신의 문제처럼 생각하여 과도한 스트레스를 받을 수 있습니다. 적절한 거리를 유지해보세요.'
    },
    ENTJ: {
        title: '대담한 통솔자',
        desc: '크고 작은 난관을 헤쳐나가는 데 있어 그들만의 기발한 방법이나 해결책을 찾는 리더입니다. 단호하고 결단력이 있으며 장기적인 목표를 향해 추진력 있게 나아갑니다.',
        advice: '효율성만 따지다 보니 주변 사람들의 노력을 무시할 수 있습니다. 따뜻한 격려 한마디가 큰 힘이 됩니다.'
    }
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
        alert('모든 질문에 답해주세요.');
        return;
    }

    let result = '';
    result += answers.E >= answers.I ? 'E' : 'I';
    result += answers.S >= answers.N ? 'S' : 'N';
    result += answers.T >= answers.F ? 'T' : 'F';
    result += answers.J >= answers.P ? 'J' : 'P';

    const info = mbtiDescriptions[result];

    mbtiResultEl.innerHTML = `
        <div class="mbti-result-detail">
            <h3>당신의 MBTI 유형은: <span style="color:var(--primary-color)">${result}</span></h3>
            <p class="mbti-title"><strong>"${info.title}"</strong></p>
            <p class="mbti-desc">${info.desc}</p>
            <div style="background:#eef2f7; padding:1.5rem; border-radius:8px; margin-top:1.5rem;">
                <p><strong>💡 조언:</strong> ${info.advice}</p>
            </div>
            <button onclick="window.location.hash='#home'" class="btn primary" style="margin-top:2rem;">홈으로 돌아가기</button>
        </div>
    `;
    
    mbtiResultEl.scrollIntoView({ behavior: 'smooth' });
}

if (mbtiSubmitBtn) {
    mbtiSubmitBtn.addEventListener('click', calculateMbti);
}

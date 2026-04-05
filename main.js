// Navigation & Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Birth Date Input Auto-focus & Filtering
    const birthYear = document.getElementById('birth-year');
    const birthMonth = document.getElementById('birth-month');
    const birthDay = document.getElementById('birth-day');

    if (birthYear && birthMonth && birthDay) {
        const handleInput = (e, nextEl, maxLength) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            if (e.target.value.length >= maxLength && nextEl) {
                nextEl.focus();
            }
        };

        birthYear.addEventListener('input', (e) => handleInput(e, birthMonth, 4));
        birthMonth.addEventListener('input', (e) => handleInput(e, birthDay, 2));
        birthDay.addEventListener('input', (e) => handleInput(e, null, 2));
    }

    // 2. Tab Logic (Fortune Page)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const targetContent = document.getElementById(target);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    }

    // 3. Initialize Features based on presence of elements
    if (document.getElementById('get-fortune-btn')) initFortune();
    if (document.querySelector('.numbers-container')) initLotto();
    if (document.getElementById('mbti-questions')) initMbti();
});

// --- Fortune Logic ---
const dailyFortuneData = [
    { title: "성공의 기운이 가득한 날", text: "오늘은 계획했던 일을 실행에 옮기기에 최적의 날입니다. 당신의 추진력이 빛을 발하며 주변의 도움도 따를 것입니다. 자신감을 가지고 전진하세요.", color: "하늘색", number: "7", place: "카페" },
    { title: "안정과 평온이 찾아오는 날", text: "바쁜 일상에서 벗어나 잠시 휴식을 취하기 좋은 날입니다. 서두르기보다는 천천히 주변을 돌아보세요. 의외의 곳에서 마음의 안정을 찾을 수 있습니다.", color: "연록색", number: "3", place: "공원" },
    { title: "새로운 인연이 기대되는 날", text: "대인관계 운이 상승하고 있습니다. 모임이나 행사에서 좋은 인연을 만날 가능성이 높습니다. 열린 마음으로 사람들을 대하면 긍정적인 에너지를 얻게 됩니다.", color: "분홍색", number: "9", place: "서점" },
    { title: "지혜로운 선택이 필요한 날", text: "중요한 결정을 앞두고 있다면 서두르지 마세요. 이성적으로 판단하고 신뢰할 수 있는 사람의 조언을 구하는 것이 좋습니다. 신중함이 큰 화를 면하게 해줄 것입니다.", color: "남색", number: "5", place: "도서관" },
    { title: "금전운이 상승하는 행운의 날", text: "생각지 못한 수익이 발생하거나 유리한 경제적 기회가 찾아올 수 있습니다. 다만 과한 욕심은 금물이니 적절한 선에서 만족할 줄 아는 지혜가 필요합니다.", color: "황금색", number: "8", place: "백화점" },
    { title: "도전과 열정의 에너지가 넘치는 날", text: "새로운 취미나 학습을 시작하기에 아주 좋은 기운입니다. 당신의 호기심이 창의적인 아이디어로 이어질 것입니다. 실패를 두려워하지 말고 시도해보세요.", color: "빨간색", number: "1", place: "스포츠 센터" },
    { title: "겸손과 배려가 필요한 날", text: "자신의 주장만 내세기보다 타인의 의견을 경청하는 태도가 운을 높여줍니다. 작은 양보가 더 큰 보답으로 돌아올 것입니다. 언행에 주의하세요.", color: "보라색", number: "4", place: "조용한 식당" },
    { title: "집중력이 최고조에 달하는 날", text: "밀린 업무나 공부를 처리하기에 완벽한 날입니다. 집중력이 높아져 효율적으로 일을 끝낼 수 있습니다. 저녁에는 자신을 위한 보상을 준비해보세요.", color: "하얀색", number: "2", place: "내 방" }
];

const yearlyFortuneData = [
    { animal: "쥐띠", text: "2026년은 그동안 뿌려놓은 씨앗이 결실을 맺는 시기입니다. 전반적인 기운이 상승하며 특히 하반기에 문서운과 승진운이 따릅니다.", money: "안정적인 흐름이나 무리한 투자는 피하십시오.", love: "기존 관계가 더욱 돈독해지거나 평생의 동반자를 만날 수 있습니다." },
    { animal: "소띠", text: "끈기와 성실함이 빛을 발하는 한 해입니다. 어려운 고비가 있더라도 묵묵히 나아가면 결국 큰 성취를 이룰 수 있는 운세입니다.", money: "지출 관리에 신경 써야 하는 시기입니다.", love: "가족과의 화합에 힘쓰면 외부의 일도 잘 풀립니다." },
    { animal: "호랑이띠", text: "역동적인 변화의 물결이 몰려오는 해입니다. 새로운 사업이나 직종으로의 전환이 유리하며, 자신감을 가지고 도전하기에 좋습니다.", money: "공격적인 투자보다는 실속을 챙기는 전략이 필요합니다.", love: "자신의 주장을 조금 굽히면 갈등이 해소됩니다." },
    { animal: "토끼띠", text: "주변의 도움으로 평탄한 한 해를 보내게 됩니다. 인간관계가 확장되며 사교적인 활동에서 많은 이득을 얻을 수 있는 시기입니다.", money: "뜻밖의 횡재수보다는 노력에 의한 결실이 큽니다.", love: "솔로라면 매력이 발산되어 많은 인기를 얻게 됩니다." },
    { animal: "용띠", text: "구름 위를 날아오르는 기상을 가진 해입니다. 명예가 드높아지고 리더십을 발휘할 기회가 많아집니다. 다만 오만함을 경계해야 합니다.", money: "큰 돈이 들어오나 나가는 돈도 많으니 관리가 핵심입니다.", love: "서로에 대한 신뢰를 확인하는 중요한 한 해입니다." },
    { animal: "뱀띠", text: "지혜롭게 상황을 판단하여 실속을 챙기는 한 해입니다. 소란스러운 외부 상황에 휘둘리지 않고 자신의 길을 가면 큰 이득을 봅니다.", money: "저축과 안전 자산 위주로 운영하는 것이 좋습니다.", love: "차분한 대화를 통해 오해를 풀고 깊은 관계가 됩니다." },
    { animal: "말띠", text: "2026년의 주인공으로서 활력이 넘칩니다. 모든 일이 자신의 의지대로 풀리는 경향이 있으나, 과유불급임을 명심하십시오.", money: "자신을 위한 투자가 훗날 큰 수익으로 돌아옵니다.", love: "정열적인 사랑이 찾아오나 금방 식지 않도록 주의가 필요합니다." },
    { animal: "양띠", text: "평화롭고 온화한 기운이 가정과 직장에 깃듭니다. 예술적인 영감이 뛰어나 창작 활동을 하는 이들에게 최상의 한 해입니다.", money: "꾸준한 수익이 보장되며 재물운이 안정적입니다.", love: "따뜻한 배려가 상대방의 마음을 움직입니다." },
    { animal: "원숭이띠", text: "기발한 아이디어와 재치로 위기를 기회로 바꾸는 해입니다. 사교 능력이 극대화되어 협상이나 영업에서 큰 성과를 냅니다.", money: "순간의 판단력이 재산 증식의 포인트가 됩니다.", love: "유쾌한 만남이 이어지며 즐거운 시간을 보냅니다." },
    { animal: "닭띠", text: "철저한 준비와 계획이 결실을 맺는 시기입니다. 규칙적인 생활과 성실함이 큰 성공을 가져다주는 열쇠가 될 것입니다.", money: "계획성 있는 소비와 투자가 필요한 시점입니다.", love: "예의를 갖춘 태도가 상대에게 신뢰를 줍니다." },
    { animal: "개띠", text: "신의와 성실함으로 주변의 신망을 얻는 해입니다. 어려운 상황에서도 당신을 돕는 이들이 나타나 위기를 극복하게 됩니다.", money: "동업보다는 단독으로 추진하는 일이 유리합니다.", love: "한결같은 마음이 사랑의 결실을 맺게 합니다." },
    { animal: "돼지띠", text: "풍요와 결실의 기운이 가득한 한 해입니다. 노력한 만큼, 아니 그 이상의 보상을 받을 수 있는 축복받은 운세입니다.", money: "재물이 마르지 않으며 곳간이 채워지는 시기입니다.", love: "마음의 평화를 나누는 따뜻한 연애가 가능합니다." }
];

const zodiacFortuneData = [
    { name: "양자리", date: "3/21~4/19", icon: "♈", text: "오늘은 개척자 정신이 빛을 발하는 날입니다. 새로운 아이디어가 있다면 망설이지 말고 제안해보세요.", advice: "자신의 직관을 믿고 첫 발을 내딛는 용기가 필요합니다." },
    { name: "황소자리", date: "4/20~5/20", icon: "♉", text: "꾸준함이 최고의 무기입니다. 당장의 성과가 보이지 않더라도 흔들리지 말고 본인의 속도를 유지하세요.", advice: "인내는 쓰지만 그 열매는 매우 달콤할 것입니다." },
    { name: "쌍둥이자리", date: "5/21~6/21", icon: "♊", text: "정보력이 큰 자산이 되는 날입니다. 주변의 소식에 귀를 기울이면 뜻밖의 유익한 정보를 얻을 수 있습니다.", advice: "유연한 사고방식이 복잡한 문제를 해결해줄 것입니다." },
    { name: "게자리", date: "6/22~7/22", icon: "♋", text: "감수성이 예민해질 수 있는 날입니다. 주변의 감정에 휩쓸리기보다 본인의 내면을 돌보는 시간을 가지세요.", advice: "따뜻한 차 한 잔과 함께 명상을 추천합니다." },
    { name: "사자자리", date: "7/23~8/22", icon: "♌", text: "당신의 존재감이 뚜렷해지는 날입니다. 리더십을 발휘할 상황이 생긴다면 자신 있게 주도해보세요.", advice: "칭찬은 고래도 춤추게 합니다. 주변에 격려를 아끼지 마세요." },
    { name: "처녀자리", date: "8/23~9/23", icon: "♍", text: "꼼꼼한 분석과 정리가 운을 높여줍니다. 흐트러진 계획이나 서류를 점검하기에 아주 좋은 타이밍입니다.", advice: "작은 실수가 큰 차이를 만듭니다. 디테일에 신경 쓰세요." },
    { name: "천칭자리", date: "9/24~10/22", icon: "♎", text: "균형과 조화가 핵심입니다. 대립하는 두 의견 사이에서 중재자 역할을 훌륭히 수행할 수 있습니다.", advice: "공정함이 당신의 가치를 더욱 높여줄 것입니다." },
    { name: "전갈자리", date: "10/23~11/22", icon: "♏", text: "집중력이 놀라울 정도로 향상됩니다. 파고들어야 할 문제가 있다면 오늘 끝장을 보는 것이 좋습니다.", advice: "한 우물을 깊게 파면 반드시 물이 나옵니다." },
    { name: "사수자리", date: "11/23~12/24", icon: "♐", text: "자유로운 영혼이 되어 넓은 세상을 바라보세요. 일상의 단조로움에서 벗어날 때 새로운 기운이 찾아옵니다.", advice: "여행 계획을 세우거나 낯선 길로 퇴근해보세요." },
    { name: "염소자리", date: "12/25~1/19", icon: "♑", text: "책임감이 강조되는 날입니다. 맡은 바 임무를 성실히 수행하면 윗사람으로부터 큰 신뢰를 얻게 됩니다.", advice: "기본에 충실한 것이 가장 빠른 지름길입니다." },
    { name: "물병자리", date: "1/20~2/18", icon: "♒", text: "혁신적인 생각과 창의성이 폭발합니다. 고정관념에서 벗어나 독특한 관점으로 세상을 바라보세요.", advice: "타인의 시선에 구애받지 말고 개성을 뽐내보세요." },
    { name: "물고기자리", date: "2/19~3/20", icon: "♓", text: "공감 능력이 극대화되어 주변 사람들에게 큰 위로가 됩니다. 당신의 선의가 복이 되어 돌아올 것입니다.", advice: "나눔을 통해 더 큰 마음의 풍요를 느껴보세요." }
];

function initFortune() {
    const getFortuneBtn = document.getElementById('get-fortune-btn');
    if (getFortuneBtn) {
        getFortuneBtn.addEventListener('click', updateFortune);
    }
}

function updateFortune() {
    const yearEl = document.getElementById('birth-year');
    const monthEl = document.getElementById('birth-month');
    const dayEl = document.getElementById('birth-day');
    const fortuneTabs = document.getElementById('fortune-tabs');

    if (!yearEl || !monthEl || !dayEl) return;

    const year = yearEl.value;
    const month = monthEl.value;
    const day = dayEl.value;

    if (!year || !month || !day) {
        alert('생년월일을 모두 입력해주세요.');
        return;
    }

    const birthYear = parseInt(year);
    const birthMonth = parseInt(month);
    const birthDay = parseInt(day);

    if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
        alert('올바른 생년월일을 입력해주세요.');
        return;
    }

    const today = new Date().toDateString();
    const seedString = today + year + month + day;
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) seed += seedString.charCodeAt(i);

    const daily = dailyFortuneData[seed % dailyFortuneData.length];
    document.getElementById('fortune-title').textContent = daily.title;
    document.getElementById('fortune-text').textContent = daily.text;
    
    const renderStars = (s) => "★".repeat((s % 5) + 1) + "☆".repeat(4 - (s % 5));
    document.getElementById('money-score').textContent = renderStars(seed);
    document.getElementById('love-score').textContent = renderStars(seed + 1);
    document.getElementById('work-score').textContent = renderStars(seed + 2);
    document.getElementById('health-score').textContent = renderStars(seed + 3);
    
    document.getElementById('lucky-color').textContent = daily.color;
    document.getElementById('lucky-number').textContent = daily.number;
    document.getElementById('lucky-place').textContent = daily.place;

    const animalIndex = (birthYear - 4) % 12;
    const yearly = yearlyFortuneData[animalIndex];
    document.getElementById('yearly-animal-info').textContent = `[ ${yearly.animal} ] 띠에 해당하는 2026년 운세입니다.`;
    document.getElementById('yearly-text').textContent = yearly.text;
    document.getElementById('yearly-money-text').textContent = yearly.money;
    document.getElementById('yearly-love-text').textContent = yearly.love;

    const zodiacIndex = calculateZodiac(birthMonth, birthDay);
    const zodiac = zodiacFortuneData[zodiacIndex];
    document.getElementById('zodiac-icon').textContent = zodiac.icon;
    document.getElementById('zodiac-name').textContent = `${zodiac.name} (${zodiac.date})`;
    document.getElementById('zodiac-text').textContent = zodiac.text;
    document.getElementById('zodiac-advice-text').textContent = zodiac.advice;

    if (fortuneTabs) {
        fortuneTabs.style.display = 'block';
        fortuneTabs.scrollIntoView({ behavior: 'smooth' });
    }
}

function calculateZodiac(month, day) {
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 0;
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 1;
    if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return 2;
    if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return 3;
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 4;
    if ((month == 8 && day >= 23) || (month == 9 && day <= 23)) return 5;
    if ((month == 9 && day >= 24) || (month == 10 && day <= 22)) return 6;
    if ((month == 10 && day >= 23) || (month == 11 && day <= 22)) return 7;
    if ((month == 11 && day >= 23) || (month == 12 && day <= 24)) return 8;
    if ((month == 12 && day >= 25) || (month == 1 && day <= 19)) return 9;
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 10;
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 11;
    return 0;
}

// --- Lotto Logic ---
function initLotto() {
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateNumbers);
        generateNumbers();
    }
}

function generateNumbers() {
    const numbersContainer = document.querySelector('.numbers-container');
    if (!numbersContainer) return;
    numbersContainer.innerHTML = '';
    
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
            numbers.add(Math.floor(Math.random() * 45) + 1);
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
    if (number <= 10) return '#f9c942';
    if (number <= 20) return '#3f88c5';
    if (number <= 30) return '#ff6b6b';
    if (number <= 40) return '#51cf66';
    return '#999';
}

// --- MBTI Logic ---
const mbtiDescriptions = {
    ISTJ: { title: '청렴결백한 논리주의자', desc: '사실에 근거하여 사고하며 현실적이고 신중합니다.', advice: '가끔은 완벽주의를 내려놓고 여유를 가져보세요.' },
    ISFJ: { title: '용감한 수호자', desc: '소중한 이들을 수호하는 데 헌신적이며 따뜻합니다.', advice: '자신의 필요를 먼저 챙기는 연습을 해보세요.' },
    INFJ: { title: '선의의 옹호자', desc: '조용하고 신비로우며 샘솟는 영감으로 지칠 줄 모르는 이상주의자입니다.', advice: '작은 성취에도 만족하는 법을 배워보세요.' },
    INTJ: { title: '용의주도한 전략가', desc: '상상력이 풍부하며 철두철미한 계획을 세우는 전략가입니다.', advice: '공감의 표현을 조금 더 늘려보세요.' },
    ISTP: { title: '만능 재주꾼', desc: '냉철한 이성과 왕성한 호기심을 가진 효율주의자입니다.', advice: '미리 준비하는 습관을 가져보세요.' },
    ISFP: { title: '호기심 많은 예술가', desc: '항시 새로운 것을 찾아 시도하는 융통성 있는 예술가입니다.', advice: '자신의 의견을 더 적극적으로 표현해보세요.' },
    INFP: { title: '열정적인 중재자', desc: '최악의 상황에서도 좋은 면만을 바라보는 긍정적인 이들입니다.', advice: '현실과 이상의 조화를 찾아보세요.' },
    INTP: { title: '논리적인 사색가', desc: '끊임없이 새로운 지식에 목말라 하는 혁신가입니다.', advice: '생각만 하지 말고 일단 시작해보세요.' },
    ESTP: { title: '모험을 즐기는 사업가', desc: '명석한 두뇌와 뛰어난 직관력을 가진 활동가입니다.', advice: '차분하게 자신을 돌아보는 시간을 가져보세요.' },
    ESFP: { title: '자유로운 영혼의 연예인', desc: '즉흥적이고 에너지가 넘치는 분위기 메이커입니다.', advice: '계획적인 삶을 조금씩 시도해보세요.' },
    ENFP: { title: '재기발랄한 활동가', desc: '창의적이고 자유로운 영혼의 소유자입니다.', advice: '하나의 일을 끝까지 마치는 끈기를 길러보세요.' },
    ENTP: { title: '뜨거운 논쟁을 즐기는 변론가', desc: '지적인 도전을 두려워하지 않는 호기심쟁이입니다.', advice: '상대방의 감정도 고려하며 대화해보세요.' },
    ESTJ: { title: '엄격한 관리자', desc: '사물이나 사람을 관리하는 데 뛰어난 실무형 리더입니다.', advice: '타인의 의견에도 귀를 기울여보세요.' },
    ESFJ: { title: '사교적인 외교관', desc: '타인을 향한 세심한 관심으로 인기가 많은 유형입니다.', advice: '모든 사람을 만족시킬 수 없음을 인정하세요.' },
    ENFJ: { title: '정의로운 사회운동가', desc: '카리스마와 영향력으로 사람들을 이끄는 리더입니다.', advice: '타인의 문제와 적절한 거리를 유지하세요.' },
    ENTJ: { title: '대담한 통솔자', desc: '장기적인 목표를 향해 추진력 있게 나아가는 리더입니다.', advice: '주변의 노력에 따뜻한 격려를 아끼지 마세요.' }
};

let currentMbtiStep = 0;
let shuffledQuestions = [];

function initMbti() {
    const questions = Array.from(document.querySelectorAll('#mbti-questions .question'));
    if (questions.length === 0) return;

    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    const container = document.getElementById('mbti-questions');
    container.innerHTML = '';
    questions.forEach((q, index) => {
        const p = q.querySelector('p');
        p.textContent = `${index + 1}. ${p.textContent.replace(/^\d+\.\s*/, '')}`;
        q.classList.remove('active');
        container.appendChild(q);
    });

    shuffledQuestions = questions;
    currentMbtiStep = 0;
    updateMbtiUI();

    document.getElementById('mbti-next-btn')?.addEventListener('click', () => {
        const currentQ = shuffledQuestions[currentMbtiStep];
        if (!currentQ.querySelector('input[type="radio"]:checked')) {
            alert('답변을 선택해주세요.');
            return;
        }
        if (currentMbtiStep < shuffledQuestions.length - 1) {
            currentMbtiStep++;
            updateMbtiUI();
        }
    });

    document.getElementById('mbti-prev-btn')?.addEventListener('click', () => {
        if (currentMbtiStep > 0) {
            currentMbtiStep--;
            updateMbtiUI();
        }
    });

    document.getElementById('mbti-submit-btn')?.addEventListener('click', calculateMbti);

    container.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            setTimeout(() => {
                if (currentMbtiStep < shuffledQuestions.length - 1) {
                    currentMbtiStep++;
                    updateMbtiUI();
                }
            }, 400);
        }
    });
}

function updateMbtiUI() {
    shuffledQuestions.forEach((q, index) => q.classList.toggle('active', index === currentMbtiStep));
    const progress = (currentMbtiStep / shuffledQuestions.length) * 100;
    const progressEl = document.getElementById('mbti-progress');
    const textEl = document.getElementById('mbti-progress-text');
    if (progressEl) progressEl.style.width = `${progress}%`;
    if (textEl) textEl.textContent = `진행도: ${Math.round(progress)}% (${currentMbtiStep}/${shuffledQuestions.length})`;

    document.getElementById('mbti-prev-btn').style.display = currentMbtiStep > 0 ? 'inline-block' : 'none';
    document.getElementById('mbti-next-btn').style.display = currentMbtiStep < shuffledQuestions.length - 1 ? 'inline-block' : 'none';
    document.getElementById('mbti-submit-btn').style.display = currentMbtiStep === shuffledQuestions.length - 1 ? 'inline-block' : 'none';
}

function calculateMbti() {
    const answers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    let allAnswered = true;
    for (let i = 1; i <= shuffledQuestions.length; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected) answers[selected.value]++;
        else { allAnswered = false; break; }
    }

    if (!allAnswered) { alert('모든 질문에 답해주세요.'); return; }

    let result = '';
    result += answers.E >= answers.I ? 'E' : 'I';
    result += answers.S >= answers.N ? 'S' : 'N';
    result += answers.T >= answers.F ? 'T' : 'F';
    result += answers.J >= answers.P ? 'J' : 'P';

    const info = mbtiDescriptions[result];
    const resultEl = document.getElementById('mbti-result');
    if (resultEl) {
        resultEl.innerHTML = `
            <div class="mbti-result-detail">
                <h3>당신의 MBTI 유형은: <span style="color:var(--primary-color)">${result}</span></h3>
                <p class="mbti-title"><strong>"${info.title}"</strong></p>
                <p class="mbti-desc">${info.desc}</p>
                <div style="background:#eef2f7; padding:1.5rem; border-radius:8px; margin-top:1.5rem;">
                    <p><strong>💡 조언:</strong> ${info.advice}</p>
                </div>
                <a href="index.html" class="btn primary" style="margin-top:2rem;">홈으로 돌아가기</a>
            </div>
        `;
        resultEl.scrollIntoView({ behavior: 'smooth' });
    }
}

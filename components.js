const horoscopeTypes = [
    { id: 'zodiac', name: '띠별 운세' },
    { id: 'starsign', name: '별자리 운세' }
];

class HoroscopeSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        // We link to the main stylesheet. This is a simple approach.
        // For more complex scenarios, we might inject the styles directly.
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="style.css">
            <div id="horoscope-selector">
                ${horoscopeTypes.map(type => `
                    <button class="horoscope-option" data-type="${type.id}">${type.name}</button>
                `).join('')}
            </div>
        `;

        this.shadowRoot.querySelectorAll('.horoscope-option').forEach(button => {
            button.addEventListener('click', (event) => {
                // Dispatch a custom event with the selected type
                this.dispatchEvent(new CustomEvent('type-selected', {
                    detail: { type: event.target.dataset.type },
                    bubbles: true,
                    composed: true
                }));

                // Handle active state within the component
                this.shadowRoot.querySelectorAll('.horoscope-option').forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
            });
        });
    }
}

customElements.define('horoscope-selector', HoroscopeSelector);

const zodiacSigns = ["쥐띠", "소띠", "호랑이띠", "토끼띠", "용띠", "뱀띠", "말띠", "양띠", "원숭이띠", "닭띠", "개띠", "돼지띠"];
const starSigns = ["양자리", "황소자리", "쌍둥이자리", "게자리", "사자자리", "처녀자리", "천칭자리", "전갈자리", "사수자리", "염소자리", "물병자리", "물고기자리"];

class SignSelector extends HTMLElement {
    static get observedAttributes() {
        return ['type'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'type' && oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const type = this.getAttribute('type');
        if (!type) {
            this.shadowRoot.innerHTML = '';
            return;
        }

        const signs = type === 'zodiac' ? zodiacSigns : starSigns;
        const title = type === 'zodiac' ? '당신의 띠를 선택하세요' : '당신의 별자리를 선택하세요';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="style.css">
            <div id="sub-selection-container" style="display: block;">
                <h3>${title}</h3>
                <div class="sub-selection-wrapper">
                    ${signs.map(sign => `
                        <button class="sub-selection-option" data-sign="${sign}">${sign}</button>
                    `).join('')}
                </div>
            </div>
        `;

        this.shadowRoot.querySelectorAll('.sub-selection-option').forEach(button => {
            button.addEventListener('click', (event) => {
                this.dispatchEvent(new CustomEvent('sign-selected', {
                    detail: { sign: event.target.dataset.sign },
                    bubbles: true,
                    composed: true
                }));
                
                this.shadowRoot.querySelectorAll('.sub-selection-option').forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
            });
        });
    }
}

customElements.define('sign-selector', SignSelector);

const fakeHoroscopes = [
    "오늘은 새로운 기회가 용처럼 솟아오르는 날입니다. 예상치 못한 곳에서 귀인을 만나 도움을 받을 수 있으니, 열린 마음으로 사람들을 대하세요.",
    "하늘의 별들이 당신의 길을 밝게 비추는 하루입니다. 특히 창의적인 활동에서 큰 성과를 얻을 수 있습니다.",
    "금전운이 상승하고 있으니, 예상치 못한 작은 행운을 기대해봐도 좋습니다. 다만, 저녁에는 갑작스러운 지출이 생길 수 있으니 주의가 필요합니다.",
    "인간관계에서 작은 오해가 생길 수 있으나, 진솔한 대화로 쉽게 해결될 수 있습니다. 당신의 직감을 믿고 과감하게 행동해도 좋은 날입니다.",
    "오랫동안 고민해왔던 문제의 실마리를 찾을 수 있습니다. 오늘은 당신의 분석력이 빛을 발하는 날이니, 논리적인 사고를 바탕으로 문제를 해결해보세요.",
    "건강운이 대체로 좋지만, 가벼운 스트레칭으로 몸을 풀어주는 것이 좋습니다. 저녁에는 명상을 통해 마음을 정리하는 시간을 가져보세요."
];

// 가상 AI 서비스: 호출될 때마다 무작위 운세와 함께 1초 지연을 시뮬레이션합니다.
function fakeAiHoroscopeService(sign) {
    console.log(`AI 운세 생성 요청: ${sign}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * fakeHoroscopes.length);
            const horoscope = `우주의 기운이 ${sign}에게 특별한 메시지를 보냅니다. ${fakeHoroscopes[randomIndex]}`;
            resolve(horoscope);
        }, 800);
    });
}


class HoroscopeResult extends HTMLElement {
    static get observedAttributes() {
        return ['sign'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._sign = null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'sign' && oldValue !== newValue) {
            this._sign = newValue;
            this.render();
        }
    }

    async render() {
        if (!this._sign) {
            this.shadowRoot.innerHTML = '';
            return;
        }

        // 1. 로딩 상태 표시
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="style.css">
            <div id="result-section" style="display: block;">
                <div class="result-card">
                    <h3>${this._sign} 오늘의 운세</h3>
                    <p>AI가 당신의 운세를 생성하고 있습니다...</p>
                </div>
            </div>
        `;
        this.scrollIntoView({ behavior: 'smooth' });

        // 2. AI 운세 생성 (비동기)
        const horoscopeText = await fakeAiHoroscopeService(this._sign);

        // 3. 결과 표시
        const content = `
            <h3>${this._sign} 오늘의 운세</h3>
            <p>${horoscopeText}</p>
        `;

        this.shadowRoot.querySelector('.result-card').innerHTML = content;
    }
}

customElements.define('horoscope-result', HoroscopeResult);



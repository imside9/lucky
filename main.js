// Get references to the components
const signSelector = document.querySelector('sign-selector');
const resultComponent = document.querySelector('horoscope-result');
const todayDateElement = document.getElementById('today-date');

// Display the date
function displayDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    todayDateElement.textContent = today.toLocaleDateString('ko-KR', options);
}

// Listen for the 'type-selected' event from <horoscope-selector>
document.addEventListener('type-selected', (event) => {
    const { type } = event.detail;
    signSelector.setAttribute('type', type);
    // Clear the result when a new type is selected
    resultComponent.removeAttribute('sign'); 
});

// Listen for the 'sign-selected' event from <sign-selector>
document.addEventListener('sign-selected', (event) => {
    const { sign } = event.detail;
    resultComponent.setAttribute('sign', sign);
});

// Initial setup
displayDate();

// Get references to key DOM elements
const questionImageEl = document.getElementById('question-image');
const answersContainer = document.getElementById('answers-container');
const rescanBtn = document.getElementById('rescan-btn');
const resetBtn = document.getElementById('reset-btn');
const nextBtn = document.getElementById('next-btn');
const settingsBtn = document.getElementById('settings-btn');

const enlargeImgEl = document.getElementById('enlargeImg');
const enlargeModal = new bootstrap.Modal(document.getElementById('enlargeModal'));

let hasAnswered = false;
let currentQuestion = null;

/**
 * Fetches and displays a new random question from the server.
 */
async function loadRandomQuestion() {
    hasAnswered = false;
    currentQuestion = null;
    answersContainer.innerHTML = '';
    questionImageEl.src = '';

    try {
        const response = await fetch('/api/random-question');
        const data = await response.json();

        if (data.error) {
            questionImageEl.alt = 'No questions available';
            return;
        }

        currentQuestion = data.question;
        questionImageEl.src = `/images/${currentQuestion}`;

        // Ensure no duplicate overlays exist
        document.querySelectorAll('.hover-overlay').forEach(el => el.remove());

        // Add an "Enlarge" button for the question image
        addEnlargeButton(document.querySelector('.question-container'), `/images/${currentQuestion}`);

        // Populate answers dynamically
        data.answers.forEach(answerObj => createAnswerBlock(answerObj));

    } catch (err) {
        console.error('Error loading question:', err);
    }
}

/**
 * Creates an answer block with selection and enlargement options.
 * @param {Object} answerObj - Contains the filename and correctness of the answer.
 */
function createAnswerBlock(answerObj) {
    const block = document.createElement('div');
    block.classList.add('answer-block');
    block.dataset.filename = answerObj.filename;
    block.dataset.isCorrect = answerObj.isCorrect;

    const img = document.createElement('img');
    img.src = `/images/${answerObj.filename}`;
    img.alt = "Answer Image";

    // Hover overlay for "Choose" and "Enlarge" buttons
    const overlay = document.createElement('div');
    overlay.classList.add('answer-overlay');

    const chooseBtn = document.createElement('button');
    chooseBtn.classList.add('btn', 'btn-primary');
    chooseBtn.textContent = 'Choose';
    chooseBtn.onclick = (e) => {
        e.stopPropagation(); // Prevents clicking "Choose" from also triggering "Enlarge"
        if (!hasAnswered) handleChooseAnswer(block);
    };

    const enlargeBtn = document.createElement('button');
    enlargeBtn.classList.add('btn', 'btn-secondary');
    enlargeBtn.textContent = '🔍';
    enlargeBtn.onclick = (e) => {
        e.stopPropagation(); // Prevents bubbling up to answer selection
        handleEnlargeImage(`/images/${answerObj.filename}`);
    };

    overlay.appendChild(chooseBtn);
    overlay.appendChild(enlargeBtn);
    block.appendChild(img);
    block.appendChild(overlay);
    block.onclick = (e) => {
        e.stopPropagation();
        if (!hasAnswered) handleChooseAnswer(block);
    };

    answersContainer.appendChild(block);
}

/**
 * Handles user answer selection and provides visual feedback.
 * @param {HTMLElement} answerBlock - The answer block element selected by the user.
 */
async function handleChooseAnswer(answerBlock) {
    if (hasAnswered) return;
    hasAnswered = true;

    const chosenFile = answerBlock.dataset.filename;
    const isCorrect = answerBlock.dataset.isCorrect === 'true';

    document.querySelectorAll('.answer-block').forEach(blk => {
        if (blk.dataset.isCorrect === 'true') {
            blk.classList.add('answer-correct'); // Correct answer turns green
        }
    });

    if (!isCorrect) {
        answerBlock.classList.add('answer-wrong'); // Only the selected wrong answer turns red
    }

    await fetch('/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion, chosen: chosenFile })
    });
}

/**
 * Enlarges the clicked image inside a Bootstrap modal.
 * @param {string} src - The image URL to display in the modal.
 */
function handleEnlargeImage(src) {
    enlargeImgEl.src = src;
    enlargeModal.show();
}

/**
 * Adds an "Enlarge" button overlay on top of an element.
 * @param {HTMLElement} container - The element to append the enlarge button to.
 * @param {string} imageUrl - The image URL that should be enlarged.
 */
function addEnlargeButton(container, imageUrl) {
    if (!container.querySelector('.hover-overlay')) {
        const overlay = document.createElement('div');
        overlay.classList.add('hover-overlay');

        const enlargeBtn = document.createElement('button');
        enlargeBtn.classList.add('btn', 'btn-secondary');
        enlargeBtn.textContent = '🔍';
        enlargeBtn.onclick = (e) => {
            e.stopPropagation();
            handleEnlargeImage(imageUrl);
        };

        overlay.appendChild(enlargeBtn);
        container.appendChild(overlay);
    }
}

// Confirmation before resetting answered questions
resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all answered questions? This action cannot be undone.')) {
        fetch('/api/reset-images').then(() => loadRandomQuestion());
    }
});

// Event Listeners
settingsBtn.addEventListener('click', () => new bootstrap.Modal(document.getElementById('settingsModal')).show());
rescanBtn.addEventListener('click', () => fetch('/api/rescan-images').then(() => loadRandomQuestion()));
nextBtn.addEventListener('click', loadRandomQuestion);

// Ensure "Next Question" is always enabled
nextBtn.disabled = false;

// Load first question on startup
window.addEventListener('DOMContentLoaded', loadRandomQuestion);

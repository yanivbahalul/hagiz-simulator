// Get references to key DOM elements
const questionImageEl = document.getElementById('question-image');
const answersContainer = document.getElementById('answers-container');
const nextBtn = document.getElementById('next-btn');

const enlargeImgEl = document.getElementById('enlargeImg');
const enlargeModal = new bootstrap.Modal(document.getElementById('enlargeModal'));

let hasAnswered = false;
let currentQuestion = null;
let totalQuestions = 0;

// Track recently asked questions to improve randomness (keep last 20)
const MAX_RECENT_QUESTIONS = 20;

/**
 * Get recently asked questions from localStorage
 */
function getRecentQuestions() {
    try {
        const recent = localStorage.getItem('recentQuestions');
        return recent ? JSON.parse(recent) : [];
    } catch (e) {
        return [];
    }
}

/**
 * Add question to recent questions list
 */
function addToRecentQuestions(questionFilename) {
    let recent = getRecentQuestions();
    recent.unshift(questionFilename);
    
    // Keep only last MAX_RECENT_QUESTIONS
    if (recent.length > MAX_RECENT_QUESTIONS) {
        recent = recent.slice(0, MAX_RECENT_QUESTIONS);
    }
    
    try {
        localStorage.setItem('recentQuestions', JSON.stringify(recent));
    } catch (e) {
        console.warn('Failed to save recent questions:', e);
    }
}

/**
 * Fetches and displays a new random question from the server.
 */
async function loadRandomQuestion() {
    hasAnswered = false;
    currentQuestion = null;
    answersContainer.innerHTML = '';
    questionImageEl.src = '';
    nextBtn.disabled = true;

    try {
        // Send recent questions to server for better randomness
        const recentQuestions = getRecentQuestions();
        const queryParam = recentQuestions.length > 0 
            ? `?recent=${encodeURIComponent(JSON.stringify(recentQuestions))}` 
            : '';
        
        const response = await fetch(`/api/random-question${queryParam}`);
        const data = await response.json();

        if (data.error) {
            questionImageEl.alt = 'No questions available';
            return;
        }

        currentQuestion = data.question;
        totalQuestions = data.totalQuestions || 0;
        questionImageEl.src = `/images/${currentQuestion}`;

        // Add this question to recent questions
        addToRecentQuestions(currentQuestion);

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
    chooseBtn.textContent = 'בחר';
    chooseBtn.onclick = (e) => {
        e.stopPropagation();
        if (!hasAnswered) handleChooseAnswer(block);
    };

    const enlargeBtn = document.createElement('button');
    enlargeBtn.classList.add('btn', 'btn-secondary');
    enlargeBtn.textContent = '🔍';
    enlargeBtn.onclick = (e) => {
        e.stopPropagation();
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
function handleChooseAnswer(answerBlock) {
    if (hasAnswered) return;
    hasAnswered = true;

    const isCorrect = answerBlock.dataset.isCorrect === 'true';

    // Show correct answers in green
    document.querySelectorAll('.answer-block').forEach(blk => {
        if (blk.dataset.isCorrect === 'true') {
            blk.classList.add('answer-correct');
        }
    });

    // Show wrong answer in red if user was incorrect
    if (!isCorrect) {
        answerBlock.classList.add('answer-wrong');
    }

    // Enable next button
    nextBtn.disabled = false;
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

// Event Listeners
nextBtn.addEventListener('click', loadRandomQuestion);

// Load first question on startup
window.addEventListener('DOMContentLoaded', loadRandomQuestion);

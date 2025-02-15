const questionImageEl = document.getElementById('question-image');
const answersContainer = document.getElementById('answers-container');
const rescanBtn = document.getElementById('rescan-btn');
const resetBtn = document.getElementById('reset-btn');
const settingsBtn = document.getElementById('settings-btn');
const nextBtn = document.getElementById('next-btn');
const enlargeImgEl = document.getElementById('enlargeImg');

let hasAnswered = false;
let currentQuestion = null;

/**
 * Load a random question from the server
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

        // Build the answer blocks
        data.answers.forEach((answerObj) => {
            const block = document.createElement('div');
            block.classList.add('answer-block');
            block.dataset.filename = answerObj.filename;
            block.dataset.isCorrect = answerObj.isCorrect;

            const img = document.createElement('img');
            img.src = `/images/${answerObj.filename}`;
            img.alt = "Answer Image";
            img.classList.add("answer-image");

            // Hover overlay with "Choose" and "Enlarge" buttons
            const overlay = document.createElement('div');
            overlay.classList.add('answer-overlay');

            const chooseBtn = document.createElement('button');
            chooseBtn.textContent = 'Choose';
            chooseBtn.classList.add('btn', 'btn-primary', 'choose-btn');
            chooseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!hasAnswered) handleChooseAnswer(block);
            });

            const enlargeBtn = document.createElement('button');
            enlargeBtn.textContent = 'Enlarge';
            enlargeBtn.classList.add('btn', 'btn-secondary', 'enlarge-btn');
            enlargeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleEnlargeImage(answerObj.filename);
            });

            overlay.appendChild(chooseBtn);
            overlay.appendChild(enlargeBtn);
            block.appendChild(img);
            block.appendChild(overlay);
            answersContainer.appendChild(block);
        });

    } catch (err) {
        console.error('Error loading question:', err);
    }
}

/**
 * Handle user selecting an answer
 */
async function handleChooseAnswer(answerBlock) {
    hasAnswered = true;
    const chosenFile = answerBlock.dataset.filename;
    const isCorrect = (answerBlock.dataset.isCorrect === 'true');

    document.querySelectorAll('.answer-block').forEach((blk) => {
        if (blk.dataset.isCorrect === 'true') {
            blk.classList.add('answer-correct');
        }
    });

    if (!isCorrect) {
        answerBlock.classList.add('answer-wrong');
    }

    try {
        await fetch('/api/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: currentQuestion, chosen: chosenFile })
        });

        nextBtn.disabled = false;

    } catch (err) {
        console.error('Error calling /api/answer:', err);
    }
}

/**
 * Enlarge an image in Bootstrap modal
 */
function handleEnlargeImage(filename) {
    enlargeImgEl.src = `/images/${filename}`;
    const myModal = new bootstrap.Modal(document.getElementById('enlargeModal'), { keyboard: true });
    myModal.show();
}

/**
 * Rescan images
 */
async function rescanImages() {
    try {
        await fetch('/api/rescan-images');
        loadRandomQuestion();
    } catch (err) {
        console.error('Error rescanning:', err);
    }
}

/**
 * Reset folders (remove ANSWERED_ prefix from all answered images)
 */
async function resetFolders() {
    const confirmReset = confirm("⚠️ Are you sure you want to reset answered questions? This action cannot be undone.");
    if (!confirmReset) return; // Exit if user cancels

    try {
        await fetch('/api/reset-images');
        loadRandomQuestion();
    } catch (err) {
        console.error('Error resetting folders:', err);
    }
}

/**
 * Load next question without affecting answered images
 */
function nextQuestion() {
    loadRandomQuestion();
}

// Event Listeners
if (rescanBtn) rescanBtn.addEventListener('click', rescanImages);
if (resetBtn) resetBtn.addEventListener('click', resetFolders);
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
        settingsModal.show();
    });
}
if (nextBtn) nextBtn.addEventListener('click', nextQuestion);

// Load first question on page load
window.addEventListener('DOMContentLoaded', loadRandomQuestion);

const questionImageEl = document.getElementById('question-image');
const answersContainer = document.getElementById('answers-container');
const rescanBtn = document.getElementById('rescan-btn');
const resetBtn = document.getElementById('reset-btn');
const nextBtn = document.getElementById('next-btn'); // ✅ NEW: Next Question button
const rescanStatus = document.getElementById('rescan-status');

const enlargeImgEl = document.getElementById('enlargeImg'); // For modal

let hasAnswered = false;
let currentQuestion = null; // Store current question filename

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
            rescanStatus.textContent = 'No more questions available!';
            return;
        }

        currentQuestion = data.question;
        console.log(`Loading question image: /images/${currentQuestion}`);
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

            // "Choose" button
            const chooseBtn = document.createElement('button');
            chooseBtn.textContent = 'Choose';
            chooseBtn.classList.add('btn', 'btn-primary', 'choose-btn');
            chooseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!hasAnswered) handleChooseAnswer(block);
            });

            // "Enlarge" button
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
        rescanStatus.textContent = 'Error loading question.';
    }
}

/**
 * Handle user selecting an answer
 */
async function handleChooseAnswer(answerBlock) {
    hasAnswered = true;
    const chosenFile = answerBlock.dataset.filename;
    const isCorrect = (answerBlock.dataset.isCorrect === 'true');

    // Highlight correct answer in green
    document.querySelectorAll('.answer-block').forEach((blk) => {
        if (blk.dataset.isCorrect === 'true') {
            blk.classList.add('answer-correct');
        }
    });

    // Highlight wrong answer in red if incorrect
    if (!isCorrect) {
        answerBlock.classList.add('answer-wrong');
    }

    // Send answer to server to rename files
    try {
        const response = await fetch('/api/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: currentQuestion,
                chosen: chosenFile
            })
        });

        const result = await response.json();

        if (result.error) {
            console.error('Error submitting answer:', result.error);
            rescanStatus.textContent = `Error: ${result.error}`;
            return;
        }

        if (result.isCorrect) {
            rescanStatus.textContent = '✅ Correct! Images renamed with ANSWERED_CORRECT_ prefix.';
        } else {
            rescanStatus.textContent = '❌ Wrong! Images renamed with ANSWERED_WRONG_ prefix.';
        }

        // Enable next question button
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
    const myModal = new bootstrap.Modal(document.getElementById('enlargeModal'), {
        keyboard: true
    });
    myModal.show();
}

/**
 * Rescan images
 */
async function rescanImages() {
    try {
        const response = await fetch('/api/rescan-images');
        const data = await response.json();
        if (data.message) {
            rescanStatus.textContent = `Rescanned: ${data.totalImages} images -> ${data.totalQuestionSets} sets.`;
        }
        loadRandomQuestion();
    } catch (err) {
        console.error('Error rescanning:', err);
        rescanStatus.textContent = 'Error rescanning images.';
    }
}

/**
 * Reset folders (remove ANSWERED_ prefix from all answered images)
 */
async function resetFolders() {
    try {
        const response = await fetch('/api/reset-images');
        const data = await response.json();
        if (data.message) {
            rescanStatus.textContent = `Reset done: ${data.totalImages} images -> ${data.totalSets} sets.`;
        }
        loadRandomQuestion();
    } catch (err) {
        console.error('Error resetting folders:', err);
        rescanStatus.textContent = 'Error resetting folders.';
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
if (nextBtn) nextBtn.addEventListener('click', nextQuestion);

// Load first question on page load
window.addEventListener('DOMContentLoaded', loadRandomQuestion);

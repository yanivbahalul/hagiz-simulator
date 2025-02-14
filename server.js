// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const {
  IMAGES_DIR,
  ANSWERED_CORRECT_PREFIX,
  ANSWERED_WRONG_PREFIX,
  QUESTION_INDEX,
  CORRECT_ANSWER_INDEX,
  WRONG_ANSWERS_START_INDEX,
  TOTAL_IMAGES_PER_SET
} = require('./constants');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend and images
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(IMAGES_DIR));

// Function to load images, ignoring answered ones
function loadImages() {
  return fs.readdirSync(IMAGES_DIR)
    .filter(f => !f.startsWith(ANSWERED_CORRECT_PREFIX) && !f.startsWith(ANSWERED_WRONG_PREFIX))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); // Sort by filename
}



// Group images into sets of 7
function groupImagesIntoQuestions(sortedFilenames) {
  const groups = [];
  for (let i = 0; i <= sortedFilenames.length - TOTAL_IMAGES_PER_SET; i += TOTAL_IMAGES_PER_SET) {
    const chunk = sortedFilenames.slice(i, i + TOTAL_IMAGES_PER_SET);
    groups.push(chunk);
  }
  return groups;
}


// Load images initially
let allImages = loadImages();
let questionSets = groupImagesIntoQuestions(allImages);

// GET /api/random-question (Fixed)
app.get('/api/random-question', (req, res) => {
  if (questionSets.length === 0) {
      return res.status(500).json({ error: 'No question sets available' });
  }

  // Select a random question set
  const set = questionSets[Math.floor(Math.random() * questionSets.length)];

  // Ensure the first image in the set is the question
  const questionImage = set[QUESTION_INDEX];

  // Ensure the correct answer is always the second image
  const correctAnswer = set[CORRECT_ANSWER_INDEX];

  // Get the wrong answers (remaining images)
  const wrongAnswers = set.slice(WRONG_ANSWERS_START_INDEX);

  // Prepare the answers array
  let answers = [{ filename: correctAnswer, isCorrect: true },
                 ...wrongAnswers.map(f => ({ filename: f, isCorrect: false }))];

  // Shuffle the answers
  for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  res.json({ question: questionImage, answers });
});


// POST /api/answer (Rename files)
app.post('/api/answer', (req, res) => {
  const { question, chosen } = req.body;
  const index = questionSets.findIndex(set => set[QUESTION_INDEX] === question);
  if (index === -1) return res.status(404).json({ error: 'Question set not found or already answered.' });

  const set = questionSets[index];
  const isCorrect = chosen === set[CORRECT_ANSWER_INDEX];

  // Rename each file in the set
  set.forEach(file => {
    const oldPath = path.join(IMAGES_DIR, file);
    const newPrefix = isCorrect ? ANSWERED_CORRECT_PREFIX : ANSWERED_WRONG_PREFIX;
    const newPath = path.join(IMAGES_DIR, `${newPrefix}${file}`);

    try {
      fs.renameSync(oldPath, newPath);
    } catch (err) {
      console.error(`Failed to rename ${file}:`, err);
    }
  });

  questionSets.splice(index, 1);
  res.json({ message: 'Answer recorded successfully', isCorrect });
});

// GET /api/reset-images (Remove prefix from all answered images)
app.get('/api/reset-images', (req, res) => {
  fs.readdirSync(IMAGES_DIR).forEach(file => {
    if (file.startsWith(ANSWERED_CORRECT_PREFIX) || file.startsWith(ANSWERED_WRONG_PREFIX)) {
      const oldPath = path.join(IMAGES_DIR, file);
      const newPath = path.join(IMAGES_DIR, file.replace(ANSWERED_CORRECT_PREFIX, "").replace(ANSWERED_WRONG_PREFIX, ""));
      try {
        fs.renameSync(oldPath, newPath);
      } catch (err) {
        console.error(`Failed to rename ${file}:`, err);
      }
    }
  });

  allImages = loadImages();
  questionSets = groupImagesIntoQuestions(allImages);
  res.json({ message: 'Reset successful', totalImages: allImages.length, totalSets: questionSets.length });
});

// GET /api/rescan-images (Reload all available images from "images/" folder)
app.get('/api/rescan-images', (req, res) => {
  allImages = loadImages();  // Reload images
  questionSets = groupImagesIntoQuestions(allImages); // Recreate question sets

  console.log(`📂 Rescanned: ${allImages.length} images -> ${questionSets.length} sets.`);
  res.json({ message: 'Images reloaded successfully.', totalImages: allImages.length, totalQuestionSets: questionSets.length });
});

// Start server
app.listen(3000, () => console.log(`Server running at http://localhost:3000`));

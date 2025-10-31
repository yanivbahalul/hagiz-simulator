// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const {
  IMAGES_DIR,
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

// Function to load all images
function loadImages() {
  return fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
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

console.log(`📚 Loaded ${questionSets.length} question sets from ${allImages.length} images`);

// GET /api/random-question - Always returns a random question from all available
app.get('/api/random-question', (req, res) => {
  if (questionSets.length === 0) {
    return res.status(500).json({ error: 'No question sets available' });
  }

  // Get recently asked questions from query parameter (sent by client)
  const recentQuestions = req.query.recent ? JSON.parse(req.query.recent) : [];
  
  // Filter out recently asked questions for better variety
  let availableSets = questionSets;
  if (recentQuestions.length > 0 && questionSets.length > 10) {
    availableSets = questionSets.filter(set => !recentQuestions.includes(set[QUESTION_INDEX]));
    // If we filtered out too many, use all questions
    if (availableSets.length === 0) {
      availableSets = questionSets;
    }
  }

  // Select a random question set
  const set = availableSets[Math.floor(Math.random() * availableSets.length)];

  // Get question and answers
  const questionImage = set[QUESTION_INDEX];
  const correctAnswer = set[CORRECT_ANSWER_INDEX];
  const wrongAnswers = set.slice(WRONG_ANSWERS_START_INDEX);

  // Prepare and shuffle answers
  let answers = [
    { filename: correctAnswer, isCorrect: true },
    ...wrongAnswers.map(f => ({ filename: f, isCorrect: false }))
  ];

  // Shuffle the answers
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  res.json({ 
    question: questionImage, 
    answers,
    totalQuestions: questionSets.length 
  });
});

// GET /api/stats - Get total number of questions
app.get('/api/stats', (req, res) => {
  res.json({ 
    totalQuestions: questionSets.length,
    totalImages: allImages.length
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  
  // Keep-alive mechanism for Render free tier
  if (process.env.RENDER) {
    const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
    if (RENDER_URL) {
      console.log('🔄 Keep-alive enabled for Render deployment');
      
      // Ping every 10 minutes to prevent cold start
      setInterval(() => {
        const https = require('https');
        const http = require('http');
        const protocol = RENDER_URL.startsWith('https') ? https : http;
        
        protocol.get(RENDER_URL, (res) => {
          console.log(`✅ Keep-alive ping: ${res.statusCode}`);
        }).on('error', (err) => {
          console.log('⚠️ Keep-alive ping failed:', err.message);
        });
      }, 10 * 60 * 1000); // 10 minutes
    }
  }
});

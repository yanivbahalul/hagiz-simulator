const path = require('path');

// Base images directory
const IMAGES_DIR = path.join(__dirname, 'images');

// Question set structure
const QUESTION_INDEX = 0;
const CORRECT_ANSWER_INDEX = 1;
const WRONG_ANSWERS_START_INDEX = 2;
const TOTAL_IMAGES_PER_SET = 7;

module.exports = {
  IMAGES_DIR,
  QUESTION_INDEX,
  CORRECT_ANSWER_INDEX,
  WRONG_ANSWERS_START_INDEX,
  TOTAL_IMAGES_PER_SET
};

const path = require('path');

// Base images directory
const IMAGES_DIR = path.join(__dirname, 'images');

// Prefixes for answered images
const ANSWERED_CORRECT_PREFIX = "ANSWERED_CORRECT_";
const ANSWERED_WRONG_PREFIX = "ANSWERED_WRONG_";

// Answer positions
const QUESTION_INDEX = 0;
const CORRECT_ANSWER_INDEX = 1;
const WRONG_ANSWERS_START_INDEX = 2;
const TOTAL_IMAGES_PER_SET = 7;

module.exports = {
  IMAGES_DIR,
  ANSWERED_CORRECT_PREFIX,
  ANSWERED_WRONG_PREFIX,
  QUESTION_INDEX,
  CORRECT_ANSWER_INDEX,
  WRONG_ANSWERS_START_INDEX,
  TOTAL_IMAGES_PER_SET
};

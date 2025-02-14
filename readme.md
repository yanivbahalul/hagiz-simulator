# Hagiz Simulator

## 📌 Project Overview
Hagiz Simulator is a simple quiz application that displays questions in image format with six answer choices. Users can select an answer, and the application highlights the correct and incorrect choices. Answered questions are renamed with appropriate prefixes (`ANSWERED_CORRECT_` or `ANSWERED_WRONG_`) to track progress. The system allows rescanning for new questions and resetting answered questions back to their original filenames.

---

## 📂 Folder Structure
```
my-quiz-app
├── images/                   # Folder containing all question images
├── public/                   # Frontend files
│   ├── index.html            # Main UI
│   ├── script.js             # Frontend logic
│   ├── style.css             # Styling
├── server.js                 # Backend logic
├── constants.js              # Constants for file handling
├── package.json              # Project metadata & dependencies
├── package-lock.json         # Dependency lock file
└── README.md                 # Project instructions
```

---

## 🚀 Setup & Running the Project

### 1️⃣ **Install Node.js**
Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### 2️⃣ **Clone the Repository**
```sh
git clone <repository_url>
cd my-quiz-app
```

### 3️⃣ **Install Dependencies**
```sh
npm install
```

### 4️⃣ **Run the Server**
```sh
npm start
```
The server will start on **http://localhost:3000**

---

## 🖼️ Adding Images
1. Place your images inside the `images/` folder.
2. Ensure images follow this structure:
   ```
   [oldest]
   question.png
   correct_answer.png
   wrong_answer1.png
   wrong_answer2.png
   wrong_answer3.png
   wrong_answer4.png
   wrong_answer5.png
   next_question.png
   next_correct.png
   next_wrong1.png
   ...
   [newest]
   ```

3. **Each question must have exactly 6 answers (1 correct + 5 wrong).**

---

## 🎮 Using the Application
1. Open `http://localhost:3000` in your browser.
2. Click on an answer:
   - ✅ Correct answers are **highlighted in green**.
   - ❌ Incorrect answers are **highlighted in red**.
3. After answering, files are **renamed**:
   - Correct: `ANSWERED_CORRECT_<filename>`
   - Wrong: `ANSWERED_WRONG_<filename>`

---

## 🔄 Resetting & Rescanning
| Action             | Description |
|--------------------|-------------|
| **Rescan Images** | Reloads available questions from `images/`. |
| **Reset Folders** | Moves answered questions back by renaming them to their original names. |
| **Next Question** | Manually load the next random question. |

---

## 📜 API Endpoints
| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| GET    | `/api/random-question` | Fetch a random question with shuffled answers. |
| POST   | `/api/answer`          | Submit an answer & rename files accordingly. |
| GET    | `/api/rescan-images`   | Reload available images as question sets. |
| GET    | `/api/reset-images`    | Reset renamed images back to their original filenames. |

---

## 🎯 Future Enhancements
✅ Improve UI responsiveness.
✅ Add a timer for each question.
✅ Store scores in local storage.
✅ Allow custom categories for questions.

🚀 **Enjoy using Hagiz Simulator!** 🎯

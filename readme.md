Hagiz Simulator

Hagiz Simulator is a web-based quiz tool designed to help students train for the "Introduction to Computer Systems" final exam. The questions are sourced from various past exams, allowing users to practice effectively. The tool automatically manages question sets and updates them after answering.

Features

✅ Responsive UI with Bootstrap✅ Randomized question selection✅ Supports bulk image-based questions✅ Answer validation and renaming system✅ Easy to add more questions

Installation & Running the Project

Prerequisites

Windows: Install Node.js

Mac: Install Node.js via Homebrew:

brew install node

Ensure you have Git installed (optional, but recommended for version control).

Steps to Run Locally

Clone the repository:

git clone https://github.com/shaico111/hagiz-simulator.git

Navigate into the project folder:

cd hagiz-simulator

Install dependencies:

npm install

Start the server:

node server.js

Open your browser and go to:

http://localhost:3000

Adding More Questions

Guidelines for Adding Questions

To maintain consistency, all questions follow a structured format:

Take Screenshots of the question and answers exactly as they appear on the original form. Do not mark answers as correct or incorrect.

Each question must have exactly 7 images:

00 → Question image

01 → Correct answer

02-06 → Wrong answers (or white squares if not enough options exist)

Save images in the following format:

YYYYMMDD-QuestionName-00.png
YYYYMMDD-QuestionName-01.png
YYYYMMDD-QuestionName-02.png

Example:

20250214-MathEquation-00.png
20250214-MathEquation-01.png
20250214-MathEquation-02.png

Steps to Add New Questions

Place the images inside the /images folder.

Rescan images using the "Rescan Images" button in the UI.

The system will automatically detect new questions and include them.

If the rescan does not work correctly, restart the server:

node server.js

Special Thanks 🙏

💙 Yaniv – for helping collect the questions 📸💙 Mordi the Lecturer – for guidance and support 🎓

Enjoy the tool! 🚀


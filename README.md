🕵️ HackQuest – Mystery Quest Web Application

HackQuest is a full-stack web-based mystery and quiz game where users solve multiple quests to unlock clues and finally identify the culprit. The application tracks user progress, manages sessions securely, and maintains a leaderboard for successful participants.

This project demonstrates authentication, session handling, dynamic routing, MongoDB integration, and game logic implementation using the MERN backend stack.

🚀 Features

🔐 User Registration & Login System

🧠 Multi-level Quest System

✅ Quest Completion Tracking

🗂️ Session-based Authentication

🧩 Clue Unlocking Mechanism

🎯 Final Culprit Submission (One Attempt Only)

🏆 Leaderboard System

🔄 Persistent User Progress (Stored in Database)

🚪 Secure Logout System

🛠️ Tech Stack
Backend

Node.js – Runtime environment

Express.js – Web framework

MongoDB Atlas – Cloud database

Mongoose – ODM for MongoDB

express-session – Session management

body-parser – Request parsing middleware

Frontend

EJS (Embedded JavaScript Templates) – Server-side rendering

HTML5 – Structure

CSS3 – Styling

JavaScript – Client-side logic

Database

MongoDB (NoSQL)

User Collection

Leaderboard Collection

🏗️ Application Architecture

MVC-style structured routing

Session-based authentication system

MongoDB schemas:

User → Stores username, password, quest answers, completion status

Leaderboard → Stores winners of the final challenge

Conditional rendering based on quest completion

Progress-based game unlocking logic

🎮 How It Works

User registers and logs in.

User attempts quests one by one.

Correct answers unlock progress and clues.

After completing all quests, the final culprit submission becomes available.

Only one final attempt is allowed.

If correct, user name is added to the leaderboard.

📦 Installation & Setup
git clone <your-repo-link>
cd hackquest
npm install
node app.js

Make sure to:

Set up MongoDB Atlas connection string

Configure environment variables (recommended for production)

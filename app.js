const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// const mongoURI = 'mongodb://localhost:27017/hackquest';
const mongoURI = 'mongodb+srv://AnkushSharma:ankushsharma5524@cluster0.sed8t.mongodb.net/hackquest?retryWrites=true&w=majority&appName=Cluster0';
// const uri = "mongodb+srv://AnkushSharma:<db_password>@cluster0.sed8t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(mongoURI)
    .then(() => {

        console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });


    const userSchema = new mongoose.Schema({
        username: String,
        password: String,
        answer: [String],
        completedQuests: [Boolean], // Tracks which quests are completed
        finalAnswerSubmitted: Boolean, // Tracks if final answer is submitted
        finalAnswerAttempted: Boolean // Tracks if final answer is attempted
    });

const userSchema2 = new mongoose.Schema({
    id: String,
    name: [String]
});

const User = mongoose.model('User', userSchema);
const LeaderBoard = mongoose.model('Leadership', userSchema2);

const leaderboard = new LeaderBoard({
    id: "2024",
    name: []
});
// leaderboard.save()

const correct_answer = ['ankush', 'kumar', 'sharma', 'sarkar'];
const culprit = 'XYZ';

// Login page render route
app.get('/', async (req, res) => {
    try {
        res.render('login', { message: null });
    } catch (error) {
        console.log(error);
    }
});

// Register page render route
app.get('/register', async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error);
    }
});

// Registration route
app.post('/register', (req, res) => {
    const u = new User({
        username: req.body.username,
        password: req.body.password,
        answer: ['a1', 'a2', 'a3', 'a4']
    });
    u.save()
        .then(() => {
            res.send('User created successfully <a href="/login" style="color: white; text-decoration: none; font-size: 16px;">Login</a>');
        })
        .catch((err) => {
            res.status(500).send('Error creating user');
        });
});

// Login route
app.post('/login', async (req, res) => {
    const input_password = req.body.password;
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            if (input_password === user.password) {
                req.session.username = user.username;
                res.redirect('/quest');
            } else {
                res.render('login', { message: 'Wrong Credentials' });
            }
        } else {
            res.render('login', { message: 'Wrong Credentials' });
        }
    } catch (error) {
        console.log(error);
    }
});

// Home page render route
app.get('/quest', async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({ username: username });
        if (!user.completedQuests) {
            user.completedQuests = [false, false, false, false]; // Initialize if it doesn't exist
            await user.save();
        }
        const areEqual = JSON.stringify(user.answer) === JSON.stringify(correct_answer);
        res.render('list', {
            username: username,
            condition: areEqual,
            completedQuests: user.completedQuests,
            finalAnswerSubmitted: user.finalAnswerSubmitted || false,
            finalAnswerAttempted: user.finalAnswerAttempted || false
        });
    } catch (error) {
        console.log(error);
    }
});

// Selecting which answer is entered
app.post('/quest', (req, res) => {
    const index1 = req.body.quest_index;
    req.session.index1 = index1;
    res.redirect('/enter_answer');
});

// Rendering answer page
app.get('/quest', async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({ username: username });
        if (!user.completedQuests) {
            user.completedQuests = [false, false, false, false]; // Initialize if it doesn't exist
            await user.save();
        }
        const areEqual = JSON.stringify(user.answer) === JSON.stringify(correct_answer);
        res.render('list', {
            username: username,
            condition: areEqual,
            completedQuests: user.completedQuests,
            finalAnswerSubmitted: user.finalAnswerSubmitted || false,
            finalAnswerAttempted: user.finalAnswerAttempted || false // Pass finalAnswerAttempted to the template
        });
    } catch (error) {
        console.log(error);
    }
});

app.get('/enter_answer', (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/');
    }
    res.render('answer', { username: username });
});

// Getting answer from the user
app.post('/enter_answer', async (req, res) => {
    const user_answer = req.body.answer;
    const index1 = req.session.index1;
    const username = req.session.username;

    if (!username || index1 === undefined) {
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({ username: username });
        if (user_answer === correct_answer[index1]) {
            user.answer[index1] = user_answer;
            user.completedQuests[index1] = true; // Mark quest as completed
            await user.save();
            res.redirect('/quest');
        } else {
            res.render('wrong', { link: '/quest' });
        }
    } catch (error) {
        console.log(error);
    }
});

// Clue page render route
app.get('/clue', async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({ username: username });
        const areEqual = JSON.stringify(user.answer) === JSON.stringify(correct_answer);
        res.render('clue', {
            condition: areEqual,
            username: username,
            answer1: user.answer[0],
            answer2: user.answer[1],
            answer3: user.answer[2],
            answer4: user.answer[3]
        });
    } catch (error) {
        console.log(error);
    }
});

// Final answer page render route
app.get('/finalAnswer', async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.redirect('/');
    }

    try {
        res.render('finalAnswer', { username: username });
    } catch (error) {
        console.log(error);
    }
});

// Final answer submission route
app.post('/finalAnswer', async (req, res) => {
    const answer = req.body.answer;
    const username = req.session.username;

    if (!username) {
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({ username: username });
        if (user.finalAnswerAttempted) {
            return res.status(400).send('You have already attempted the final answer.');
        }

        user.finalAnswerAttempted = true; // Mark final answer as attempted
        if (answer === culprit) {
            const leaderboard = await LeaderBoard.findOne({ id: '2024' });
            leaderboard.name.push(username);
            await leaderboard.save();
            user.finalAnswerSubmitted = true; // Mark final answer as submitted if correct
        }
        await user.save();
        res.redirect('/quest');
    } catch (error) {
        console.log(error);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(process.env.PORT ||3000, () => {
    console.log('Server is started on port 3000');
});
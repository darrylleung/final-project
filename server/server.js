const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const cron = require("node-cron");
const data = require("../archive.json");
const newArticle = [data[0]];
const puzzleData = require("../dailypuzzle.json");
const dailyPuzzle = [puzzleData[0]];
const secrets = require("../secrets");
const cookieSession = require("cookie-session");
const { compare, hash } = require("./bc");
const db = require("./db");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const { DateTime } = require("luxon");
let arr = [];

app.use(compression());
app.use(express.json());

let sessionSecret;
if (process.env.NODE_ENV == "production") {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("../secrets.json").SESSION_SECRET;
}

let apiSecret;
if (process.env.NODE_ENV == "production") {
    apiSecret = process.env.API_KEY;
} else {
    apiSecret = require("../secrets.json").API_KEY;
}

const cookieSessionMiddleware = cookieSession({
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 90, //maxAge in milliseconds
    sameSite: true,
});

app.use(cookieSessionMiddleware);

app.use(express.static(path.join(__dirname, "..", "client", "public")));

cron.schedule(
    "0 0 0 * * *",
    () => {
        console.log("Updated at midnight, Berlin Time!");
        const randomYear = () => {
            return Math.floor(Math.random() * (2022 - 1989) + 1989);
        };
        const randomMonth = () => {
            return Math.floor(Math.random() * (12 - 1) + 1);
        };
        axios
            .get(
                `https://api.nytimes.com/svc/archive/v1/${randomYear()}/${randomMonth()}.json?api-key=${
                    apiSecret
                }`
            )
            .then((response) => {
                // console.log("response: ", response.data.response.docs);
                console.log("Archive updated");

                // in the future, possibly remove loop altogether and randomly generate an index number, random year, and random month to pull a single new story every 24 hours.

                const nytimesArray = response.data.response.docs;
                const archive = [];

                for (let i = 0; i < nytimesArray.length; i++) {
                    let myNewObj = {};
                    myNewObj.web_url = nytimesArray[i].web_url;
                    myNewObj.lead_paragraph = nytimesArray[i].lead_paragraph;
                    myNewObj.headline = nytimesArray[i].headline.main;
                    myNewObj.byline = nytimesArray[i].byline.original;
                    myNewObj.pub_date = nytimesArray[i].pub_date;
                    myNewObj.news_desk = nytimesArray[i].news_desk;
                    myNewObj.section = nytimesArray[i].section_name;
                    archive.push(myNewObj);
                }

                fs.writeFileSync(
                    "archive.json",
                    JSON.stringify(archive, null, 4)
                );

                dailyPuzzle.pop();
                dailyPuzzle.push(createPuzzle());

                fs.writeFileSync(
                    "dailypuzzle.json",
                    JSON.stringify(dailyPuzzle, null, 4)
                );
            });
    },
    {
        timezone: "Europe/Berlin",
    }
);

// BACKUP METHOD TO GENERATE A NEW PUZZLE
// dailyPuzzle.pop();
// dailyPuzzle.push(createPuzzle());
// fs.writeFileSync("dailypuzzle.json", JSON.stringify(dailyPuzzle, null, 4));

app.get("/start", (req, res) => {
    // console.log("daily puzzle: ", dailyPuzzle);
    res.json(dailyPuzzle[0]);
    // res.json(createPuzzle());
});

app.get("/user/id", (req, res) => {
    res.json({ userId: req.session.userId });
});

app.post("/register", (req, res) => {
    console.log("req body: ", req.body);
    const { username, email, password } = req.body;

    hash(password).then((hashedPassword) => {
        db.registerNewUser(username, email, hashedPassword)
            .then(({ rows }) => {
                let userId = rows[0].id;
                req.session.userId = userId;
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("err: ", err);
                res.json({ success: false });
            });
    });
});

app.post("/login", (req, res) => {
    console.log("req.body: ", req.body);
    const { email, password } = req.body;

    db.login(email)
        .then(({ rows }) => {
            console.log("Result from login: ", rows);
            let hashedPassword = rows[0].password;
            let userId = rows[0].id;
            compare(password, hashedPassword)
                .then((match) => {
                    console.log(
                        "Does the password match the one stored?: ",
                        match
                    );

                    if (match) {
                        req.session.userId = userId;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    console.log("err: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err: ", err);
            res.json({ success: false });
        });
});

app.get("/leaderboard", (req, res) => {
    db.retrieveLeaderboard()
        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.json(rows);
        })
        .catch((err) => console.log("err: ", err));
});

function getNewArticle() {
    const randomNum = () => {
        return Math.floor(Math.random() * (data.length - 1) + 1);
    };
    while (newArticle) {
        const update = () => {
            let randomEntry = data[randomNum()];
            if (
                !randomEntry.lead_paragraph ||
                randomEntry.lead_paragraph == null ||
                randomEntry.lead_paragraph.length < 140
            ) {
                console.log("criteria failed. update again!");
                return update(); //run again
            } else {
                console.log("update success");
                console.log("randomEntry: ", randomEntry);
                return randomEntry;
            }
        };
        newArticle.pop();
        newArticle.push(update());
        return;
    }
}

function getPuzzleObj() {
    console.log("new article at puzzle object: ", newArticle);
    const leadParagraph = newArticle[0]?.lead_paragraph;
    const puzzleObj = leadParagraph?.split(" "); // this version uses split
    // const puzzleObj = leadParagraph?.match(/\w+|\s+|[^\s\w]+/g); // this version uses regex
    arr = [...puzzleObj];
}

function createPuzzle() {
    getNewArticle();
    getPuzzleObj();
    let id = 0;
    const newPuzzle = arr.map((obj) => ({
        Content: obj,
        id: id++,
        Revealed: false,
        Hint: false,
        CharLength: obj.length,
    }));
    for (let i = 0; i < newPuzzle.length; i++) {
        // console.log("Each word length: ", newPuzzle[i].Content);
        newPuzzle[i].Content.match(/[.,\/#!$%\^&\*;:{}=\-_'"`~()]/g) ||
        typeof newPuzzle[i].Content === "number"
            ? (newPuzzle[i].Revealed = true)
            : null;
    }

    newPuzzle.unshift(newArticle[0]);
    return newPuzzle;
}

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// do something with data and then store it in db
// routes to call and receive from db data

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

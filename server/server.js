const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const cron = require("node-cron");
const data = require("../archive.json");
const newArticle = [data[0]];

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/data.json", (req, res) => {
    axios
        .get(
            "https://api.nytimes.com/svc/archive/v1/2020/5.json?api-key=XD1JqAs9ADh0tacDW11hYchXnOXeD08s"
        )
        .then((response) => {
            // console.log("response: ", response.data.response.docs);
            // console.log("first entry: ", nytimesArray[0].web_url);

            // in the future, possibly remove loop altogether and randomly generate an index number, random year, and random month to pull a single new story every 24 hours.

            const nytimesArray = response.data.response.docs;
            const archive = [];

            for (let i = 4237; i < nytimesArray.length; i++) {
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
            // console.log("new archive: ", archive);

            fs.writeFileSync("archive.json", JSON.stringify(archive, null, 4));
        });
});

app.get("/start", (req, res) => {
    res.json(createPuzzle());
});

function getNewArticle() {
    const randomNum = () => {
        return Math.floor(Math.random() * (111 - 1) + 1);
    };
    while (newArticle) {
        newArticle.pop();
        newArticle.push(data[randomNum()]);
        console.log("new article paragraph after update: ", newArticle);
        return;
    }
}
// getNewArticle();
function getPuzzleObj() {
    // console.log("stored article: ", newArticle);
    const leadParagraph = newArticle[0]?.lead_paragraph;
    console.log("stored paragraph: ", leadParagraph);

    const puzzleObj = leadParagraph?.split(" "); // this version uses split
    // const puzzleObj = leadParagraph?.match(/\w+|\s+|[^\s\w]+/g); // this version uses regex
    console.log("puzzle object: ", puzzleObj);
    arr = [...puzzleObj];
    console.log("arr: ", arr);
}
// getPuzzleObj();
let arr = [];

function createPuzzle() {
    getNewArticle();
    getPuzzleObj();
    const newPuzzle = arr.map((obj) => ({
        Content: obj,
        Revealed: false,
        CharLength: obj.length,
    }));
    newPuzzle.unshift(newArticle[0]);
    console.log("new puzzle: ", newPuzzle);

    for (let i = 0; i < newPuzzle.length; i++) {
        console.log("Each word length: ", newPuzzle[i].Content);
        // console.log("new puzzle: ", newPuzzle[3]);
        // newPuzzle[i].Content.match(/^[.,:!?'"]/)
        //     ? (newPuzzle[i].Revealed = true)
        //     : null;
    }
    return newPuzzle;
}
// createPuzzle();

// cron.schedule("* * * * *", () => {
//     console.log("Updating the article every minutes");
// });

// do something with data and then store it in db
// routes to call and receive from db data

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

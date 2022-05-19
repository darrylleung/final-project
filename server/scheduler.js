const cron = require("node-cron");
const fs = require("fs");
const axios = require("axios");
const data = require("../json/archive.json");
const newArticle = [data[0]];
const puzzleData = require("../json/dailypuzzle.json");
const dailyPuzzle = [puzzleData[0]];
let arr = [];


let apiSecret;
if (process.env.NODE_ENV == "production") {
    apiSecret = process.env.API_KEY;
} else {
    apiSecret = require("../secrets.json").API_KEY;
}

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

cron.schedule(
    "0 0 0 * * *",
    () => {
        console.log("Updated every day, Berlin Time!");
        const randomYear = () => {
            return Math.floor(Math.random() * (2022 - 1989) + 1989);
        };
        const randomMonth = () => {
            return Math.floor(Math.random() * (12 - 1) + 1);
        };
        axios
            .get(
                `https://api.nytimes.com/svc/archive/v1/${randomYear()}/${randomMonth()}.json?api-key=${apiSecret}`
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
                    "json/archive.json",
                    JSON.stringify(archive, null, 4)
                );

                dailyPuzzle.pop();
                dailyPuzzle.push(createPuzzle());

                fs.writeFileSync(
                    "json/dailypuzzle.json",
                    JSON.stringify(dailyPuzzle, null, 4)
                );
            });
    },
    {
        timezone: "Europe/Berlin",
    }
);

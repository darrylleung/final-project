import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { loadGameState } from "./redux/game-state/slice";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Puzzle from "./puzzle";
import MenuButton from "./menubutton";
import Scorecard from "./scorecard";
import Menu from "./menu";

export default function App() {
    const dispatch = useDispatch();
    const [puzzle, setPuzzle] = useState();
    const [filteredPuzzle, setFilteredPuzzle] = useState();
    const [guesses, setGuesses] = useState([]);
    const [values, setValues] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [hints, setHints] = useState([]);
    const [unrevealedWords, setUnrevealedWords] = useState();
    const [numOfGuesses, setNumOfGuesses] = useState([]);
    const [numOfHints, setNumOfHints] = useState([]);
    const [finalScore, setFinalScore] = useState([]);
    const [scorecard, setScorecard] = useState(false);
    const [correctGuesses, setCorrectGuesses] = useState([]);
    const [menuIsVisible, setMenuIsVisible] = useState(false);
    const textInput = useRef();
    // const score = [];

    useEffect(() => {
        (async () => {
            const res = await fetch("/start");
            const data = await res.json();
            console.log("data: ", data);
            setPuzzle(data);
            dispatch(loadGameState(data));
            setFilteredPuzzle(data.filter((data, index) => index !== 0));
            setHints(data.filter((data, index) => index !== 0));
            setUnrevealedWords(
                data.filter((obj, index) => index !== 0 && !obj.Revealed)
            );
            setNumOfHints(
                data.filter((obj, index) => index !== 0 && !obj.Revealed)
            );
        })();
    }, []);

    numOfHints && console.log("num of hints: ", numOfHints.length);

    useEffect(() => {
        (async () => {
            const res = await fetch("/leaderboard");
            const data = await res.json();
            // const { username, puzzle_id, score } = data;
            console.log("data received from /leaderboard", data);
            // if (!userId) {
            //     console.log("no data sent");
            // } else {
            //     console.log("received something!");
            // }
        })();
    }, []);

    const handleChange = ({ target }) => {
        setValues({
            ...values,
            [target.name]: target.value.trim(),
        });
        setSearchTerm(target.value);
    };

    const handleSubmit = (e) => {
        let { guess } = values;
        e.preventDefault();
        for (let i = 0; i < filteredPuzzle.length; i++) {
            if (
                guess.toUpperCase() === filteredPuzzle[i].Content.toUpperCase()
            ) {
                console.log("Match!");
                let puzzleCopy = [...filteredPuzzle];
                puzzleCopy[
                    filteredPuzzle.indexOf(filteredPuzzle[i])
                ].Revealed = true;
                let newUnrevealed = [...unrevealedWords];
                newUnrevealed = newUnrevealed.filter(
                    (obj) => obj.Content != filteredPuzzle[i].Content
                );
                let newCorrectGuesses = [...correctGuesses];
                if (!newCorrectGuesses.includes(filteredPuzzle[i].Content)) {
                    newCorrectGuesses = [
                        ...correctGuesses,
                        filteredPuzzle[i].Content,
                    ];
                }
                let newGuesses = [...numOfGuesses];
                if (!newGuesses.includes(guess.toUpperCase())) {
                    newGuesses = [...numOfGuesses, guess.toUpperCase()];
                }
                setNumOfGuesses(newGuesses);
                setCorrectGuesses(newCorrectGuesses);
                setUnrevealedWords(newUnrevealed);
                setFilteredPuzzle(puzzleCopy);
            } else {
                console.log("No match");
                let newIncorrectGuesses = [...guesses];
                if (!newIncorrectGuesses.includes(guess)) {
                    newIncorrectGuesses = [guess, ...guesses];
                }
                let newGuesses = [...numOfGuesses];
                if (!newGuesses.includes(guess.toUpperCase())) {
                    newGuesses = [...numOfGuesses, guess.toUpperCase()];
                }
                setNumOfGuesses(newGuesses);
                setGuesses(newIncorrectGuesses);
            }
        }

        if (filteredPuzzle.every((obj) => obj.Revealed)) {
            setScorecard(true);
        }

        textInput.current.focus();
        setSearchTerm("");
    };

    const handleHint = (e) => {
        e.preventDefault();
        // console.log("filtered puzzle: ", filteredPuzzle);
        // console.log("hints: ", hints);
        let newHint = [...hints];
        let newUnrevealed = [...unrevealedWords];

        const randomHint = () => {
            return newUnrevealed
                .sort(() => {
                    return 0.5 - Math.random();
                })
                .pop();
        };

        let randomNum = randomHint();

        if (!randomNum) {
            alert("No more hints!");
        } else {
            newHint[randomNum.id].Revealed = true;
        }

        // let hintCount = [...numOfHints, randomNum];

        // setNumOfHints(newUnrevealed);
        setUnrevealedWords(newUnrevealed);
        setHints(newHint);
        textInput.current.focus();

        if (filteredPuzzle.every((obj) => obj.Revealed)) {
            setFinalScore(
                +`${numOfGuesses.length}` + +`${numOfHints.length * 2}`
            );
            console.log("finalScore:", finalScore);
            setScorecard(true);
            //     score.push(finalScore).push(username);
            //     fetch("/leaderboard", {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify(values),
            //     })
            //         .then((res) => res.json())
            //         .then((data) => {
            //             data.success ? location.replace("/") : setError(true);
            //         })
            //         .catch((err) => {
            //             console.log("err with registration or login: ", err);
            //             setError(true);
            //         });
        }
    };

    const showMenu = () => {
        if (!menuIsVisible) {
            setMenuIsVisible(true);
        } else {
            setMenuIsVisible(false);
        }
    };

    const closeOverlay = () => {
        setScorecard(false);
    };

    // puzzle && console.log("Puzzle: ", puzzle[0].headline);
    // filteredPuzzle &&
    //     console.log("Filtered Puzzle: ", filteredPuzzle[0].Content);
    // unrevealedWords && console.log("unrevealed words: ", unrevealedWords);
    // correctGuesses && console.log("correct guesses: ", correctGuesses);
    // correctGuesses &&
    //     console.log("correct guesses length: ", correctGuesses.length);
    // numOfGuesses &&
    //     console.log("number of guesses total: ", numOfGuesses.length);
    // numOfHints && console.log("number of hints total: ", numOfHints.length);
    unrevealedWords && console.log("unrevealedwords: ", unrevealedWords.length);

    return (
        <div className="appContainer">
            <BrowserRouter>
                <div className="header">
                    <span className="title">Redacted</span>
                    <span className="titleOverlay">#######</span>
                    <MenuButton showMenu={showMenu} />
                </div>
                <Route exact path="/">
                    <Puzzle
                        puzzle={puzzle}
                        hints={hints}
                        filteredPuzzle={filteredPuzzle}
                        handleSubmit={handleSubmit}
                        searchTerm={searchTerm}
                        handleChange={handleChange}
                        handleHint={handleHint}
                        guesses={guesses}
                        textInput={textInput}
                    />
                </Route>
                <Menu menuIsVisible={menuIsVisible} />
                {menuIsVisible && (
                    <div className="menuOverlay" onClick={showMenu} />
                )}
                {scorecard && (
                    <Scorecard
                        puzzle={puzzle}
                        numOfGuesses={numOfGuesses}
                        numOfHints={numOfHints}
                        closeOverlay={closeOverlay}
                    />
                )}
            </BrowserRouter>
        </div>
    );
}

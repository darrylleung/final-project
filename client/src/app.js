import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadGameState } from "./redux/game-state/slice";

export default function App() {
    const dispatch = useDispatch();
    const [puzzle, setPuzzle] = useState();
    const [filteredPuzzle, setFilteredPuzzle] = useState();
    const [guesses, setGuesses] = useState([]);
    const [values, setValues] = useState();
    const [searchTerm, setSearchterm] = useState("");
    const [hints, setHints] = useState();
    const [unrevealedWords, setUnrevealedWords] = useState();
    const [scorecard, setScorecard] = useState(false);
    const [correctGuesses, setCorrectGuesses] = useState([]);

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
        })();
    }, []);

    const handleChange = ({ target }) => {
        setValues({
            ...values,
            [target.name]: target.value.trim(),
        });
        setSearchterm(target.value);
    };

    const handleSubmit = (e) => {
        let { guess } = values;
        e.preventDefault();
        for (let i = 0; i < filteredPuzzle.length; i++) {
            if (guess === filteredPuzzle[i].Content) {
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
                setCorrectGuesses(newCorrectGuesses);
                setUnrevealedWords(newUnrevealed);
                setFilteredPuzzle(puzzleCopy);
            } else {
                console.log("No match");
                let newIncorrectGuesses = [...guesses];
                if (!newIncorrectGuesses.includes(guess)) {
                    newIncorrectGuesses = [...guesses, guess];
                }
                setGuesses(newIncorrectGuesses);
            }
        }

        if (filteredPuzzle.every((obj) => obj.Revealed)) {
            setScorecard(true);
        }

        setSearchterm("");
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

        setUnrevealedWords(newUnrevealed);
        setHints(newHint);

        if (filteredPuzzle.every((obj) => obj.Revealed)) {
            setScorecard(true);
        }
    };

    // puzzle && console.log("Puzzle: ", puzzle[0].headline);
    // filteredPuzzle &&
    //     console.log("Filtered Puzzle: ", filteredPuzzle[0].Content);
    unrevealedWords && console.log("unrevealed words: ", unrevealedWords);
    // correctGuesses && console.log("correct guesses: ", correctGuesses);

    return (
        <div className="appContainer">
            <div className="header">
                <span className="title">Redacted</span>
                <span className="titleOverlay">#######</span>
            </div>
            {puzzle && (
                <>
                    <div className="headlineContainer">
                        <span className="headline">{puzzle[0].headline}</span>
                    </div>
                    <div className="puzzleContainer">
                        <div className="overlay">
                            {hints?.map((data, index) => {
                                return (
                                    <span
                                        className={`redaction ${
                                            data.Revealed ? "remove" : null
                                        }`}
                                        key={index}
                                    >{`${
                                        data.CharLength > 1
                                            ? ` ${data.Content}`
                                            : ` ${data.Content} `
                                    }`}</span>
                                );
                            })}
                        </div>
                        <div name="do you really want to cheat?">
                            <div name="still time to turn back">
                                <div name="i'm serious!">
                                    <div name="last chance!">
                                        <div
                                            name="i lied. but this really is the last chance."
                                            className="puzzleBlock"
                                        >
                                            {filteredPuzzle?.map(
                                                (data, index) => {
                                                    return (
                                                        <span
                                                            className="text"
                                                            key={index}
                                                        >{`${
                                                            data.CharLength > 1
                                                                ? ` ${data.Content}`
                                                                : ` ${data.Content} `
                                                        }`}</span>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <input
                        value={searchTerm}
                        name="guess"
                        placeholder="Search..."
                        autoComplete="off"
                        onChange={handleChange}
                    />
                </form>
                <div className="buttonContainer">
                    <button className="submit" type="submit">
                        Submit
                    </button>
                    <button className="hint" onClick={handleHint}>
                        Hint
                    </button>
                </div>
            </div>
            <div className="guesses">
                {guesses?.map((data, index) => {
                    return (
                        <span className="guesses" key={index}>
                            {data}
                        </span>
                    );
                })}
            </div>
            {scorecard && (
                <div className="scorecard">
                    <h1>Scorecard</h1>
                </div>
            )}
        </div>
    );
}

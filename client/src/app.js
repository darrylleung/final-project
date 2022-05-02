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
    const [visible, setVisible] = useState(false);
    const [hints, setHints] = useState([]);

    useEffect(() => {
        (async () => {
            const res = await fetch("/start");
            const data = await res.json();
            console.log("data: ", data);
            setPuzzle(data);
            dispatch(loadGameState(data));
            setFilteredPuzzle(data.filter((data, index) => index !== 0));
        })();
    }, []);

    const handleChange = ({ target }) => {
        console.log("User is typing in the input field");
        console.log("Which input field is the user typing in: ", target.name);
        console.log("What is the user typing: ", target.value);
        console.log("Number of characters typed: ", target.value.length);
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
                // setVisible(true);
                console.log("Match!");
                // console.log(
                //     "The index of the matched obj is: ",
                //     filteredPuzzle.indexOf(filteredPuzzle[i])
                // );

                let puzzleCopy = [...filteredPuzzle];
                puzzleCopy[
                    filteredPuzzle.indexOf(filteredPuzzle[i])
                ].Revealed = true;
                setFilteredPuzzle(puzzleCopy);
                console.log("puzzle with update: ", filteredPuzzle);
            } else {
                console.log("No match");
                if (i == filteredPuzzle.length - 1) {
                    setGuesses((guesses) => [...guesses, guess]);
                }
            }
        }
        setSearchterm("");
    };

    // const handleHint = (e) => {
    //     e.preventDefault();
    //     let revealedPuzzle = [...filteredPuzzle];
    //     revealedPuzzle.filter()

    // }

    // puzzle && console.log("Puzzle: ", puzzle[0].headline);
    // filteredPuzzle &&
    //     console.log("Filtered Puzzle: ", filteredPuzzle[0].Content);

    return (
        <div>
            {puzzle && (
                <>
                    <h1>{puzzle[0].headline}</h1>
                    <div className="overlay">
                        {filteredPuzzle?.map((data, index) => {
                            return (
                                <span
                                    className={`textblock ${
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
                    <div>
                        {filteredPuzzle?.map((data, index) => {
                            return (
                                <span
                                    className={`text ${
                                        data.Revealed ? "visible" : null
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
                </>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    value={searchTerm}
                    name="guess"
                    placeholder="Have a guess"
                    autoComplete="off"
                    onChange={handleChange}
                />
                <button type="submit">Submit</button>
            </form>
            {/* <button onClick={handleHint}>Hint</button> */}
            <div>{guesses}</div>
        </div>
    );
}

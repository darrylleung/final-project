import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadGameState } from "./redux/game-state/slice";
import { useForm } from "./hooks/handle-form";

export default function App() {
    const dispatch = useDispatch();
    const [puzzle, setPuzzle] = useState();
    const [values, handleChange] = useForm();
    const [visible, setVisible] = useState(false);
    const [filteredPuzzle, setFilteredPuzzle] = useState();

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

    const handleSubmit = (e) => {
        const { guess } = values;
        e.preventDefault();
        for (let i = 0; i < filteredPuzzle.length; i++) {
            if (guess === filteredPuzzle[i].Content) {
                // setVisible(true);
                console.log("Match!");
                console.log(
                    "The index of the matched obj is: ",
                    filteredPuzzle.indexOf(filteredPuzzle[i])
                );
                let puzzleCopy = [...filteredPuzzle];
                puzzleCopy[
                    filteredPuzzle.indexOf(filteredPuzzle[i])
                ].Revealed = true;
                setFilteredPuzzle(puzzleCopy);
                console.log("puzzle with update: ", filteredPuzzle);
            } else {
                console.log("No match");
            }
        }
    };

    // puzzle && console.log("Puzzle: ", puzzle[0].headline);
    // filteredPuzzle &&
    //     console.log("Filtered Puzzle: ", filteredPuzzle[0].Content);

    return (
        <div>
            {puzzle && (
                <>
                    <h1>{puzzle[0].headline}</h1>
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
                                            : `${data.Content}`
                                    }`}</span>
                            );
                        })}
                    </div>
                </>
            )}

            <input
                name="guess"
                placeholder="Have a guess"
                onChange={handleChange}
            ></input>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadGameState } from "./redux/game-state/slice";
import { useForm } from "./hooks/handle-form";

export default function App() {
    const dispatch = useDispatch();
    const [puzzle, setPuzzle] = useState();
    const [values, handleChange] = useForm();
    const [puzzleObj, setPuzzleObj] = useState();
    const [filteredPuzzle, setFilteredPuzzle] = useState();

    useEffect(() => {
        (async () => {
            const res = await fetch("/start");
            const data = await res.json();
            console.log("data: ", data);
            setPuzzle(data);
            dispatch(loadGameState(data));
            setFilteredPuzzle(data.filter((v, k) => k !== 0));
        })();
    }, []);

    // useEffect(() => {
    //     let abort = false;
    //     const filteredPuzzle = puzzle.filter((v, k) => k !== 0);
    //     if (!abort) {
    //         setFilteredPuzzle(filteredPuzzle);
    //     }

    //     return () => {
    //         abort = true;
    //     };
    // }, [puzzle]);

    // console.log("puzzle object: ", puzzle?.lead_paragraph.split(" "));

    // console.log("puzzle array: ", arr);

    // if (puzzle) {
    //     setPuzzleObj(puzzle?.lead_paragraph.split(" "));
    // }

    // arr.content = arr.
    // setPuzzleObj(puzzle?.lead_paragraph.split(" "));

    // const handleSubmit = (e) => {
    //     console.log("values: ", values);
    //     e.preventDefault();
    //     if (values === ) {

    //     })
    // };
    puzzle && console.log("Puzzle: ", puzzle[0].headline);
    filteredPuzzle && console.log("Filtered Puzzle: ", filteredPuzzle);

    return (
        <div>
            {puzzle && (
                <>
                    <h1>{puzzle[0].headline}</h1>
                    <div>
                        {filteredPuzzle?.map((data, index) => {
                            return <div key={index}>{data.content}</div>;
                        })}
                    </div>
                </>
            )}

            {/* <input onClick={handleSubmit}>Submit</input> */}
        </div>
    );
}

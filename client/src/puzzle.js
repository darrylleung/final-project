export default function Puzzle(props) {
    const {
        puzzle,
        hints,
        filteredPuzzle,
        handleSubmit,
        searchTerm,
        handleChange,
        handleHint,
        guesses,
        textInput,
    } = props;

    return (
        <>
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
                <form className="search" onSubmit={handleSubmit}>
                    <input
                        ref={textInput}
                        className="guess"
                        value={searchTerm}
                        name="guess"
                        placeholder="Search..."
                        autoComplete="off"
                        onChange={handleChange}
                    />
                </form>
                <div className="buttonContainer">
                    <button className="submit" onClick={handleSubmit}>
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
        </>
    );
}

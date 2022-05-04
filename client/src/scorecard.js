export default function Scorecard(props) {
    const { puzzle, numOfGuesses, numOfHints, closeOverlay } = props;

    return (
        <>
            <div className="scorecard">
                <div className="metadata">
                    <span className="headline">{puzzle[0].headline}</span>
                    <span className="byline">{puzzle[0].byline}</span>
                    <a
                        className="story"
                        href={`${puzzle[0].web_url}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View the story
                    </a>
                </div>
                <div className="scoreContainer">
                    <div className="scoreGuesses">
                        <span className="scoreNum">{numOfGuesses.length}</span>
                        <span className="score">Guesses</span>
                    </div>
                    <div className="scoreHints">
                        <span className="scoreNum">{numOfHints.length}</span>
                        <span className="score">Hints</span>
                    </div>
                    <div className="scoreTotal">
                        <span className="scoreNum">
                            {+`${numOfGuesses.length}` +
                                +`${numOfHints.length * 2}`}
                        </span>
                        <span className="score">Total Score</span>
                    </div>
                </div>
            </div>
            <div className="menuOverlay" onClick={closeOverlay} />
        </>
    );
}

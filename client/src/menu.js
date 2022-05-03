export default function MenuButton(props) {
    const { showMenu } = props;

    return (
        <div className="menuButtonContainer">
            <img
                className="menuButton"
                onClick={showMenu}
                src="./Hamburger_icon.svg.png"
            />
        </div>
    );
}

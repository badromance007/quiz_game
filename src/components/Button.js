export default function Button(props) {
    return (
        <button
            className={`button ${props.sizeClass}`}
            onClick={props.handleGame}
        >
            {props.text}
        </button>
    )
}
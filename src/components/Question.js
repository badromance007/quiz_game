import { START, PROGRESS, END } from '../constants/Constants';

export default function Question(props) {
    const answersElements = props.question.answers.map((answer, index) => (
        <span
            key={index}
            className={`answer ${getAnswerClass(answer)}`}
            {...(
                props.gameStatus === PROGRESS &&
                {onClick: () => props.chooseAnswer(props.question.id, answer)}
            )}
        >
            {answer}
        </span>
    ))

    function getAnswerClass(answer) {
        let classString = ''

        switch(props.gameStatus) {
            case PROGRESS:
                classString = props.question.chosen_answer === answer ? 'chosen-answer' : ''
                break
            case END:
                if (props.question.correct_answer === answer) {
                    classString = 'right-answer'
                } else if (props.question.correct_answer !== props.question.chosen_answer &&
                    props.question.chosen_answer === answer) {
                        classString = 'wrong-answer--chosen'
                } else {
                    classString = 'wrong-answer'
                }
                break
            default:
                classString = ''
        }
        return classString
    }

    return (
        <div className="question">
            <h3>{props.question.question}</h3>
            <div className="answer-container">
                {answersElements}   
            </div>
        </div>
    )
}
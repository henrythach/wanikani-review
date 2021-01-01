import React from "react";
import { CARD_COLORS, getAnswers, getRadicalImageUrl } from "../helpers";
import { IStudyItem } from "../types/app";
import { IWanikaniRadical, IWanikaniSubject } from "../types/api";
import { KanaInput } from "./KanaInput";

export interface IStudyCardProps {
  studyItem: IStudyItem
  onAnswered: () => void
}

export function getDisplay(subject: IWanikaniSubject) {
  if (subject.characters) {
    return (
      <h1
        style={{
          color: '#ffffff',
          fontSize: '54pt',
          paddingLeft: '0.5em',
          paddingRight: '0.5em'
        }}
      >
        {subject.characters}
      </h1>
    )
  }

  const radicalUrl = getRadicalImageUrl(subject as IWanikaniRadical)
  return (
    <img
      alt={`Radical for ${subject.meanings.join(', ')}`}
      src={radicalUrl}
      style={{ maxHeight: '85px', maxWidth: '85px', margin: '0 auto' }}
    />
  )
}

const StudyCard = ({ studyItem, onAnswered }: IStudyCardProps) => {
  const possibleAnswers = getAnswers(studyItem)
  const subject = studyItem.subject

  const [value, setValue] = React.useState('')
  const [correctAnswers, setCorrectAnswers] = React.useState<string[]>([])
  const [showAnswer, setShowAnswer] = React.useState(false)
  const [answers, setAnswers] = React.useState<string[]>(possibleAnswers)

  const onChange = (userInput: string) => {
    setValue(userInput)

    const userInputLowerCase = userInput.toLocaleLowerCase().trim()
    const answer = answers.find((a) => a.toLocaleLowerCase() === userInputLowerCase)
    if (answer) {
      setCorrectAnswers([...correctAnswers, answer])
      setValue('')

      const remainingAnswers = answers.filter((a) => a.toLocaleLowerCase() !== userInputLowerCase)
      setAnswers(remainingAnswers)
    }
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      setShowAnswer(!showAnswer)
    }

    if (e.key === 'ArrowDown') {
      setValue('')
      setShowAnswer(false)
      setAnswers(possibleAnswers)
      setCorrectAnswers([])
    }

    if (e.key === 'Enter' && correctAnswers.length) {
      onAnswered()
    }
  }

  React.useEffect(() => {
    if (answers.length === 0) {
      onAnswered()
    }
  }, [answers, onAnswered])

  return (
    <div
      style={{
        minWidth: '30rem',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: CARD_COLORS[studyItem.subject_type],
        textAlign: 'center',
        border: '1px solid #cccccc',
        position: 'relative'
      }}
    >
      {correctAnswers.length ? (
        <div
          style={{
            position: 'absolute',
            right: 0,
            padding: '0.25em 1em',
            backgroundColor: 'green',
            color: '#ffffff',
            fontSize: '10pt',
            fontWeight: 'bold'
          }}
        >
          {correctAnswers.length} / {possibleAnswers.length}
        </div>
      ) : null}
      <div
        style={{
          height: '150px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {getDisplay(subject)}
      </div>
      {showAnswer ? (
        <div style={{ fontSize: '11px', color: '#ffffff' }}>{answers.join(', ')}</div>
      ) : null}
      <footer
        style={{
          backgroundColor: '#444444',
          color: '#ffffff',
          paddingTop: '0.5em',
          paddingBottom: '0.5em',
          fontSize: '16pt',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        <span>
          {studyItem.subject_type} {studyItem.study_type}
        </span>
      </footer>
      <KanaInput
        studyType={studyItem.study_type}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
      />
    </div>
  )
}

export default StudyCard

import React from 'react'
import { CARD_COLORS, getAnswers, getRadicalImageUrl } from '../helpers'
import { IStudyItem } from '../types/app'
import { IWanikaniRadical, IWanikaniSubject } from '../types/api'
import { KanaInput } from './KanaInput'

const StudyCard = ({ studyItem, onAnswered, goBack, goForward }: IStudyCardProps) => {
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

    if (e.key === 'ArrowLeft' && value.trim() === '') {
      goBack()
    }

    if (e.key === 'ArrowRight' && value.trim() === '') {
      goForward()
    }
  }

  React.useEffect(() => {
    if (answers.length === 0) {
      onAnswered()
    }
  }, [answers, onAnswered])

  return (
    <div className='StudyCard' style={{ backgroundColor: CARD_COLORS[studyItem.subject_type] }}>
      {correctAnswers.length ? (
        <div className='StudyCard__remaining-counter'>
          {correctAnswers.length} / {possibleAnswers.length}
        </div>
      ) : null}
      <div className='StudyCard__display'>{getDisplay(subject)}</div>
      <div className='StudyCard__correct-answers'>{correctAnswers.join(', ')}</div>
      <footer className='StudyCard_footer'>
        <span>
          {studyItem.subject_type} {studyItem.study_type}
        </span>
      </footer>
      <KanaInput
        studyType={studyItem.study_type}
        value={value}
        onChange={onChange}
        onKeyUp={onKeyUp}
        placeholder={showAnswer ? answers.join(', ') : ''}
      />
    </div>
  )
}

export default StudyCard

interface IStudyCardProps {
  studyItem: IStudyItem
  onAnswered: () => void
  goBack: () => void
  goForward: () => void
}

function getDisplay(subject: IWanikaniSubject) {
  if (subject.characters) {
    return (
      <p
        style={{
          color: '#ffffff',
          fontSize: '54pt',
          paddingLeft: '0.5em',
          paddingRight: '0.5em'
        }}
      >
        {subject.characters}
      </p>
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

import React from 'react'
import './App.css'
import { db, IReviewStatisticItem } from './WanikaniDatabase'
import { ReviewList } from './components/ReviewList'
import { IStudyItem } from './types/app'
import { CARD_COLORS, createStudyItems, shuffleArray } from './helpers'
import StudyCard from './components/StudyCard'
import SubjectCheckbox from './components/SubjectCheckbox'

const NUMBER_REVIEW_ITEMS = 200

function App() {
  const [reviewItems, setReviewItems] = React.useState<IReviewStatisticItem[]>([])
  const [studyIndex, setStudyIndex] = React.useState(0)
  const [studyItems, setStudyItems] = React.useState<IStudyItem[]>([])
  const [byReading, setByReading] = React.useState<IReviewStatisticItem[]>([])
  const [byMeaning, setByMeaning] = React.useState<IReviewStatisticItem[]>([])
  const [byRecent, setByRecent] = React.useState<IReviewStatisticItem[]>([])
  const [byPercentage, setByPercentage] = React.useState<IReviewStatisticItem[]>([])
  const [byUpdated, setByUpdated] = React.useState<IReviewStatisticItem[]>([])

  const [isMeaning, setIsMeaning] = React.useState(true)
  const [isReading, setIsReading] = React.useState(true)

  React.useEffect(() => {
    ;(async () => {
      await db.sync()

      setByReading(await db.getReviewsByReadingStreak(NUMBER_REVIEW_ITEMS))
      setByMeaning(await db.getReviewsByMeaningStreak(NUMBER_REVIEW_ITEMS))
      setByRecent(await db.getReviewsByMostRecent(NUMBER_REVIEW_ITEMS))
      setByPercentage(await db.getReviewsByPercentageCorrect(NUMBER_REVIEW_ITEMS))
      setByUpdated(await db.getReviewByUpdated(NUMBER_REVIEW_ITEMS))
    })()
  }, [])

  React.useEffect(() => {
    setStudyItems(
      shuffleArray(
        createStudyItems(reviewItems).filter((studyItem) => {
          if (!(isReading || isMeaning)) {
            return true
          }

          return (
            (isReading ? studyItem.study_type === 'reading' : false) ||
            (isMeaning ? studyItem.study_type === 'meaning' : false)
          )
        })
      )
    )
    setStudyIndex(0)
  }, [isReading, isMeaning, reviewItems])

  const onAnswered = () => {
    setStudyIndex(studyIndex + 1)
  }

  const goBack = () => {
    setStudyIndex(Math.max(0, studyIndex - 1))
  }

  const goForward = () => {
    setStudyIndex(studyIndex + 1)
  }

  const onSelect = (reviewItems: IReviewStatisticItem[]) => {
    setReviewItems(reviewItems)
  }

  if (
    byReading.length === 0 ||
    byMeaning.length === 0 ||
    byRecent.length === 0 ||
    byPercentage.length === 0
  ) {
    return <p>Loading...</p>
  }

  const studyItem = studyItems[studyIndex % studyItems.length]
  return (
    <div className='App'>
      <nav style={{ display: 'flex', flexDirection: 'row', marginBottom: '1em' }}>
        <SubjectCheckbox checked={isMeaning} onChange={() => setIsMeaning(!isMeaning)}>
          Meaning
        </SubjectCheckbox>
        <SubjectCheckbox checked={isReading} onChange={() => setIsReading(!isReading)}>
          Reading
        </SubjectCheckbox>
      </nav>
      {studyItem ? (
        <StudyCard
          key={studyItem.study_type + studyItem.subject.slug + studyIndex}
          studyItem={studyItem}
          onAnswered={onAnswered}
          goBack={goBack}
          goForward={goForward}
        />
      ) : (
        <h2>[[ Select a list below to review those items ]]</h2>
      )}
      <div style={{ marginTop: '1em', lineHeight: '2em' }}>
        {reviewItems.map((reviewItem) => (
          <span
            style={{
              color: '#ffffff',
              backgroundColor: CARD_COLORS[reviewItem.subject_type],
              padding: '0 0.5em',
              margin: '0.15em',
              borderRadius: '0.25em',
              display: 'inline-block'
            }}
          >
            {reviewItem.subject?.characters}
          </span>
        ))}
      </div>
      <div className='Review-List-Container'>
        <ReviewList onSelect={onSelect} items={byReading} title='Low reading streak' />
        <ReviewList onSelect={onSelect} items={byMeaning} title='Low meaning streak' />
        <ReviewList onSelect={onSelect} items={byRecent} title='Recent items' />
        <ReviewList onSelect={onSelect} items={byPercentage} title='Correct percentage' />
        <ReviewList onSelect={onSelect} items={byUpdated} title='By updated' />
      </div>
    </div>
  )
}

export default App

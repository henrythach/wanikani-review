import React from 'react'
import './App.css'
import { db, IReviewStatisticItem } from './WanikaniDatabase'
import { ReviewList } from './components/ReviewList'
import { IStudyItem } from './types/app'
import { createStudyItems, shuffleArray } from "./helpers";
import StudyCard from './components/StudyCard'

const NUMBER_REVIEW_ITEMS = 20

function App() {
  const [studyIndex, setStudyIndex] = React.useState(0)
  const [studyItems, setStudyItems] = React.useState<IStudyItem[]>([])
  const [byReading, setByReading] = React.useState<IReviewStatisticItem[]>([])
  const [byMeaning, setByMeaning] = React.useState<IReviewStatisticItem[]>([])
  const [byRecent, setByRecent] = React.useState<IReviewStatisticItem[]>([])
  const [byPercentage, setByPercentage] = React.useState<IReviewStatisticItem[]>([])

  React.useEffect(() => {
    ;(async () => {
      await db.sync()

      setByReading(await db.getReviewsByReadingStreak(NUMBER_REVIEW_ITEMS))
      setByMeaning(await db.getReviewsByMeaningStreak(NUMBER_REVIEW_ITEMS))
      setByRecent(await db.getReviewsByMostRecent(NUMBER_REVIEW_ITEMS))
      setByPercentage(await db.getReviewsByPercentageCorrect(NUMBER_REVIEW_ITEMS))
    })()
  }, [])

  const onAnswered = () => {
    setStudyIndex(studyIndex + 1)
  }

  const goBack = () => {
    setStudyIndex(Math.max(0, studyIndex - 1))
  }

  const goForward = () => {
    setStudyIndex(studyIndex + 1)
  }

  const onSelect = (items: IReviewStatisticItem[]) => {
    setStudyItems(shuffleArray(createStudyItems(items)))
    setStudyIndex(0)
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
      <div className='Review-List-Container'>
        <ReviewList onSelect={onSelect} items={byReading} title='Low reading streak' />
        <ReviewList onSelect={onSelect} items={byMeaning} title='Low meaning streak' />
        <ReviewList onSelect={onSelect} items={byRecent} title='Recent items' />
        <ReviewList onSelect={onSelect} items={byPercentage} title='Correct percentage' />
      </div>
    </div>
  )
}

export default App

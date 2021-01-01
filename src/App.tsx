import React from 'react'
import './App.css'
import { db, IReviewStatisticItem } from './WanikaniDatabase'
import { ReviewList } from './components/ReviewList'
import { IStudyItem } from './types/app'
import { createStudyItems } from './helpers'
import StudyCard from './components/StudyCard'

const NUMBER_REVIEW_ITEMS = 25

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
    setStudyItems(createStudyItems(items))
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
          key={studyItem.study_type + studyItem.subject.slug}
          studyItem={studyItem}
          onAnswered={onAnswered}
          goBack={goBack}
          goForward={goForward}
        />
      ) : <h2>[[ Select a list to review ]]</h2>}
      <div className='Review-List-Container'>
        <ReviewList onSelect={onSelect} title='Low reading streak' items={byReading} />
        <ReviewList onSelect={onSelect} title='Low meaning streak' items={byMeaning} />
        <ReviewList onSelect={onSelect} title='Recent items' items={byRecent} />
        <ReviewList onSelect={onSelect} title='Correct percentage' items={byPercentage} />
      </div>
    </div>
  )
}

export default App

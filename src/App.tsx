import React from "react";
import "./App.css";
import { db, IReviewStatisticItem } from "./WanikaniDatabase";
import { ReviewList } from "./components/ReviewList";
import { IStudyItem } from "./types/app";
import { createStudyItems } from "./helpers";
import StudyCard from "./components/StudyCard";

function App() {
  const [studyIndex, setStudyIndex] = React.useState(0)
  const [studyItems, setStudyItems] = React.useState<IStudyItem[]>([])
  const [reviewItems, setReviewItems] = React.useState<IReviewStatisticItem[]>([])

  React.useEffect(() => {
    const doThing = async () => {
      await db.sync()

      const reviewItems = await db.getReviewsByReadingStreak(20)
      setReviewItems(reviewItems)
      setStudyItems(createStudyItems(reviewItems))
    }

    doThing().then((_) => {})
  }, [])

  if (reviewItems.length === 0 || studyItems.length === 0) {
    return <p>Loading...</p>
  }

  const studyItem = studyItems[studyIndex % studyItems.length]
  const onAnswered = () => {
    setStudyIndex(studyIndex + 1)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2em',
        maxWidth: '50rem',
        margin: '2em auto'
      }}
    >
      <button onClick={() => setStudyIndex(Math.max(0, studyIndex - 1))}>Previous</button>
      <button onClick={() => setStudyIndex(studyIndex + 1)}>Next</button>
      <StudyCard
        key={studyItem.study_type + studyItem.subject.slug}
        studyItem={studyItem}
        onAnswered={onAnswered}
      />
      <div style={{ marginTop: '2em', width: '100%' }}>
        <ReviewList items={reviewItems} />
      </div>
    </div>
  )
}

export default App

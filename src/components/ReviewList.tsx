import React from 'react'
import { IReviewStatisticItem } from '../WanikaniDatabase'
import { CARD_COLORS, getItemPrimaryMeaning, getItemPrimaryReading } from '../helpers'
import SubjectCheckbox from './SubjectCheckbox'

export const ReviewList = (props: {
  title: string
  onSelect: (items: IReviewStatisticItem[]) => void
  items: IReviewStatisticItem[]
}) => {
  const [isRadical, setIsRadical] = React.useState(false)
  const [isKanji, setIsKanji] = React.useState(false)
  const [isVocabulary, setIsVocabulary] = React.useState(false)
  const [limit, setLimit] = React.useState(20)

  const filteredItems = props.items
    .filter(({ subject_type }) => {
      if (!(isKanji || isRadical || isVocabulary)) {
        return true
      }
      return (
        (isKanji ? subject_type === 'kanji' : false) ||
        (isRadical ? subject_type === 'radical' : false) ||
        (isVocabulary ? subject_type === 'vocabulary' : false)
      )
    })
    .slice(0, limit)

  return (
    <div className='Review-List'>
      <h3>{props.title}</h3>
      <button
        style={{
          padding: '0.5em 2em',
          cursor: 'pointer',
          marginBottom: '1em',
          backgroundColor: '#dddddd',
          color: '#444444',
          fontWeight: 'bolder',
          border: 0,
          borderRadius: '5pt',
          fontSize: '12pt',
          boxShadow: '-0px 3px #aaaaaa'
        }}
        onClick={() => props.onSelect(filteredItems)}
      >
        Select All
      </button>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginBottom: '1em'
        }}
      >
        <SubjectCheckbox checked={isKanji} onChange={() => setIsKanji(!isKanji)}>
          Kanji
        </SubjectCheckbox>
        <SubjectCheckbox checked={isVocabulary} onChange={() => setIsVocabulary(!isVocabulary)}>
          Vocabulary
        </SubjectCheckbox>
        <SubjectCheckbox checked={isRadical} onChange={() => setIsRadical(!isRadical)}>
          Radical
        </SubjectCheckbox>
        <input
          type='number'
          name='limit'
          id='limit'
          value={limit}
          onChange={(e) => setLimit(e.target.valueAsNumber)}
          min={1}
          max={100}
        />
      </div>

      {filteredItems.map((item) => (
        <div
          key={item.subject_id}
          className='Review-List-Item'
          style={{ backgroundColor: CARD_COLORS[item.subject_type] }}
          onClick={() => props.onSelect([item])}
        >
          <span className='Review-List-Item__character'>{item.subject?.characters}</span>
          <div className='Review-List-Item__details'>
            <div>{getItemPrimaryMeaning(item)}</div>
            <div>{getItemPrimaryReading(item)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

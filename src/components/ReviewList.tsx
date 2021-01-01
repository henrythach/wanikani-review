import React from 'react'
import { IReviewStatisticItem } from '../WanikaniDatabase'
import { CARD_COLORS, getItemPrimaryMeaning, getItemPrimaryReading } from '../helpers'

export const ReviewList = (props: {
  title: string
  onSelect: (items: IReviewStatisticItem[]) => void
  items: IReviewStatisticItem[]
}) => (
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
      onClick={() => props.onSelect(props.items)}
    >
      Select
    </button>
    {props.items.map((item) => (
      <div
        key={item.subject_id}
        className='Review-List-Item'
        style={{ backgroundColor: CARD_COLORS[item.subject_type] }}
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

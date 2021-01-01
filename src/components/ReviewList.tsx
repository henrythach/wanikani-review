import { IWanikaniKanji } from '../types/api'
import React from 'react'
import { IReviewStatisticItem } from '../WanikaniDatabase'
import { CARD_COLORS } from '../helpers'

export const ReviewList = ({ items = [] }: { items: IReviewStatisticItem[] }) => (
  <>
    {items.map((item) => (
      <div
        key={item.subject_id}
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: CARD_COLORS[item.subject_type],
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          paddingTop: '0.25em',
          paddingBottom: '0.25em',
          paddingLeft: '0.75em',
          paddingRight: '0.75em',
          borderTop: '1px solid #eeeeee',
          color: '#ffffff'
        }}
      >
        <span style={{ flex: 1, fontSize: '1.5em', fontWeight: 'bold' }}>
          {item.subject?.characters}
        </span>
        <span style={{ flex: 1, textAlign: 'center' }}>{item.percentage_correct}%</span>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            textAlign: 'right'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>
              {item.subject?.meanings
                ?.filter((m) => m.primary)
                ?.map((m) => m.meaning)
                ?.join(', ')}
            </div>
            <div>
              {(item?.subject as IWanikaniKanji)?.readings
                ?.filter((r) => r.primary)
                ?.map((r) => r.reading)
                ?.join(', ')}
            </div>
          </div>
        </div>
      </div>
    ))}
  </>
)

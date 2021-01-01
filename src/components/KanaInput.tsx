import React from 'react'
import { toKana } from 'wanakana'
import { StudyType } from '../types/app'

interface KanaInputProps {
  studyType: StudyType
  value: string
  onChange: (value: string) => void
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder: string
}

export const KanaInput = (props: KanaInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const isMeaning = props.studyType === 'meaning'
    const answer = isMeaning ? inputValue : toKana(inputValue, { IMEMode: true })
    props.onChange(answer)
  }

  return (
    <input
      type='text'
      style={{
        backgroundColor: '#ffffff',
        color: '#444',
        padding: '0.5em',
        fontSize: '18pt',
        textAlign: 'center',
        fontWeight: 'bold',
        border: 0
      }}
      placeholder={props.placeholder}
      onChange={handleChange}
      onKeyUp={props.onKeyUp}
      value={props.value}
      spellCheck={false}
      autoCapitalize='off'
      autoComplete='off'
      autoFocus
    />
  )
}

import React from 'react'
import { toKana } from 'wanakana'
import { StudyType } from '../types/app'

interface KanaInputProps {
  studyType: StudyType
  value: string
  onChange: (value: string) => void
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export const KanaInput = ({ studyType, value, onChange, onKeyUp }: KanaInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const answer = studyType === 'meaning' ? inputValue : toKana(inputValue, { IMEMode: true })
    onChange(answer)
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
      onChange={handleChange}
      onKeyUp={onKeyUp}
      value={value}
      spellCheck={false}
      autoCapitalize='off'
      autoComplete='off'
      autoFocus
    />
  )
}

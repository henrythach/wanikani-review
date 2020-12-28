import React, { useState } from 'react';
import { toKana } from 'wanakana';

export const KanaInput = () => {
  const [value, setValue] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const kanaString = toKana(e.target.value, { IMEMode: true });
    setValue(kanaString);
  };

  return (
    <input
      type='text'
      style={{
        backgroundColor: '#ffffff',
        color: '#444',
        padding: '0.5em',
        fontSize: '1em',
        textAlign: 'center',
        fontWeight: 'bold',
        border: 0,
      }}
      onChange={handleChange}
      value={value}
      spellCheck={false}
      autoCapitalize='off'
      autoComplete='off'
      autoFocus
    />
  );
};

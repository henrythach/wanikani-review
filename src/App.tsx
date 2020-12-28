import React from 'react';
import './App.css';
import { Card } from './components/Card';
import { Header } from './components/Header';
import { KanaInput } from './components/KanaInput';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2em',
      }}
    >
      <Header />
      <Card type='vocabulary' front={'生きる'} back={'いきる'} />
      <KanaInput />
    </div>
  );
}

export default App;

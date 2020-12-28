import React from "react";

export type CardType = 'radical' | 'kanji' | 'vocabulary';

export interface ICard {
  type: CardType;
  front: string;
  back: string;
}

const CARD_COLORS: Record<CardType, string> = {
  kanji: '#f100a1',
  radical: '#00a1f1',
  vocabulary: '#a100f1',
};

export const Card = ({ type, front }: ICard) => (
  <div
    style={{
      minWidth: '30em',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: CARD_COLORS[type],
      textAlign: 'center',
      border: '1px solid #cccccc',
    }}
  >
    <h1
      style={{
        color: '#ffffff',
        fontSize: '72pt',
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
      }}
    >
      {front}
    </h1>
    <footer
      style={{
        backgroundColor: '#444444',
        color: '#ffffff',
        paddingTop: '0.5em',
        paddingBottom: '0.5em',
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}
    >
      Vocabulary Meaning
    </footer>
  </div>
);

export interface IWanikaniCollection<T> {
  object: 'collection'
  url: string
  data_updated_at: Date
  pages: {
    per_page: number
    next_url: string | null
    previous_url: string | null
  }
  data: T[]
}

export interface IWanikaniObject<T> {
  id: number
  url: string
  data_updated_at: Date
  data: T
}

export type WanikaniSubjectType = 'radical' | 'kanji' | 'vocabulary'

export type IWanikaniSubject = IWanikaniRadical | IWanikaniKanji | IWanikaniVocabulary

export interface IWanikaniSubjectObject extends IWanikaniObject<IWanikaniSubject> {
  object: WanikaniSubjectType
}

export interface IWanikaniReviewStatisticObject extends IWanikaniObject<IWanikaniReviewStatistic> {
  object: 'review_statistic'
}

export interface IWanikaniSubjectBase {
  auxiliary_meanings: Array<{
    meaning: string
    type: 'whitelist' | 'blacklist'
  }>
  characters: string | null
  created_at: Date
  document_url: string
  hidden_at: Date | null
  lesson_position: number
  level: number
  meaning_mnemonic: string
  meanings: Array<{
    meaning: string
    primary: boolean
    accepted_answer: boolean
  }>
  slug: string
  spaced_repetition_system_id: number
}

export interface IWanikaniRadical extends IWanikaniSubjectBase {
  amalgamation_subject_ids: number[]
  characters: string | null
  character_images: IWanikaniCharacterImage[]
}

export interface IWanikaniKanji extends IWanikaniSubjectBase {
  characters: string

  amalgamation_subject_ids: number[]
  component_subject_ids: number[]
  meaning_hint: string | null
  reading_hint: string | null
  reading_mnemonic: string
  readings: IWanikaniKanjiReading[]
  visually_similar_subject_ids: number[]
}

export interface IWanikaniVocabulary extends IWanikaniSubjectBase {
  component_subject_ids: number[]
  context_sentences: IWanikaniContextSentence[]
  meaning_mnemonic: string
  parts_of_speech: string[]
  pronunciation_audios: IWanikaniPronunciationAudio[]
  readings: IWanikaniReading[]
  reading_mnemonic: string
}

export interface IWanikaniKanjiReading {
  reading: string
  primary: boolean
  accepted_answer: boolean
  type: 'kunyomi' | 'nanori' | 'onyomi'
}

export interface IWanikaniCharacterImage {
  url: string
  content_type: 'image/png' | 'image/svg+xml'
  metadata: IWanikaniCharacterMetaSVG | IWanikaniCharacterMetaPNG
}

export interface IWanikaniCharacterMetaSVG {
  inline_styles: boolean
}

export interface IWanikaniCharacterMetaPNG {
  color: string
  dimensions: string
  style_name: string
}

export interface IWanikaniReading {
  accepted_answer: boolean
  primary: boolean
  reading: string
}

export interface IWanikaniContextSentence {
  en: string
  ja: string
}

export interface IWanikaniAudioMetadata {
  gender: string
  source_id: number
  pronunciation: string
  voice_actor_id: number
  voice_actor_name: string
  voice_description: string
}

export interface IWanikaniPronunciationAudio {
  url: string
  content_type: 'audio/mpeg' | 'audio/ogg'
  metadata: IWanikaniAudioMetadata
}

export interface IWanikaniReviewStatistic {
  created_at: Date
  hidden: boolean
  meaning_correct: number
  meaning_current_streak: number
  meaning_incorrect: number
  meaning_max_streak: number
  percentage_correct: number
  reading_correct: number
  reading_current_streak: number
  reading_incorrect: number
  reading_max_streak: number
  subject_id: number
  subject_type: WanikaniSubjectType
}

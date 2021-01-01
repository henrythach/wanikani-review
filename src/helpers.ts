import {
  IWanikaniKanji,
  IWanikaniRadical,
  IWanikaniVocabulary,
  WanikaniSubjectType
} from './types/api'
import { IReviewStatisticItem } from './WanikaniDatabase'
import { IStudyItem } from './types/app'

export const CARD_COLORS: Record<WanikaniSubjectType, string> = {
  kanji: '#f100a1',
  radical: '#00a1f1',
  vocabulary: '#a100f1'
}

export function createStudyItems(reviewStatisticItems: IReviewStatisticItem[]): IStudyItem[] {
  return reviewStatisticItems.flatMap<IStudyItem>(({ subject_type, subject }) => {
    const items: IStudyItem[] = []

    if ((subject as IWanikaniKanji | IWanikaniVocabulary)?.readings) {
      items.push({
        study_type: 'reading',
        subject_type,
        subject
      } as IStudyItem)
    }

    if (subject) {
      items.push({
        study_type: 'meaning',
        subject_type,
        subject
      })
    }

    return items
  })
}

export function getRadicalImageUrl(radical: IWanikaniRadical) {
  const characterImages = radical.character_images
  const characterImage = characterImages.find((c) => c.content_type === 'image/png')
  return characterImage?.url ?? ''
}

export function getAnswers(studyItem: IStudyItem) {
  if (studyItem.study_type === 'meaning') {
    const meanings = studyItem.subject.meanings
    return meanings.filter((m) => m.accepted_answer).map((m) => m.meaning)
  }

  if (studyItem.subject_type === 'kanji') {
    const kanjiReadings = (studyItem.subject as IWanikaniKanji).readings
    return kanjiReadings.filter((k) => k.accepted_answer).map((k) => k.reading)
  }

  if (studyItem.subject_type === 'vocabulary') {
    const readings = (studyItem.subject as IWanikaniVocabulary).readings
    return readings.filter((r) => r.accepted_answer).map((r) => r.reading)
  }

  return []
}

export function getItemPrimaryMeaning(item: IReviewStatisticItem) {
  return (
    item.subject?.meanings
      ?.filter((m) => m.primary)
      ?.map((m) => m.meaning)
      ?.join(', ') ?? ''
  )
}

export function getItemPrimaryReading(item: IReviewStatisticItem) {
  return (item?.subject as IWanikaniKanji)?.readings
    ?.filter((r) => r.primary)
    ?.map((r) => r.reading)
    ?.join(', ')
}

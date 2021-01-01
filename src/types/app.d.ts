import { IWanikaniSubject, WanikaniSubjectType } from './api'

type StudyType = 'reading' | 'meaning'

export interface IStudyItem {
  study_type: StudyType
  subject_type: WanikaniSubjectType
  subject: IWanikaniSubject
}

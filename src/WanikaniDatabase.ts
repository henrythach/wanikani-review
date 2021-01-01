import Dexie from 'dexie'
import {
  IWanikaniCollection,
  IWanikaniKanji,
  IWanikaniRadical,
  IWanikaniReviewStatistic,
  IWanikaniReviewStatisticObject,
  IWanikaniSubjectObject,
  IWanikaniVocabulary
} from './types/api'
import Api from './Api'

const { WANIKANI_API_TOKEN = '' } = process.env

export interface IReviewStatisticItem extends IWanikaniReviewStatistic {
  subject?: IWanikaniRadical | IWanikaniKanji | IWanikaniVocabulary
}

export class WanikaniDatabase extends Dexie {
  versions: Dexie.Table<IVersion, string>
  subjects: Dexie.Table<IWanikaniSubjectObject, number>
  review_statistics: Dexie.Table<IWanikaniReviewStatisticObject, number>

  private api: Api

  constructor() {
    super('WanikaniDatabase')
    this.version(3).stores({
      versions: `object,last_updated_at`,
      subjects: `id,object`,
      review_statistics: [
        'id',
        'object',
        'data_updated_at',
        'data.created_at',
        'data.subject_type',
        'data.meaning_current_streak',
        'data.reading_current_streak',
        'data.percentage_correct'
      ].join(',')
    })

    this.versions = this.table('versions')
    this.subjects = this.table('subjects')
    this.review_statistics = this.table('review_statistics')

    this.api = new Api(WANIKANI_API_TOKEN)
  }

  async sync() {
    await this.syncSubjects()
    await this.syncReviewStatistics()
  }

  async getReviewsByPercentageCorrect(limit: number = 25) {
    return await this.joinWithSubject(
      await this.review_statistics.orderBy('data.percentage_correct').limit(limit).toArray()
    )
  }

  async getReviewsByMostRecent(limit: number = 25) {
    return await this.joinWithSubject(
      await this.review_statistics.orderBy('data.created_at').reverse().limit(limit).toArray()
    )
  }

  async getReviewsByMeaningStreak(limit: number = 25) {
    return await this.joinWithSubject(
      await this.review_statistics.orderBy('data.meaning_current_streak').limit(limit).toArray()
    )
  }

  async getReviewsByReadingStreak(limit: number = 25) {
    return await this.joinWithSubject(
      await this.review_statistics
        .orderBy('data.reading_current_streak')
        .limit(limit)
        .toArray()
    )
  }

  /**
   * Joins review stats with the related subject.
   */
  private async joinWithSubject(stats: IWanikaniReviewStatisticObject[]) {
    const reviewItems = stats.map((stat) => stat.data) as IReviewStatisticItem[]
    await Promise.all(
      reviewItems.map(async (reviewItem) => {
        const subject = await db.subjects.get(reviewItem.subject_id)
        reviewItem.subject = subject?.data
      })
    )
    return reviewItems
  }

  /**
   * Syncs up all the Wanikani subjects.
   */
  private async syncSubjects() {
    try {
      const version = await this.versions.get('subjects')
      const lastPulled = version?.last_updated_at
      let response: IWanikaniCollection<IWanikaniSubjectObject>
      let url: string | null = 'https://api.wanikani.com/v2/subjects'
      while (true) {
        response = await this.api.get<IWanikaniCollection<IWanikaniSubjectObject>>(url, lastPulled)
        let subjects = response.data
        this.subjects.bulkPut(subjects)

        // If there's a "next_url", continue loop; otherwise, get out
        url = response?.pages?.next_url
        if (!url) {
          break
        }
      }

      this.versions.put({
        object: 'subjects',
        last_updated_at: new Date()
      })
    } catch (e) {
      // ignored
    }
  }

  /**
   * Syncs up the user's review statistics.
   */
  private async syncReviewStatistics() {
    try {
      const version = await this.versions.get('review_statistics')
      const lastPulled = version?.last_updated_at

      let response: IWanikaniCollection<IWanikaniReviewStatisticObject>
      let url: string | null = 'https://api.wanikani.com/v2/review_statistics'
      while (true) {
        response = await this.api.get<IWanikaniCollection<IWanikaniReviewStatisticObject>>(
          url,
          lastPulled
        )
        const reviewStatistics = response.data
        this.review_statistics.bulkPut(reviewStatistics)

        // If there's a "next_url", continue loop; otherwise, get out
        url = response?.pages?.next_url
        if (!url) {
          break
        }
      }
      this.versions.put({
        object: 'review_statistics',
        last_updated_at: new Date()
      })
    } catch (e) {
      // ignored
    }
  }
}

interface IVersion {
  object: string
  last_updated_at: Date
}

export const db = new WanikaniDatabase()

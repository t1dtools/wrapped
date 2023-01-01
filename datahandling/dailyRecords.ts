import { GlucoseReading } from '../parsing/glucose'
import { format, parse } from 'date-fns'

export type DailyRecord = {
    date: Date
    rangePercentage: number
}

export const mapGlucoseRecordsToDailyRecords = (records: GlucoseReading[]): DailyRecord[] => {
    const dailyRecords: DailyRecord[] = []
    let currentDay: Date | null = null
    let dailyReadings = new Map<string, GlucoseReading[]>()

    records.forEach(record => {
        if (record.Value > 0) {
            if (currentDay === null) {
                currentDay = record.Timestamp
            }

            const dateString = format(record.Timestamp, 'yyyy-MM-dd')
            if (!dailyReadings.has(dateString)) {
                dailyReadings.set(dateString, [])
            }
            dailyReadings.set(dateString, [...dailyReadings.get(dateString)!, record])
        }
    })

    dailyReadings.forEach((records, dateString) => {
        const date = parse(dateString, 'yyyy-MM-dd', new Date())
        const rangePercentage = calculateRangePercentage(records)
        dailyRecords.push({ date: date, rangePercentage: rangePercentage })
    })

    return dailyRecords
}

const calculateRangePercentage = (records: GlucoseReading[]): number => {
    const total = records.length
    const inRange = records.filter(record => record.Value >= 3.9 && record.Value <= 10).length
    return (inRange / total) * 100
}

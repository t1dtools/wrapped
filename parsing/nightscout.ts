import { GlucoseReading, ParseResponse, GlucoseTypes, Options } from './glucose'
import { parse } from 'date-fns'

export type NightscoutReading = {
    _id: string
    type: string
    direction: string
    date: number
    dateString: string
    rawbg: number
    sgv: number
    trend: number
    device: string
    utcOffset: number
    sysTime: Date
    mills: number
}

export const fetchAndParseNightscoutData = async (
    apiBaseURL: string,
    apiSecret: string,
    year: number
): Promise<ParseResponse> => {
    const end = new Date(year, 11, 31, 23, 59, 59, 999)
    let beforeDate = end.getTime()
    let count = 2

    let lastReading: NightscoutReading
    let fetchedYear = year
    const allReadings: NightscoutReading[] = []

    let breakOut = 0
    while (fetchedYear === year && count > 1) {
        if (breakOut > 1000) {
            console.log('Exceeded max number of allowed calls to Nightscout.')
            return { records: [], error: { message: 'Exceeded max number of allowed calls to Nightscout.' } }
        }

        const url = `${apiBaseURL}/api/v1/entries.json?count=1440&find[date][$lte]=${beforeDate}`
        try {
            const response = await fetch(url, {
                headers: {
                    'API-SECRET': apiSecret,
                },
            })

            if (!response.ok) {
                console.log("resoonse was not ok", response)
                return {
                    records: [],
                    error: { message: 'Unable to fetch data from Nightscout API.' },
                }
            }
    
            const nightscoutReadings = await response.json()
            lastReading = nightscoutReadings[nightscoutReadings.length - 1]
            count = nightscoutReadings.length
            
            const date = new Date(lastReading.date)
            fetchedYear = date.getFullYear()
            beforeDate = date.getTime()
    
            allReadings.push(...nightscoutReadings)
            breakOut++
        } catch (e) {
            return {
                records: [],
                error: { message: 'Unable to fetch data from Nightscout API. Ensure that your Nightscout is correctly configured for CORS requests from t1dtools.' },
            }
        }  
    }

    const glucoseReadings: GlucoseReading[] = mapNightscoutToGlucoseReadings(allReadings, {
        year,
        glucoseType: GlucoseTypes.mgdl,
    })

    return { records: glucoseReadings, error: null }
}

const mapNightscoutToGlucoseReadings = (
    nightscoutReadings: NightscoutReading[],
    options: Options
): GlucoseReading[] => {
    const glucoseReadings: GlucoseReading[] = []

    nightscoutReadings.forEach(reading => {
        const date = new Date(reading.date)
        if (date.getFullYear() === options.year) {
            const glucoseReading: GlucoseReading = {
                Timestamp: date,
                Value: reading.sgv / 18,
            }
            glucoseReadings.push(glucoseReading)
        }
    })

    return glucoseReadings
}

import { GlucoseReading, ParseResponse } from './glucose'
import { parse } from 'date-fns'
import { csvParse } from 'd3-dsv'

export type DexcomClarityReading = {
    Index: string
    'Timestamp (YYYY-MM-DDThh:mm:ss)': string
    'Event Type': string
    'Event Subtype': string
    'Patient Info': string
    'Device Info': string
    'Source Device ID': string
    'Glucose Value (mmol/L)': string
    'Insulin Value (u)': string
    'Carb Value (grams)': string
    'Duration (hh:mm:ss)': string
    'Glucose Rate of Change (mmol/L/min)': string
    'Transmitter Time (Long Integer)': string
    'Transmitter ID': string
}

export const parseDexcomClarityData = async (file: File, year: number): Promise<ParseResponse> => {
    let data = await file.text()
    if (!data) {
        return { records: [], error: { message: 'Unable to parse file' } }
    }

    // This might be a bit fragile, but I have very little sample data so not sure how to do this better
    if (data.includes('\x01')) {
        data = data.slice(102)
    }

    const parsedData = csvParse(data)
    let dexcomReadings: DexcomClarityReading[] = []
    parsedData.map((reading, index) => {
        dexcomReadings.push(<DexcomClarityReading>reading)
    })

    // Clean out any empty records, or records that aren't EGVs
    dexcomReadings = dexcomReadings.filter(reading => reading['Index'] !== '' && reading['Event Type'] === 'EGV')

    if (dexcomReadings.length < 12) {
        return {
            records: [],
            error: { message: 'Insufficient data found in provided file.' },
        }
    }

    // if (dexcomReadings[1]['Event Type'].indexOf('FirstName') === -1) {
    //     return {
    //         records: [],
    //         error: { message: 'Invalid or unknown data format. Did you choose the correct CGM provider?' },
    //     }
    // }

    const glucoseReadings: GlucoseReading[] = mapDexcomClarityToGlucoseReadings(dexcomReadings)

    return { records: glucoseReadings, error: null }
}

const mapDexcomClarityToGlucoseReadings = (libreReadings: DexcomClarityReading[]): GlucoseReading[] => {
    const glucoseReadings: GlucoseReading[] = []
    libreReadings.forEach(reading => {
        if (reading['Event Type'] === 'EGV' && reading['Glucose Value (mmol/L)'] !== '') {
            const glucoseReading: GlucoseReading = {
                Timestamp: parse(reading['Timestamp (YYYY-MM-DDThh:mm:ss)'], "yyyy-MM-dd'T'HH:mm:ss", new Date()),
                Value: parseFloat(reading['Glucose Value (mmol/L)']),
            }
            glucoseReadings.push(glucoseReading)
        }
    })
    return glucoseReadings
}

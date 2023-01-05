import { GlucoseReading, ParseResponse, GlucoseTypes, Options } from './glucose'
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
    'Glucose Value': string
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

    if (data.includes(`"ï»¿""Index"""`)) {
        data = data.replace(`"ï»¿""Index"""`, `Index`)
    }

    const glucoseType = data.includes('mg/dL') ? GlucoseTypes.mgdl : GlucoseTypes.mmol
    if (data.includes("mg/dL")) {
        data = data.replace("Glucose Value (mg/dL)", "Glucose Value")
    } else if (data.includes("mmol/L")) {
        data = data.replace("Glucose Value (mmol/L)", "Glucose Value")
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

    const options = {
        glucoseType,
        year
    }

    const glucoseReadings: GlucoseReading[] = mapDexcomClarityToGlucoseReadings(dexcomReadings, options)

    return { records: glucoseReadings, error: null }
}

const mapDexcomClarityToGlucoseReadings = (readings: DexcomClarityReading[], options: Options): GlucoseReading[] => {
    const glucoseReadings: GlucoseReading[] = []
    readings.forEach(reading => {
        let date = parse(reading['Timestamp (YYYY-MM-DDThh:mm:ss)'], "yyyy-MM-dd'T'HH:mm:ss", new Date())
        // check if date is invalid, and try alternative format
        if (isNaN(date.getTime())) {
            date = parse(reading['Timestamp (YYYY-MM-DDThh:mm:ss)'], "yyyy-MM-dd HH:mm:ss", new Date())
        }

        if (reading['Event Type'] === 'EGV' && reading['Glucose Value'] !== '' && date.getFullYear() === options.year) {
            const value = parseFloat(reading['Glucose Value'])
            const glucoseReading: GlucoseReading = {
                Timestamp: date,
                Value: options.glucoseType === GlucoseTypes.mmol ? value : value / 18,
            }
            glucoseReadings.push(glucoseReading)
        }
    })
    return glucoseReadings
}

import { GlucoseReading, ParseResponse } from './glucose'
import { parse } from 'date-fns'

export type LibreViewReading = {
    Device: string
    SerialNumber: string
    DeviceTimestamp: Date
    RecordType: number
    HistoricGlucoseMmol: number
    ScanGlucoseMmol: string
    NonNumericRapidActingInsulin: string
    RapidActingInsulinUnits: string
    NonNumericFood: string
    CarbohydratesGrams: string
    CarbohydratesServings: string
    NonNumericLongActingInsulin: string
    LongActingInsulinValueUnits: string
    Notes: string
    StripGlucoseMmol: string
    KetoneMmol: string
    MealInsulinUnits: string
    CorrectionInsulinUnits: string
    UserChangeInsulinUnits: string
}

export const parseLibreViewData = async (file: File, year: number): Promise<ParseResponse> => {
    const libreReadings: LibreViewReading[] = []

    const data = await file.text()
    if (!data) {
        return { records: [], error: { message: 'Unable to parse file' } }
    }

    const lines = data.toString().split('\n')
    lines.map(line => {
        const fields = line.split(',')
        const reading: LibreViewReading = {
            Device: fields[0],
            SerialNumber: fields[1],
            DeviceTimestamp: parse(fields[2], 'dd-MM-yyyy HH:mm', new Date()),
            RecordType: parseInt(fields[3]),
            HistoricGlucoseMmol: parseFloat(fields[4]),
            ScanGlucoseMmol: fields[5],
            NonNumericRapidActingInsulin: fields[6],
            RapidActingInsulinUnits: fields[7],
            NonNumericFood: fields[8],
            CarbohydratesGrams: fields[9],
            CarbohydratesServings: fields[10],
            NonNumericLongActingInsulin: fields[11],
            LongActingInsulinValueUnits: fields[12],
            Notes: fields[13],
            StripGlucoseMmol: fields[14],
            KetoneMmol: fields[15],
            MealInsulinUnits: fields[16],
            CorrectionInsulinUnits: fields[17],
            UserChangeInsulinUnits: fields[18],
        }

        if (reading.DeviceTimestamp.getFullYear() === year) {
            libreReadings.push(reading)
        }
    })

    if (libreReadings.length === 0 || libreReadings[0].Device.indexOf('FreeStyle') === -1) {
        return {
            records: [],
            error: { message: 'Invalid or unknown data format. Did you choose the correct CGM provider?' },
        }
    }

    const glucoseReadings: GlucoseReading[] = mapLibreViewToGlucoseReadings(libreReadings)

    return { records: glucoseReadings, error: null }
}

const mapLibreViewToGlucoseReadings = (libreReadings: LibreViewReading[]): GlucoseReading[] => {
    const glucoseReadings: GlucoseReading[] = []
    libreReadings.forEach(reading => {
        if (reading.RecordType === 0) {
            const glucoseReading: GlucoseReading = {
                Timestamp: reading.DeviceTimestamp,
                Value: reading.HistoricGlucoseMmol,
            }
            glucoseReadings.push(glucoseReading)
        }
    })
    return glucoseReadings
}

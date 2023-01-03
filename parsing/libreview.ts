import { GlucoseReading, ParseResponse } from './glucose'
import { parse } from 'date-fns'
import { csvParse } from 'd3-dsv'

export type LibreViewReading = {
    Device: string
    SerialNumber: string
    DeviceTimestamp: string
    RecordType: string
    HistoricGlucoseMmol: string
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
    let libreReadings: LibreViewReading[] = []

    let data = await file.text()
    if (!data) {
        return { records: [], error: { message: 'Unable to parse file' } }
    }

    // Remove first line
    data = data.split('\n').slice(1).join('\n')

    // Replace new first line
    data = [
        'Device,SerialNumber,DeviceTimestamp,RecordType,HistoricGlucoseMmol,ScanGlucoseMmol,NonNumericRapidActingInsulin,RapidActingInsulinUnits,NonNumericFood,CarbohydratesGrams,CarbohydratesServings,NonNumericLongActingInsulin,LongActingInsulinValueUnits,Notes,StripGlucoseMmol,KetoneMmol,MealInsulinUnits,CorrectionInsulinUnits,UserChangeInsulinUnits\n',
        data,
    ].join('\n')

    libreReadings = csvParse(data)
    if (libreReadings.length < 2) {
        return {
            records: [],
            error: { message: 'Insufficient data found in provided file.' },
        }
    }

    if (libreReadings[2].Device.indexOf('FreeStyle') === -1) {
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
        if (reading.RecordType === '0') {
            const glucoseReading: GlucoseReading = {
                Timestamp: parse(reading.DeviceTimestamp, 'dd-MM-yyyy HH:mm', new Date()),
                Value: parseFloat(reading.HistoricGlucoseMmol),
            }
            glucoseReadings.push(glucoseReading)
        }
    })
    return glucoseReadings
}

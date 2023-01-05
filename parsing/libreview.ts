import { GlucoseReading, ParseResponse } from './glucose'
import { parse } from 'date-fns'
import { csvParse } from 'd3-dsv'

export type LibreViewReading = {
    Device: string
    SerialNumber: string
    DeviceTimestamp: string
    RecordType: string
    HistoricGlucose: string
    ScanGlucose: string
    NonNumericRapidActingInsulin: string
    RapidActingInsulinUnits: string
    NonNumericFood: string
    CarbohydratesGrams: string
    CarbohydratesServings: string
    NonNumericLongActingInsulin: string
    LongActingInsulinValueUnits: string
    Notes: string
    StripGlucose: string
    Ketone: string
    MealInsulinUnits: string
    CorrectionInsulinUnits: string
    UserChangeInsulinUnits: string
}

enum GlucoseTypes {
    'mgdl',
    'mmol'
}


export type Options = {
    glucoseType: GlucoseTypes
    year: number,
}

export const parseLibreViewData = async (file: File, year: number): Promise<ParseResponse> => {
    let data = await file.text()
    if (!data) {
        return { records: [], error: { message: 'Unable to parse file' } }
    }

    // Remove first line
    const glucoseType = data.split('\n').slice(1,2).join('\n').includes("mg/dL") ? GlucoseTypes.mgdl : GlucoseTypes.mmol

    data = data.split('\n').slice(1).join('\n')
    // Replace new first line
    data = [
        'Device,SerialNumber,DeviceTimestamp,RecordType,HistoricGlucose,ScanGlucose,NonNumericRapidActingInsulin,RapidActingInsulinUnits,NonNumericFood,CarbohydratesGrams,CarbohydratesServings,NonNumericLongActingInsulin,LongActingInsulinValueUnits,Notes,StripGlucose,Ketone,MealInsulinUnits,CorrectionInsulinUnits,UserChangeInsulinUnits\n',
        data,
    ].join('\n')

    const parsedData = csvParse(data)
    let libreReadings: LibreViewReading[] = []
    parsedData.map((reading: any) => {
        libreReadings.push(<LibreViewReading>reading)
    })

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

    const options = {
        glucoseType,
        year
    }

    const glucoseReadings: GlucoseReading[] = mapLibreViewToGlucoseReadings(libreReadings, options)

    return { records: glucoseReadings, error: null }
}

const mapLibreViewToGlucoseReadings = (libreReadings: LibreViewReading[], options: Options): GlucoseReading[] => {
    const glucoseReadings: GlucoseReading[] = []

    libreReadings.forEach(reading => {
        const date = parse(reading.DeviceTimestamp, 'dd-MM-yyyy HH:mm', new Date())
        if (reading.RecordType === '0' && date.getFullYear() === options.year) {
            const glucoseReading: GlucoseReading = {
                Timestamp: date,
                Value: options.glucoseType === GlucoseTypes.mmol ? parseFloat(reading.HistoricGlucose) : parseFloat(reading.HistoricGlucose) / 18,
            }
            glucoseReadings.push(glucoseReading)
        }
    })

    return glucoseReadings
}

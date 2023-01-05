import { ParseError } from './errors'

export enum GlucoseTypes {
    'mgdl',
    'mmol'
}

export type Options = {
    glucoseType: GlucoseTypes
    year: number,
}

export type ParseResponse = {
    records: GlucoseReading[]
    error: ParseError | null
}

export type GlucoseReading = {
    Timestamp: Date
    Value: number
}

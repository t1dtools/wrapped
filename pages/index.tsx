import Head from 'next/head'
import React, { useState } from 'react'
import { parse } from 'csv-parse'

export default function Home() {
    const [CGMData, setCGMData] = useState<LibreReading[]>([])
    const [CGMDataLoading, setCGMDataLoading] = useState<boolean>(false)
    const [CGMDataError, setCGMDataError] = useState<string | null>(null)

    type LibreReading = {
        device: string
        deviceTimestamp: Date
        historicGlucoseMmol: number
    }

    const parseData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setCGMDataLoading(true)
        const headers = [
            'Device',
            'Serial Number',
            'Device Timestamp',
            'Record Type',
            'Historic Glucose mmol/L',
            'Scan Glucose mmol/L',
            'Non-numeric Rapid-Acting Insulin',
            'Rapid-Acting Insulin (units)',
            'Non-numeric Food',
            'Carbohydrates (grams)',
            'Carbohydrates (servings)',
            'Non-numeric Long-Acting Insulin',
            'Long-Acting Insulin Value (units)',
            'Notes',
            'Strip Glucose mmol/L',
            'Ketone mmol/L',
            'Meal Insulin (units)',
            'Correction Insulin (units)',
            'User Change Insulin (units)',
        ]

        if (!event.target.files) return
        const file = event.target.files[0]
        let reader = new FileReader()
        reader.readAsText(file)

        reader.onload = () => {
            const csv = reader.result
            if (csv === null) return

            parse(
                csv?.toString(),
                {
                    delimiter: ',',
                    columns: headers,
                    from_line: 2,
                },
                (error, result: LibreReading[]) => {
                    setCGMDataLoading(false)
                    if (error) {
                        console.error(error)
                        setCGMDataError(error.message)
                        return
                    }
                    setCGMData(result)
                }
            )
        }

        reader.onerror = () => {
            console.log(reader.error)
        }
    }

    return (
        <>
            <Head>
                <title>Diabetes Wrapped</title>
                <meta
                    name="description"
                    content="A Spotify Wrapped style view of your year with diabetes, based on your CGM data"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <input type="file" accept="text/csv" onChange={event => parseData(event)} />

            {CGMDataLoading && <div>Loading CGM data...</div>}
            {!CGMDataLoading && CGMDataError && <div>There was an error parsing your CGM data: {CGMDataError}</div>}
            {!CGMDataLoading && CGMData.length > 0 && <div>CGM data parsed successfully</div>}
        </>
    )
}

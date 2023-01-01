import React from 'react'
import { Doughnut } from './doughnut'
import { DailyRecord } from '../datahandling/dailyRecords'
import { Headline } from './headline'

export const RangeDoughnuts = ({ dailyRecords }: { dailyRecords: DailyRecord[] }) => {
    const daysOverPercentage = {
        d0: 0,
        d10: 0,
        d20: 0,
        d30: 0,
        d40: 0,
        d50: 0,
        d60: 0,
        d70: 0,
        d80: 0,
        d90: 0,
        d100: 0,
    }

    const total = dailyRecords.length

    dailyRecords.forEach(dailyRecord => {
        const percentage = dailyRecord.rangePercentage
        if (percentage >= 0) {
            daysOverPercentage.d0++
            if (percentage >= 10) {
                daysOverPercentage.d10++
                if (percentage >= 20) {
                    daysOverPercentage.d20++
                    if (percentage >= 30) {
                        daysOverPercentage.d30++
                        if (percentage >= 40) {
                            daysOverPercentage.d40++
                            if (percentage >= 50) {
                                daysOverPercentage.d50++
                                if (percentage >= 60) {
                                    daysOverPercentage.d60++
                                    if (percentage >= 70) {
                                        daysOverPercentage.d70++
                                        if (percentage >= 80) {
                                            daysOverPercentage.d80++
                                            if (percentage >= 90) {
                                                daysOverPercentage.d90++
                                                if (percentage >= 100) {
                                                    daysOverPercentage.d100++
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    return (
        <>
            <Headline
                size={2}
                text="Range Distribution"
                subheadline="How many days to you have over a certain percentage in range?"
            />
            <div
                className="doughnuts w-[1500px]"
                style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 30 }}>
                <Doughnut count={daysOverPercentage.d60} headline="Days over 60%" total={total} />
                <Doughnut count={daysOverPercentage.d70} headline="Days over 70%" total={total} />
                <Doughnut count={daysOverPercentage.d80} headline="Days over 80%" total={total} />
                <Doughnut count={daysOverPercentage.d90} headline="Days over 90%" total={total} />
                <Doughnut count={daysOverPercentage.d100} headline="Unicorns" total={total} />
            </div>
        </>
    )
}

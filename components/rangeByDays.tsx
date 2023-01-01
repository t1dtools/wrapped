import React from 'react'
import { DailyRecord } from '../datahandling/dailyRecords'
import { Doughnut } from './doughnut'
import { Headline } from './headline'

export const RangeByDays = ({ dailyRecords }: { dailyRecords: DailyRecord[] }) => {
    const daysInRange = {
        d0t10: 0,
        d10t20: 0,
        d20t30: 0,
        d30t40: 0,
        d40t50: 0,
        d50t60: 0,
        d60t70: 0,
        d70t80: 0,
        d80t90: 0,
        d90t100: 0,
    }

    dailyRecords.forEach(dailyRecord => {
        const percentage = dailyRecord.rangePercentage
        if (percentage >= 0 && percentage < 10) {
            daysInRange.d0t10++
        } else if (percentage >= 10 && percentage < 20) {
            daysInRange.d10t20++
        } else if (percentage >= 20 && percentage < 30) {
            daysInRange.d20t30++
        } else if (percentage >= 30 && percentage < 40) {
            daysInRange.d30t40++
        } else if (percentage >= 40 && percentage < 50) {
            daysInRange.d40t50++
        } else if (percentage >= 50 && percentage < 60) {
            daysInRange.d50t60++
        } else if (percentage >= 60 && percentage < 70) {
            daysInRange.d60t70++
        } else if (percentage >= 70 && percentage < 80) {
            daysInRange.d70t80++
        } else if (percentage >= 80 && percentage < 90) {
            daysInRange.d80t90++
        } else if (percentage >= 90 && percentage < 100) {
            daysInRange.d90t100++
        }
    })

    console.log(daysInRange)

    return (
        <>
            <Headline
                size={2}
                text="Range By Days"
                subheadline="Hover over this graph to see how many days you spent in which range for the entire year."
            />
            <div className="percentage-bar flex  w-[1500px] text-center">
                {daysInRange.d0t10 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(229,0,20,1)',
                            flexGrow: daysInRange.d0t10,
                        }}
                    />
                )}
                {daysInRange.d10t20 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(231,18,1,1)',
                            flexGrow: daysInRange.d10t20,
                        }}
                    />
                )}
                {daysInRange.d20t30 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(232,57,3,1)',
                            flexGrow: daysInRange.d20t30,
                        }}
                    />
                )}
                {daysInRange.d30t40 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(234,96,5,1)',
                            flexGrow: daysInRange.d30t40,
                        }}
                    />
                )}
                {daysInRange.d40t50 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(236,134,6,1)',
                            flexGrow: daysInRange.d40t50,
                        }}
                    />
                )}
                {daysInRange.d50t60 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(238,173,8,1)',
                            flexGrow: daysInRange.d50t60,
                        }}
                    />
                )}
                {daysInRange.d60t70 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(239,211,10,1)',
                            flexGrow: daysInRange.d60t70,
                        }}
                    />
                )}
                {daysInRange.d70t80 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(241,250,12,1)',
                            flexGrow: daysInRange.d70t80,
                        }}
                    />
                )}
                {daysInRange.d80t90 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(202,241,12,1)',
                            flexGrow: daysInRange.d80t90,
                        }}
                    />
                )}
                {daysInRange.d90t100 > 0 && (
                    <div
                        style={{
                            backgroundColor: 'rgba(163,232,12,1)',
                            flexGrow: daysInRange.d90t100,
                        }}
                    />
                )}
            </div>

            <style jsx>{`
                .percentage-bar div {
                    height: 50px;
                }
            `}</style>
        </>
    )
}

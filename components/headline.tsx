import React from 'react'
import classnames from 'classnames'

export const Headline = ({ size, text, subheadline }: { size: 1 | 2 | 3; text: string; subheadline?: string }) => {
    const headerClasses =
        'animate-text-bg bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-300 via-fuchsia-600 to-orange-600 bg-[length:400%_400%] bg-clip-text font-mono font-semibold text-transparent'
    const wrapperClasses = 'mt-8 flex flex-col place-content-center place-items-center text-center'
    return (
        <div className={classnames(size === 3 ? '' : 'mb-8', wrapperClasses)}>
            <div className="flex-shrink">
                {size === 1 && <h1 className={classnames('text-4xl', headerClasses)}>{text}</h1>}
                {size === 2 && <h2 className={classnames('text-2xl', headerClasses)}>{text}</h2>}
                {size === 3 && <h3 className={classnames('text-xl', headerClasses)}>{text}</h3>}
            </div>

            {subheadline && <p className="mt-2">{subheadline}</p>}
        </div>
    )
}

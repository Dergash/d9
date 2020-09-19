/* Simplified JedWatson/classnames (https://github.com/JedWatson/classnames) */

interface IClassNamesDefinition {
    [className: string]: boolean
}

/**
 * Build className string using conditional expressions.
 *
 * cn('button') -> 'button'
 * cn('button', { red: false, green: true }), 'large') -> 'button green large'
 *
 * @param classNames String or { [className]: condition } dictionary
 * @returns Joined className string
 */
function cn(...classNames: Array<string | IClassNamesDefinition>) {
    const result: string[] = []
    classNames.forEach(item => {
        if (typeof item === 'string') {
            result.push(item)
        } else {
            Object.keys(item).forEach(key => {
                if (item[key]) {
                    result.push(key)
                }
            })
        }
    })
    return result.join(' ')
}

export default cn

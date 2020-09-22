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
function cn(...classNames: Array<string | IClassNamesDefinition | undefined>) {
    const result: string[] = []
    classNames
        .filter(item => !!item)
        .forEach(item => {
            if (typeof item === 'string') {
                result.push(item)
            } else {
                Object.keys((item as IClassNamesDefinition)).forEach(key => {
                    if ((item as IClassNamesDefinition)[key]) {
                        result.push(key)
                    }
                })
            }
        })
    return result.join(' ')
}

export default cn

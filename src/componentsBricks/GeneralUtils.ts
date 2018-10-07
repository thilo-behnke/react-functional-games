import { chunk, join, map, pipe, reverse, split, toString } from 'lodash/fp'

export const formatNumber = (num: number, delimiter: string) =>
    pipe(
        toString,
        split(''),
        reverse,
        chunk(3),
        map(pipe(reverse, join(''))),
        reverse,
        join(delimiter)
    )(num)
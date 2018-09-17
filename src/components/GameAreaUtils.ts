import { chain, differenceBy, random, range } from 'lodash';
import { flatMap, flatten, groupBy, map, pipe, property, reduce, sortBy, sortedUniqBy, tap, toPairs } from 'lodash/fp';
import { Color, GameBlock, GameField } from './constants';

export const initGameField = (fieldRows: number) => chain(range(400))
    .map(_ => random(0, 1))
    .map((x, i) => ({
        color: x === 0 ? Color.BLUE : Color.YELLOW,
        id: i,
        pos: [i % fieldRows + 1, Math.floor(i / fieldRows) + 1] as [number, number]
    }))
    .value()

export const mapPosY = map(({pos: [_, posY]}) => posY)

export const getNeighbours = ({pos: [x, y]}: GameBlock, blocks: GameField) =>
    blocks.filter(({pos: [posX, posY]}) => posX === x && Math.abs(posY - y) === 1 || posY === y && Math.abs(posX - x) === 1)

export const getAdjacent = (block: GameBlock, blocks: GameField): GameField => {
    let visited = [] as GameField
    const inner = (block: GameBlock): GameField => {
        const neighbours = getNeighbours(block, differenceBy(blocks, visited, 'id'))
        const relevantNeighbours = neighbours.filter(({color}) => color === block.color)
        visited = [...visited, ...neighbours]
        const result = [
            ...relevantNeighbours, ...pipe(
                map((neighbour: GameBlock) => inner(neighbour)),
                flatten
            )(relevantNeighbours)
        ]
        return sortedUniqBy('id', sortBy('id', result))
    }
    return inner(block)
}

export const findGaps = (arr: number[]): number[] => {
    const gaps = chain(arr)
        .sortBy()
        .reduce((acc, val, i, arr) =>
            i !== 0 && Math.abs(arr[i - 1] - val) !== 1
                ? [...acc, i]
                : acc, []
        )
        .value()
    return [...gaps, arr.length]
}

export const byGaps = (x: number, values: GameField, gaps: number[]) =>
    gaps.map((val: number, i: number, arr: number[]) => [`${x}-${i}`, sortBy('pos[1]', values).slice(i === 0 && 0 || arr[i - 1], val)])

export const groupByGaps = pipe(
    groupBy('pos[0]'),
    toPairs,
    map(([x, val]) => [parseInt(x), val]),
    reduce((acc, [x, values]) => {
        console.log('byGaps', acc)
        const gaps = pipe(
            mapPosY,
            findGaps
        )(values)
        console.log('gaps', gaps)
        return [
            ...acc, ...byGaps(x, values, gaps)
        ]
    }, []), tap(console.log))

export const getMinY = (values: GameField) => chain(values)
    .map(property('pos[1]'))
    .sortBy()
    .first()
    .value() as number

export const recalculatePositions = (newField: GameField) => (gaps: any): GameField => {
    return gaps.reduce((acc: any, [xVal, values]: any, i: number, arr: number) => {
        const [x, gapIndex] = xVal.split('-').map((x: any) => parseInt(x))
        const upperBound = getMinY(values)
        const previousGaps = acc.filter(({pos: [x2, y2]}: GameBlock) => x === x2)
        const recalc = [
            ...differenceBy(acc, previousGaps, 'id'),
            ...chain([...differenceBy(newField, previousGaps, 'id'), ...previousGaps])
            .filter(({pos: [posX, posY]}) => x === posX && upperBound > posY)
            .sortBy('pos[1]')
            .tap(console.log)
            .map(b => ({
                ...b,
                pos: [x, b.pos[1] + values.length]
            } as GameBlock))
            .value()
        ]
        console.log('recalc', x, recalc)
        return sortBy('id', recalc)
    }, [])
}
// export const recalculatePositions = (newField: GameField) => flatMap(([xVal, values]) => {
//     const x = parseInt(xVal)
//     const minY = getMinY(values)
//     return chain(newField)
//         .filter(({pos: [posX, posY]}) => x === posX && minY > posY)
//         .sortBy('pos[1]')
//         .tap(console.log)
//         .map(b => ({
//             ...b,
//             pos: [x, b.pos[1] + values.length]
//         } as GameBlock))
//         .value()
// })
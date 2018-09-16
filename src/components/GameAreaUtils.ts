import { chain, differenceBy, random, range } from 'lodash';
import {
    concat,
    curryRight,
    flatMap,
    flatten,
    groupBy,
    head,
    map,
    pipe,
    property,
    reduce,
    sortBy,
    sortedUniqBy,
    toPairs
} from 'lodash/fp';
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

export const findGaps = (arr: number[]): number[] =>
    chain(arr)
        .reduce((acc, val, i) => acc.previous && Math.abs(acc.previous - val) !== 1
            ? {previous: val, gaps: [...acc.gaps, i]}
            : {...acc, previous: val}, {
                previous: null,
                gaps: []
            }
        )
        .values()
        .last()
        .value()

export const byGaps = (x: number, values: GameField, gaps: number[]) => gaps.length
    ? gaps.map((val: number, i: number, arr: number[]) => [`${x}-${i}`, values.slice(i === 0 && 0 || arr[i - 1], val)])
    : [[`${x}-0`, values]] as Array<[string, GameField]>

export const groupByGaps = pipe(
    groupBy('pos[0]'),
    toPairs,
    map(([x, val]) => [parseInt(x), val]),
    reduce((acc, [x, values]) => {
        const gaps = pipe(
            mapPosY,
            findGaps
        )(values)
        return [
            ...acc, ...byGaps(x, values, gaps)
        ]
    }, []))

export const getMinY = (values: GameField) => chain(values)
    .map(property('pos[1]'))
    .tap(console.log)
    .sortBy()
    .first()
    .value() as number

export const recalculatePositions = (newField: GameField) => flatMap(([xVal, values]) => {
    const x = parseInt(xVal)
    const minY = getMinY(values)
    return chain(newField)
        .filter(({pos: [posX, posY]}) => x === posX && minY > posY)
        .sortBy('pos[1]')
        .map(b => ({
            ...b,
            pos: [x, b.pos[1] + values.length]
        } as GameBlock))
        .value()
})
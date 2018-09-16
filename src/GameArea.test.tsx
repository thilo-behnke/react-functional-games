import { compose, flatten, map, pipe, range, reject } from 'lodash/fp';
import { byGaps, findGaps, getAdjacent, getMinY, getNeighbours, mapPosY } from './components/GameAreaUtils';
import { Color, GameBlock, GameField } from './components/constants';

const simpleGameField = (size: number) => pipe(
    range,
    map((val: number) => ({
        id: val,
        color: Color.YELLOW,
        pos: [val % Math.sqrt(size), Math.floor(val / Math.sqrt(size))]
    }) as GameBlock)
)(0, size - 1) as GameField

test('mapY', () => {
    expect(mapPosY([{id: 0, color: Color.YELLOW, pos: [0, 1]}, {id: 0, color: Color.YELLOW, pos: [0, 2]}]))
        .toEqual([1, 2])
})

test('getNeighbours - corner position (2 neighbours)', () => {
    const gameField = simpleGameField(9)
    const neighbours = getNeighbours(gameField[0], gameField)
    expect(neighbours).toEqual([gameField[1], gameField[3]])
})
test('getNeighbours - edge position (3 neighbours)', () => {
    const gameField = simpleGameField(9)
    const neighbours = getNeighbours(gameField[3], gameField)
    expect(neighbours).toEqual([gameField[0], gameField[4], gameField[6]])
})
test('getNeighbours - center position (4 neighbours)', () => {
    const gameField = simpleGameField(9)
    const neighbours = getNeighbours(gameField[4], gameField)
    expect(neighbours).toEqual([gameField[1], gameField[3], gameField[5], gameField[7]])
})

test('getAdjacent - horizontal line', () => {
    const gameField = simpleGameField(9).map(val => ({...val, ...{color: val.pos[1] % 3 === 0 ? Color.BLUE : Color.YELLOW}}))
    const adjacent = getAdjacent(gameField[0], gameField)
    expect(adjacent).toEqual(gameField.slice(0, 3))
})
test('getAdjacent - vertical line', () => {
    const gameField = simpleGameField(9).map(val => ({...val, ...{color: val.pos[0] % 3 === 0 ? Color.BLUE : Color.YELLOW}}))
    const adjacent = getAdjacent(gameField[0], gameField)
    expect(adjacent).toEqual([gameField[0], gameField[3], gameField[6]])
})
test('getAdjacent - cross', () => {
    const gameField = simpleGameField(9).map(val => ({...val, ...{color: val.id % 2 !== 0 || val.id === 4 ? Color.BLUE : Color.YELLOW}}))
    const adjacent = getAdjacent(gameField[1], gameField)
    expect(adjacent).toEqual(gameField.filter(({id}) => id % 2 !== 0 || id === 4))
})
test('getAdjacent - steps', () => {
    const gameField = pipe(
        map((val: GameBlock) => {
            const {id} = val
            return [1, 2, 4, 5, 8].includes(id)
                ? {...val, ...{color: Color.BLUE}}
                : val
        }),
        flatten
    )(simpleGameField(9)) as GameField
    const adjacent = getAdjacent(gameField[4], gameField)
    expect(adjacent).toEqual(gameField.filter(({id}) => [1, 2, 4, 5, 8].includes(id)))
})
test('getAdjacent - ring', () => {
    const gameField = pipe(
        map((val: GameBlock) => val.id !== 4
            ? {...val, ...{color: Color.BLUE}}
            : val),
        flatten
    )(simpleGameField(9)) as GameField
    const adjacent = getAdjacent(gameField[2], gameField)
    expect(adjacent).toEqual(gameField.filter(({id}) => id !== 4))
})
test('getAdjacent - large pattern', () => {
    const gameField = pipe(
        map((val: GameBlock) => val.id !== 33
            ? {...val, ...{color: Color.BLUE}}
            : val),
        flatten
    )(simpleGameField(400))
    const adjacent = getAdjacent(gameField[0], gameField)
    expect(adjacent).toEqual(gameField.filter(({id}) => id !== 33))
})

test('findGaps - empty list should create empty list', () => {
    const arr = [] as number[]
    const gaps = findGaps(arr)
    expect(gaps).toEqual([])
})
test('findGaps - list with no gaps should create empty list', () => {
    const arr = range(1, 100)
    const gaps = findGaps(arr)
    expect(gaps).toEqual([])
})
test('findGaps - 1 gap', () => {
    const remove = [10]
    const arr = reject((x: number) => remove.includes(x), range(0, 99)) as number[]
    const gaps = findGaps(arr)
    expect(gaps).toEqual(remove)
})
test('findGaps - 5 gaps', () => {
    const remove = [10, 20, 30]
    const arr = reject((x: number) => remove.includes(x), range(0, 99)) as number[]
    const gaps = findGaps(arr)
    expect(gaps).toEqual(remove.map((x, i) => x - i))
})

test('byGaps - no gaps should create one group', () => {
    const gameField = simpleGameField(400)
    const column = 5
    const columnValues = gameField.filter(({pos: [x]}) => x === column)
    const groupedByGaps = byGaps(column, columnValues, [])
    expect(groupedByGaps).toEqual([[`${column}-0`, columnValues]])
})
test('byGaps - 1 gap should create two groups', () => {
    const gameField = simpleGameField(400)
    const gaps = [8, 9]
    const column = 5
    const columnValues = gameField.filter(({pos: [x]}) => x === column)
    const groupedByGaps = byGaps(column, columnValues, gaps)
    expect(groupedByGaps).toEqual(gaps.map((val, i, arr) => [`${column}-${i}`, columnValues.slice(i === 0 ? 0 : arr[i - 1], val)]))
})

test('getMinY - complete GameField', () => {
    const gameField = simpleGameField(400)
    const minY = getMinY(gameField)
    expect(minY).toBe(0)
})
test('getMinY - filtered GameField', () => {
    const gameField = simpleGameField(400).filter(({pos: [x, y]}) => y >= 14)
    const minY = getMinY(gameField)
    expect(minY).toBe(14)
})
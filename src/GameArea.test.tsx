import { compose, flatten, map, pipe, range, reject } from 'lodash/fp';
import {
    byGaps,
    differenceById,
    findGaps,
    findGapsRange,
    getAdjacent,
    getQuadraticGrid,
    getMinY,
    getNeighbours, initGameField,
    mapPosY
} from './componentsBricks/GameAreaUtils';
import * as _ from 'lodash';
import { stub } from 'sinon';
import { Color, GameBlock, GameField } from './componentsBricks/constants';

const simpleGameField = (size: number) => pipe(
    range,
    map((val: number) => ({
        id: val,
        color: Color.YELLOW,
        pos: [val % Math.sqrt(size), Math.floor(val / Math.sqrt(size))]
    }) as GameBlock)
)(0, size - 1) as GameField

test('initGameField', () => {
    const randomStub = stub(_, 'random').returns(1)
    const rows = 2
    const columns = 3
    const field = initGameField(rows, columns)
    expect(field).toEqual([
        {color: 'orange', id: 1, pos: [1, 2]},
        {color: 'orange', id: 2, pos: [2, 1]},
        {color: 'orange', id: 3, pos: [2, 2]},
        {color: 'orange', id: 4, pos: [3, 1]},
        {color: 'orange', id: 5, pos: [3, 2]}
    ])
})

test('differenceById', () => {
    const field1 = [{id: 1, color: Color.YELLOW, pos: [0, 1]}, {id: 2, color: Color.YELLOW, pos: [0, 1]}]
    const field2 = [{id: 2, color: Color.YELLOW, pos: [0, 1]}]
    const difference = differenceById(field1, field2)
    expect(difference).toEqual([{id: 1, color: Color.YELLOW, pos: [0, 1]}])
})

test('mapY', () => {
    expect(mapPosY([{id: 0, color: Color.YELLOW, pos: [0, 1]}, {id: 0, color: Color.YELLOW, pos: [0, 2]}]))
        .toEqual([1, 2])
})

test('getQuadraticGrid', () => {
    const grid = getQuadraticGrid(2)
    expect(grid).toEqual([[1, 1], [1, 2], [2, 1], [2, 2]].map(pos => ({pos})))
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
test('findGaps - list with no gaps should create list containing list length', () => {
    const arr = range(1, 100)
    const gaps = findGaps(arr)
    expect(gaps).toEqual([arr.length])
})
test('findGaps - 1 gap', () => {
    const remove = [10]
    const arr = reject((x: number) => remove.includes(x), range(0, 99)) as number[]
    const gaps = findGaps(arr)
    expect(gaps).toEqual([...remove.map((x, i) => x - i), arr.length])
})
test('findGaps - 5 gaps', () => {
    const remove = [10, 20, 30]
    const fields = range(0, 99)
    const arr = reject((x: number) => remove.includes(x), fields) as number[]
    const gaps = findGaps(arr)
    expect(gaps).toEqual([...remove.map((x, i) => x - i), arr.length])
})

test('findGaps', () => {
    const arr = [1, 2, 4, 5]
    const gaps = findGapsRange(1, 5)
    expect(gaps(arr)).toEqual([3])
})

test('byGaps - no gaps should create no group', () => {
    const gameField = simpleGameField(400)
    const column = 5
    const columnValues = gameField.filter(({pos: [x]}) => x === column)
    const groupedByGaps = byGaps(column, columnValues, [])
    expect(groupedByGaps).toEqual([])
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
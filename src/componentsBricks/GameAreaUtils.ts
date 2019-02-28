import {
  concat,
  curry,
  curryRight,
  filter,
  flatMap,
  flatten,
  groupBy,
  head,
  map,
  pipe,
  property,
  reject,
  slice,
  sortBy,
  sortedUniqBy,
  toPairs,
  uniqBy,
  zip
} from "lodash/fp";
import { differenceWith, either, repeat, xprod } from "ramda";
import { random, range } from "lodash";

import { Color, GameBlock, GameField } from "./constants";
import { formatNumber } from "./GeneralUtils";

const reduce = require("lodash/fp/reduce").convert({ cap: false });

export const formatNumberD = curryRight(formatNumber)(".");

export const differenceById = differenceWith(
  (x: GameBlock, y: GameBlock) => x.id === y.id
) as any;
export const differenceByIdRight = curryRight(differenceWith(
  (x: GameBlock, y: GameBlock) => x.id === y.id
) as any);

export const initGameField = (fieldRows: number, fieldColumns: number) =>
  pipe(
    map(i => [i, random(0, 1)] as [number, number]),
    map(([i, x]: [number, number]) => ({
      color: x === 0 ? Color.BLUE : Color.ORANGE,
      id: i,
      pos: [Math.floor(i / fieldRows) + 1, (i % fieldRows) + 1] as [
        number,
        number
      ]
    }))
  )(range(1, fieldRows * fieldColumns));

export const getQuadraticGrid = (
  fieldRows: number
): Array<{ pos: [number, number] }> => {
  const cells = range(1, fieldRows + 1);
  return pipe(
    flatMap((x: number) =>
      cells.map((y: number) => [x, y] as [number, number])
    ),
    map((pos: [number, number]) => ({ pos }))
  )(cells);
};

export const getGrid = (
  fieldRows: number,
  fieldColumns: number
): Array<[number, number]> =>
  xprod(range(1, fieldRows + 1), range(1, fieldColumns + 1)) as Array<
    [number, number]
  >;

export const mapPosY = map(({ pos: [_, posY] }) => posY);

const isNeighbourY = curry(
  ({ pos: [x, y] }: GameBlock, { pos: [posX, posY] }: GameBlock) =>
    posX === x && Math.abs(posY - y) === 1
);
const isNeighbourX = curry(
  ({ pos: [x, y] }: GameBlock, { pos: [posX, posY] }: GameBlock) =>
    posY === y && Math.abs(posX - x) === 1
);

export const getNeighbours = curry(
  (block: GameBlock, blocks: GameField): GameField =>
    blocks.filter(either(isNeighbourX(block), isNeighbourY(block)))
);

export const getAdjacent = (block: GameBlock, blocks: GameField): GameField => {
  let visited = [] as GameField;
  const inner = (block: GameBlock): GameField => {
    const neighbours: GameField = getNeighbours(
      block,
      differenceById(blocks, visited)
    );
    const relevantNeighbours = filter(
      ({ color }) => color === block.color,
      neighbours
    );
    const bridgeNeighbours = filter(
      ({ color }) => color === Color.RED || block.color === Color.RED,
      neighbours
    );
    visited = differenceById(
      concat(visited, neighbours),
      map((block: GameBlock) => getNeighbours(block, blocks), bridgeNeighbours)
    );
    const result = [
      ...relevantNeighbours,
      ...bridgeNeighbours,
      ...pipe(
        map((neighbour: GameBlock) => inner(neighbour)),
        flatten
      )([...bridgeNeighbours, ...relevantNeighbours])
    ];
    return sortedUniqBy("id", sortBy("id", result));
  };
  return inner(block);
};

export const findGapsRange = curry(
  (min: number, max: number, arr: number[]): number[] =>
    pipe(
      map(([i, x]) => [i, arr.includes(i) || x]),
      reject(([i, x]: [number, boolean]) => x),
      map(property("[0]"))
    )(zip(range(1, max + 1), repeat(false, max)))
);

export const findGaps = (arr: number[]): number[] => {
  const gaps = pipe(
    sortBy(""),
    reduce(
      (acc: number[], val: number, i: number, arr: number[]) =>
        i !== 0 && Math.abs(arr[i - 1] - val) !== 1 ? [...acc, i] : acc,
      []
    )
  )(arr) as number[];
  return arr.length ? [...gaps, arr.length] : [];
};

export const byGaps = (x: number, values: GameField, gaps: number[]) =>
  gaps.map((val: number, i: number, arr: number[]) => {
    return [
      `${x}-${i}`,
      pipe(
        sortBy("pos[1]"),
        slice((i === 0 && 0) || arr[i - 1], val)
      )(values)
    ];
  }, gaps);

export const groupByGaps = pipe(
  groupBy("pos[0]"),
  toPairs,
  map(([x, val]) => [parseInt(x), val]),
  reduce((acc: number[], [x, values]: [number, GameField]) => {
    const gaps = pipe(
      mapPosY,
      findGaps
    )(values);
    return [...acc, ...byGaps(x, values, gaps)];
  }, [])
);

export const getMinY = pipe(
  map(property("pos[1]")),
  sortBy("") as any,
  head
) as (blocks: GameField) => number;

export const recalculatePositions = (newField: GameField) => (
  gaps: any
): GameField => {
  const filterAbove = (x: number, upperBound: number) =>
    filter(
      ({ pos: [posX, posY] }: GameBlock) => x === posX && upperBound > posY
    );
  const sortByY = sortBy("pos[1]");
  const sortById = sortBy("id");
  const decrementXByLength = (x: number, xDiff: number) =>
    map((b: GameBlock) => ({
      ...b,
      pos: [x, b.pos[1] + xDiff]
    }));
  return reduce(
    (acc: any, [xVal, values]: any, i: number, arr: number) => {
      const [x, gapIndex] = xVal.split("-").map((x: any) => parseInt(x));
      const upperBound = getMinY(values);
      const previousGaps = filter(
        ({ pos: [x2, y2] }: GameBlock) => x === x2,
        acc
      );
      const newPositions = (pipe(
        concat,
        filterAbove(x, upperBound),
        sortByY as any,
        decrementXByLength(x, values.length),
        sortById as any
      ) as (field1: GameField, field2: GameField) => GameField)(
        differenceById(newField, previousGaps),
        previousGaps
      );
      return pipe(
        concat(differenceById(acc, previousGaps)),
        sortById as any
      )(newPositions) as GameField;
    },
    [],
    gaps
  );
};

export const calcMultiplier = (n: number) => Math.floor(n / 10 + 1) ** 2;
export const calcScore = (n: number) => n * 5 * calcMultiplier(n);
export const calcRemove = (block: GameBlock, blocks: GameField) =>
  uniqBy("id", [block, ...getAdjacent(block, blocks)]);

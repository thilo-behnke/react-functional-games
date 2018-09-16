export const FIELD_ROWS = 20
export const FIELD_COLUMNS = 20


export enum Color {
    BLUE = 'blue',
    YELLOW = 'yellow'
}

export type GameBlock = { color: Color, id: number, pos: [number, number] }
export type GameField = Array<GameBlock>

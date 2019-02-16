export const FIELD_ROWS = 20
export const FIELD_COLUMNS = 20

export enum Color {
    BLUE = 'blue',
    GREEN = 'green',
    RED = 'red',
    ORANGE = 'orange',
    YELLOW = 'yellow'
}

export enum GameState {
    PLAYING = 'PLAYING',
    LOST = 'LOST',
    WON = 'WON'
}

export enum GameMode {
    NORMAL = 'NORMAL',
    BRIDGE = 'BRIDGE'
}

export type GameBlock = { color: Color, id: number, pos: [number, number], selected?: boolean }
export type GameField = Array<GameBlock>

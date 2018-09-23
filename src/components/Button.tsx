import * as React from 'react';

export const Button = ({onClick, title}: { onClick: () => void, title: string }) =>
    <button {...{onClick}}>{title}</button>
import * as React from 'react';
import { formatNumberD } from './GameAreaUtils';

const Score = ({score}: { score: number }) => <div>Score: {formatNumberD(score)}</div>
export default Score
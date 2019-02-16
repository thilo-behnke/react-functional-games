import "./Score.css";

import * as React from "react";

import { formatNumberD } from "./GameAreaUtils";

const ScoreCalc = ({
  tempScore: { score, multiplier }
}: {
  tempScore: { score: number; multiplier: number };
}) =>
  !!(score && multiplier) && (
    <div className="PlusScore">{`+ ${formatNumberD(
      score
    )} points! x${formatNumberD(multiplier)}`}</div>
  );
export default ScoreCalc;

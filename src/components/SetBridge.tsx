import * as React from 'react';

type SetBridgeProps = {onClick: () => void, active: boolean, enabled: boolean}

const SetBridge = (props: SetBridgeProps) =>
    <button
        disabled={!props.enabled}
        onClick={props.onClick}>
        {props.enabled && (props.active ? 'Deactivate Bridge mode' : 'Activate Bridge mode') || 'No more bridges available'}
    </button>

export default SetBridge
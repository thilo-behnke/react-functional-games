import * as React from 'react';
import './SetBridge.css';

type SetBridgeProps = {onClick: () => void, active: boolean, enabled: boolean}

const SetBridge = ({active, enabled, onClick}: SetBridgeProps) =>
    <button
        className={`SetBridge SetBridge--${active ? 'active': 'inactive'}`}
        disabled={!enabled}
        onClick={onClick}>
        {enabled && (active ? 'Deactivate Bridge mode' : 'Activate Bridge mode') || 'No more bridges available'}
    </button>

export default SetBridge
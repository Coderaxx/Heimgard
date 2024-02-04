module.exports = {
    convertUint8ToString: (payload) => {
        switch (payload.operationEventSource) {
            case 0x00:
                payload.operationEventSource = 'Keypad';
                break;
            case 0x01:
                payload.operationEventSource = 'RF';
                break;
            case 0x02:
                payload.operationEventSource = 'Manual';
                break;
            case 0x03:
                payload.operationEventSource = 'RFID';
                break;
            case 0x04:
                payload.operationEventSource = 'Fingerprint';
                break;
            case 0xFF:
                payload.operationEventSource = 'Indeterminate';
                break;
        }
        switch (payload.operationEventCode) {
            case 0x00:
                payload.operationEventCode = 'UnknownOrMfgSpecific';
                break;
            case 0x01:
                payload.operationEventCode = 'Lock';
                break;
            case 0x02:
                payload.operationEventCode = 'Unlock';
                break;
            case 0x03:
                payload.operationEventCode = 'LockFailureInvalidPINorID';
                break;
            case 0x04:
                payload.operationEventCode = 'LockFailureInvalidSchedule';
                break;
            case 0x05:
                payload.operationEventCode = 'UnlockFailureInvalidPINorID';
                break;
            case 0x06:
                payload.operationEventCode = 'UnlockFailureInvalidSchedule';
                break;
            case 0x07:
                payload.operationEventCode = 'OneTouchLock';
                break;
            case 0x08:
                payload.operationEventCode = 'KeyLock';
                break;
            case 0x09:
                payload.operationEventCode = 'KeyUnlock';
                break;
            case 0x0A:
                payload.operationEventCode = 'AutoLock';
                break;
            case 0x0B:
                payload.operationEventCode = 'ScheduleLock';
                break;
            case 0x0C:
                payload.operationEventCode = 'ScheduleUnlock';
                break;
            case 0x0D:
                payload.operationEventCode = 'Manual Lock (Key or Thumbturn)';
                break;
            case 0x0E:
                payload.operationEventCode = 'Manual Unlock (Key or Thumbturn)';
                break;
            case 0x0F:
                payload.operationEventCode = 'Non-Access User Operational Event';
                break;
        }

        return payload;
    }
}
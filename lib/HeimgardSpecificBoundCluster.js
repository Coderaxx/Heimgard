'use strict';

const { BoundCluster } = require("zigbee-clusters");

class HeimgardSpecificBoundCluster extends BoundCluster {
    constructor({ onLockDoor, onUnlockDoor, onUnlockWithTimeout, onOperatingEventNotification }) {
        super();
        this._onLockDoor = onLockDoor;
        this._onUnlockDoor = onUnlockDoor;
        this._onUnlockWithTimeout = onUnlockWithTimeout;
        this._onOperatingEventNotification = onOperatingEventNotification;
    }

    LockDoor() {
        this._onLockDoor();
    }

    UnlockDoor() {
        this._onUnlockDoor();
    }

    UnlockWithTimeout({ timeout }) {
        this._onUnlockWithTimeout(timeout);
    }

    OperatingEventNotification({ operationEventSource, operationEventCode, userID, pinCode, localTime, data }) {
        this._onOperatingEventNotification({ operationEventSource, operationEventCode, userID, pinCode, localTime, data });
    }
}

module.exports = HeimgardSpecificBoundCluster;
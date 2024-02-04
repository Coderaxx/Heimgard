'use strict';

const { BoundCluster } = require("zigbee-clusters");

class DoorLockBoundCluster extends BoundCluster {
    constructor({ onUnlockDoor, onLockDoor, onOperatingEventNotification }) {
        super();
        this._onUnlockDoor = onUnlockDoor;
        this._onLockDoor = onLockDoor;
        this._onOperatingEventNotification = onOperatingEventNotification;
    }

    unlockDoor(payload) {
        if (typeof this._onUnlockDoor === 'function') {
            this._onUnlockDoor(payload);
        }
    }

    lockDoor(payload) {
        if (typeof this._onLockDoor === 'function') {
            this._onLockDoor(payload);
        }
    }

    operatingEventNotification(payload) {
        if (typeof this._onOperatingEventNotification === 'function') {
            this._onOperatingEventNotification(payload);
        }
    }
}

module.exports = DoorLockBoundCluster;
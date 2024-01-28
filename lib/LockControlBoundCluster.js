'use strict';

const { BoundCluster } = require("zigbee-clusters");

class LockControlBoundCluster extends BoundCluster {
    constructor({ onLockDoor, onUnlockDoor, onUnlockWithTimeout }) {
        super();
        this._onLockDoor = onLockDoor;
        this._onUnlockDoor = onUnlockDoor;
        this._onUnlockWithTimeout = onUnlockWithTimeout;
    }

    async unlockDoor(payload) {
        this._onUnlock(payload);
    }

    async lockDoor(payload) {
        this._onLock(payload);
    }

    async unlockWithTimeout(payload) {
        this._onUnlockWithTimeout(payload);
    }
}

module.exports = LockControlBoundCluster;
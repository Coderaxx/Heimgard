'use strict';

const { BoundCluster } = require("zigbee-clusters");

class LockControlBoundCluster extends BoundCluster {
    constructor({ onLockDoor, onUnlockDoor, onUnlockWithTimeout }) {
        super();
        this._onLockDoor = onLockDoor;
        this._onUnlockDoor = onUnlockDoor;
        this._onUnlockWithTimeout = onUnlockWithTimeout;
    }

    async onLockDoor(payload) {
        this._onLockDoor(payload);
    }

    async onUnlockDoor(payload) {
        this._onUnlockDoor(payload);
    }

    async onUnlockWithTimeout(payload) {
        this._onUnlockWithTimeout(payload);
    }
}

module.exports = LockControlBoundCluster;
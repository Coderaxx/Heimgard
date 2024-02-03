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
        console.log("******** Hey I'm running **************");
        if (typeof this._onUnlockDoor === 'function') {
            this._onUnlockDoor(payload);
        }
    }

    lockDoor(payload) {
        console.log("******** Hey I'm running **************");
        if (typeof this._onLockDoor === 'function') {
            this._onLockDoor(payload);
        }
    }

    operatingEventNotification(payload) {
        console.log("******** Hey I'm running **************");
        if (typeof this._onOperatingEventNotification === 'function') {
            this._onOperatingEventNotification(payload);
            console.log("******** Hey I'm running **************", payload);
        }
    }
}

module.exports = DoorLockBoundCluster;
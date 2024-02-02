'use strict';

const { BoundCluster } = require("zigbee-clusters");

class HeimgardSpecificBoundCluster extends BoundCluster {
    constructor({ onOperatingEventNotification }) {
        super();
        this._onOperatingEventNotification = onOperatingEventNotification;
    }

    OperatingEventNotification(payload) {
        this._onOperatingEventNotification(payload);
    }
}

module.exports = HeimgardSpecificBoundCluster;
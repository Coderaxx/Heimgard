'use strict';

const { Cluster, ZCLDataTypes } = require('zigbee-clusters');

const ATTRIBUTES = {
    lockState: { id: 0, type: ZCLDataTypes.enum8 },
    lockType: { id: 1, type: ZCLDataTypes.enum8 },
    doorState: { id: 3, type: ZCLDataTypes.enum8 },
    doorOpenEvents: { id: 4, type: ZCLDataTypes.uint32 },
    doorClosedEvents: { id: 5, type: ZCLDataTypes.uint32 },
};

const COMMANDS = {
    lock: { id: 6 },
};

class HeimgardSpecificDoorLockCluster extends Cluster {

    static get ID() {
        return 257;
    }

    static get NAME() {
        return 'doorLock';
    }

    static get ATTRIBUTES() {
        return ATTRIBUTES;
    }

    static get COMMANDS() {
        return COMMANDS;
    }

}

Cluster.addCluster(HeimgardSpecificDoorLockCluster);

module.exports = HeimgardSpecificDoorLockCluster;
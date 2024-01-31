'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER, debug } = require('zigbee-clusters');

// Enable debug logging of all relevant Zigbee communication
debug(true);

const HeimgardDoorLockCluster = require('../../lib/HeimgardDoorLockCluster');
Cluster.addCluster(HeimgardDoorLockCluster);

class HTSLM2 extends ZigBeeDevice {

    async onNodeInit({ zclNode }) {
        this.log('HT-SLM-2 Node has been initialized');

        this.enableDebug();
        //this.printNode();

        this.registerCapability('locked', CLUSTER.DOOR_LOCK, {
            set: value => (value ? 'lockDoor' : 'unlockDoor'),
            setParser(setValue) {
                this.log('setParser', setValue);
                if (setValue === 'lockDoor') return true;
                return false;
            },
            get: 'lockState',
            report: 'lockState',
            reportParser(report) {
                this.log('reportParser', report);
                if (report && report === 'locked') return true;
                return false;
            },
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0,
                    maxInterval: 60 * 1000,
                    minChange: 1,
                },
            },
            endpoint: 1, // Default is 1
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 60 * 60 * 1000,
            },
        });

        this.registerCapability('measure_voltage', CLUSTER.POWER_CONFIGURATION, {
            get: 'batteryVoltage',
            report: 'batteryVoltage',
            reportParser(report) {
                if (report) {
                    return report / 10;
                }
            },
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0,
                    maxInterval: 10800,
                    minChange: 1,
                },
            },
            endpoint: 1,
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 60 * 60 * 1000,
            },
        });

        this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
            get: 'batteryPercentageRemaining',
            report: 'batteryPercentageRemaining',
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0,
                    maxInterval: 10800,
                    minChange: 1,
                },
            },
            endpoint: 1,
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 60 * 60 * 1000,
            },
        });

        this.batteryThreshold = 20;
        this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION, {
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0,
                    maxInterval: 10800,
                    minChange: 1,
                },
            },
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
            },
        });

        zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME]
            .on('attr.lockState', (lockState) => {
                this.log('Lock state changed to:', lockState);
            });

        zclNode.endpoints[1].clusters[CLUSTER.POWER_CONFIGURATION.NAME]
            .on('attr.batteryVoltage', (batteryVoltage) => {
                // handle reported attribute value
                this.log('attr.batteryVoltage', batteryVoltage);
            });

        zclNode.endpoints[1].clusters[CLUSTER.POWER_CONFIGURATION.NAME]
            .on('attr.batteryPercentageRemaining', (batteryPercentageRemaining) => {
                // handle reported attribute value
                this.log('attr.batteryPercentageRemaining', batteryPercentageRemaining);
            });
    }

    async onEndDeviceAnnounce() {
        this.log('HT-SLM-2 has been discovered');
    }

    async onAdded() {
        this.log('HT-SLM-2 has been added');
    }

    async onSettings({ oldSettings, newSettings, changedKeys }) {
        this.log('HT-SLM-2 settings were changed');
    }

    async onRenamed(name) {
        this.log('HT-SLM-2 was renamed');
    }

    async onDeleted() {
        this.log('HT-SLM-2 has been deleted');
    }

}
module.exports = HTSLM2;

'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER, debug } = require('zigbee-clusters');
const HeimgardSpecificBoundCluster = require('../../lib/HeimgardSpecificBoundCluster');

//debug(true);

const HeimgardDoorLockCluster = require('../../lib/HeimgardDoorLockCluster');
Cluster.addCluster(HeimgardDoorLockCluster);

class HTSLM2 extends ZigBeeDevice {
    async onNodeInit({ zclNode }) {
        this.log = this.log.bind(this);
        this.settings = await this.getSettings();
        //this.enableDebug();
        //this.printNode();

        //this.log(await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].discoverCommandsGenerated());

        zclNode.endpoints[1].bind(
            CLUSTER.DOOR_LOCK.NAME,
            new HeimgardSpecificBoundCluster({
                onOperatingEventNotification: (payload) => {
                    this.log('OperatingEventNotification:', 'HT-SLM-2', 'DEBUG', payload);
                },
            })
        );

        this.registerCapability('locked', CLUSTER.DOOR_LOCK, {
            set: value => (value ? 'lockDoor' : 'unlockDoor'),
            setParser(setValue) {
                if (setValue === 'lockDoor') return true;
                return false;
            },
            get: 'lockState',
            report: 'lockState',
            reportParser(report) {
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

        this.batteryThreshold = this.settings.batteryThreshold || 20;
        this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION, {
            get: 'batteryPercentageRemaining',
            report: 'batteryPercentageRemaining',
            reportParser(report) {
                if (report && report < this.batteryThreshold) return true;
                return false;
            },
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
                this.log('Lock state changed to:', 'HT-SLM-2', 'DEBUG', lockState);
            });

        zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME]
            .on('command.OperatingEventNotification', (OperatingEventNotification) => {
                this.log('OperatingEventNotification:', 'HT-SLM-2', 'DEBUG', OperatingEventNotification);
            });

        this.log('HT-SLM-2 Node has been initialized', 'HT-SLM-2');
    }

    pinRfidCodeFormat(code) {
        const asciiEncoded = [...code].map(c => c.charCodeAt(0).toString(16)).join('');
        const lengthPrefix = Buffer.from([code.length]).toString('hex');
        return lengthPrefix + asciiEncoded;
    }

    async onAdded() {
        this.log('HT-SLM-2 has been added', 'HT-SLM-2');
    }

    async onSettings({ oldSettings, newSettings, changedKeys }) {
        this.log('HT-SLM-2 settings were changed', 'HT-SLM-2');
    }

    async onRenamed(name) {
        this.log('HT-SLM-2 was renamed', 'HT-SLM-2');
    }

    async onDeleted() {
        this.log('HT-SLM-2 has been deleted', 'HT-SLM-2');
    }

}
module.exports = HTSLM2;

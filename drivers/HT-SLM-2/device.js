'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER, debug } = require('zigbee-clusters');
const HeimgardSpecificBoundCluster = require('../../lib/HeimgardSpecificBoundCluster');
const HeimgardDoorLockCluster = require('../../lib/HeimgardDoorLockCluster');
Cluster.addCluster(HeimgardDoorLockCluster);

debug(true);

class HTSLM2 extends ZigBeeDevice {
    async onNodeInit({ zclNode }) {
        this.settings = await this.getSettings();
        this.enableDebug();
        //this.printNode();

        //this.log(await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].discoverCommandsGenerated());
        //this.log(await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].discoverAttributesExtended());
        /*await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].setPinCode({
            userID: 5,
            userStatus: 1,
            userType: 0,
            pinCode: Buffer.from('0589'),
        }).catch(e => this.homey.app.log(e, 'HT-SLM-2', 'ERROR'));*/

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
                this.homey.app.log('Lock state changed:', 'HT-SLM-2', 'DEBUG', lockState);
            });

        this.homey.app.log('HT-SLM-2 Node has been initialized', 'HT-SLM-2');
    }

    pinRfidCodeFormat(code) {
        const asciiEncoded = [...code].map(c => c.charCodeAt(0).toString(16)).join('');
        const lengthPrefix = Buffer.from([code.length]).toString('hex');
        return lengthPrefix + asciiEncoded;
    }

    async onAdded() {
        this.homey.app.log('HT-SLM-2 has been added', 'HT-SLM-2');
    }

    async onSettings({ oldSettings, newSettings, changedKeys }) {
        this.homey.app.log('HT-SLM-2 settings were changed', 'HT-SLM-2');
    }

    async onRenamed(name) {
        this.homey.app.log('HT-SLM-2 was renamed', 'HT-SLM-2');
    }

    async onDeleted() {
        this.homey.app.log('HT-SLM-2 has been deleted', 'HT-SLM-2');
    }

}
module.exports = HTSLM2;

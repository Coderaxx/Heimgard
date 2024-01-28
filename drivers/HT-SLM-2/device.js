'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER, debug } = require('zigbee-clusters');
const LockControlBoundCluster = require('../../lib/LockControlBoundCluster');

// Enable debug logging of all relevant Zigbee communication
debug(true);

const HeimgardDoorLockCluster = require('../../lib/HeimgardDoorLockCluster');
Cluster.addCluster(HeimgardDoorLockCluster);

class HTSLM2 extends ZigBeeDevice {

    async onNodeInit({ zclNode }) {
        this.log('HT-SLM-2 Node has been initialized');

        this.enableDebug();
        this.printNode();

        //this.log('discoverAttributesExtended', await zclNode.endpoints[1].clusters.doorLock.discoverAttributesExtended());
        //this.log('readReportingConfiguration', await zclNode.endpoints[1].clusters.doorLock.readReportingConfiguration(["lockState", "lockType", "actuatorEnabled", "doorState", "doorOpenEvents", "doorClosedEvents"]));
        /*const currentLockState = await zclNode.endpoints[1].clusters.doorLock.readAttributes(
            ["lockState", "lockType", "actuatorEnabled", "doorState", "soundVolume", "language", "numberOfTotalUsersSupported", "enableLocalProgramming"],
        ).catch(err => { this.error(err); });
        this.log('Door Lock State: ' + JSON.stringify(currentLockState, null, 2));*/

        this.log('discoverCommandsGenerated', await zclNode.endpoints[1].clusters.doorLock.discoverCommandsGenerated());
        this.log('discoverCommandsReceived', await zclNode.endpoints[1].clusters.doorLock.discoverCommandsReceived());

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
                    minInterval: 0, // Minimally once every hour
                    maxInterval: 60 * 60 * 1000, // Maximally once every ~16 hours
                    minChange: 0,
                },
            },
            endpoint: 1, // Default is 1
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 1000 * 1000, // in ms
            },
        });

        await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].on('response', async (data) => {
            this.log('response', data);
        });

        zclNode.endpoints[1].bind(
            CLUSTER.DOOR_LOCK.NAME, new LockControlBoundCluster({
                onLock: (payload) => {
                    this.log('onLock', payload);
                    this.setCapabilityValue('locked', true);
                },
                onUnlock: (payload) => {
                    this.log('onUnlock', payload);
                    this.setCapabilityValue('locked', false);
                },
                unlockWithTimeout: (payload) => {
                    this.log('unlockWithTimeout', payload);
                }
            })
        );

        /*this.registerCapability('measure_voltage', CLUSTER.POWER_CONFIGURATION, {
            get: 'batteryVoltage',
            report: 'batteryVoltage',
            reportParser(report) {
                if (report) {
                    return report / 10;
                }
            },
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0, // Minimally once every hour
                    maxInterval: 10800 * 1000, // Maximally once every ~16 hours
                    minChange: 1,
                },
            },
            endpoint: 1, // Default is 1
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 30 * 1000, // in ms
            },
        });

        if (this.hasCapability('alarm_battery')) {
            // Set battery threshold under which the alarm should go off
            this.batteryThreshold = 20;

            // Register measure_battery capability and configure attribute reporting
            this.registerCapability('alarm_battery', CLUSTER.POWER_CONFIGURATION, {
                getOpts: {
                    getOnStart: true,
                },
                reportOpts: {
                    configureAttributeReporting: {
                        minInterval: 0, // No minimum reporting interval
                        maxInterval: 10800 * 1000, // Maximally every ~16 hours
                        minChange: 5, // Report when value changed by 5
                    },
                },
            });
        }

        this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
            get: 'batteryPercentageRemaining',
            report: 'batteryPercentageRemaining',
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0, // Minimally once every hour
                    maxInterval: 10800 * 1000, // Maximally once every ~16 hours
                    minChange: 1,
                },
            },
            endpoint: 1, // Default is 1
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 30 * 1000, // in ms
            },
        });*/
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

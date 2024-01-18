'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { DoorLockCluster, CLUSTER, debug } = require('zigbee-clusters');

// Enable debug logging of all relevant Zigbee communication
debug(true);

class HTSLM2 extends ZigBeeDevice {

    async onNodeInit({ zclNode }) {
        this.log('HT-SLM-2 Node has been initialized');

        this.enableDebug();
        this.printNode();

        // Les låsens tilstand
        try {
            const attributes = await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].readAttributes([0, 1, 3, 4, 5, 32, 257]);
            this.log('Lock state:', attributes);
        } catch (error) {
            this.error('Error reading lock state:', error);
        }

        this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
            get: 'batteryPercentageRemaining',
            report: 'batteryPercentageRemaining',
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0, // Minimally once every hour
                    maxInterval: 60000, // Maximally once every ~16 hours
                    minChange: 1,
                },
            },
            endpoint: 1, // Default is 1
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 30000, // in ms
            },
        });

        this.registerCapability('locked', CLUSTER.DOOR_LOCK, {
            get: 'DoorState',
            report: 'DoorState',
            reportOpts: {
                configureAttributeReporting: {
                    minInterval: 0, // Minimally once every hour
                    maxInterval: 60000, // Maximally once every ~16 hours
                    minChange: 1,
                },
            },
            endpoint: 1, // Default is 1
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 30000, // in ms
            },
        });

        this.log(CLUSTER.DOOR_LOCK);

        // Sett opp en handler for å lytte etter rapporter
        zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].on('report', (attribute, value) => {
            this.log(`Received report for ${attribute}:`, value);
        });
    }

    async onAdded() {
        this.log('HT-SLM-2 has been added');
    }

    async onSettings({ oldSettings, newSettings, changedKeys }) {
        this.log('HT-SLM-2 settings where changed');
    }

    async onRenamed(name) {
        this.log('HT-SLM-2 was renamed');
    }

    async onDeleted() {
        this.log('HT-SLM-2 has been deleted');
    }

}
module.exports = HTSLM2;

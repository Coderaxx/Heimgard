'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER, debug } = require('zigbee-clusters');

// Enable debug logging of all relevant Zigbee communication
debug(true);

class HTSLM2 extends ZigBeeDevice {

    async onNodeInit({ zclNode }) {
        this.log('HT-SLM-2 Node has been initialized');

        this.enableDebug();
        this.printNode();

        //this.log(await zclNode.endpoints[1].clusters.doorLock.discoverAttributesExtended());
        this.log(await zclNode.endpoints[1].clusters.doorLock.readReportingConfiguration([27, 36, 40]));
        this.log(await zclNode.endpoints[1].clusters.doorLock.discoverCommandsGenerated());
        this.log(await zclNode.endpoints[1].clusters.doorLock.discoverCommandsReceived());
        this.log(await zclNode.endpoints[1].clusters.doorLock.writeAttribute(27, 0x00, 0x00, 0x00, true));

        /*this.registerCapability('measure_battery', CLUSTER.POWER_CONFIGURATION, {
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
        });*/

        /*this.registerCapability('locked', CLUSTER.DOOR_LOCK, {
            get: 36,
            report: 36,
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
        });*/

        this.log(CLUSTER.DOOR_LOCK);
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

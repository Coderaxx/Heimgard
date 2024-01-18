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

        if (this.isFirstInit()) {
            // Register measure_battery capability and configure attribute reporting
            this.batteryThreshold = 20;
            await this.configureAttributeReporting([
                {
                    endpointId: 1,
                    cluster: CLUSTER.POWER_CONFIGURATION,
                    attributeName: 'batteryPercentageRemaining',
                    minInterval: 0, //??
                    maxInterval: 1500,
                    minChange: 0
                },
            ]);
        }
        // measure_battery 
        zclNode.endpoints[1].clusters[CLUSTER.POWER_CONFIGURATION.NAME].on('attr.batteryPercentageRemaining', this.onBatteryPercentageRemainingAttributeReport.bind(this));

        this.log(CLUSTER.DOOR_LOCK);
    }

    // Håndterer endringer i låsens tilstand
    onLockStateChange(value) {
        this.log('Lock state changed:', value);
        this.setCapabilityValue('locked', value === 'locked');
    }

    onEndDeviceAnnounce() {
        this.log('device came online!');
    }

    onBatteryPercentageRemainingAttributeReport(batteryPercentageRemaining) {
        this.log("measure_battery | powerConfiguration - batteryPercentageRemaining (%): ", batteryPercentageRemaining / 2);
        //const batteryThreshold = this.getSetting('batteryThreshold') || 20;
        this.setCapabilityValue('measure_battery', batteryPercentageRemaining / 2).catch(this.error);
        //this.setCapabilityValue('alarm_battery', (batteryPercentageRemaining/2 < batteryThreshold) ? true : false).catch(this.error);
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

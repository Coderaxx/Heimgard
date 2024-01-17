'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');
const { debug } = require('zigbee-clusters');

// Enable debug logging of all relevant Zigbee communication
debug(true);

class HTSLM2 extends ZigBeeDevice {

  async onNodeInit({ zclNode }) {
    this.log('HT-SLM-2 Node has been initialized');
    // Abonner på endringer i doorLock-klyngen
    try {
      const doorLockCluster = zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME];
      if (doorLockCluster) {
        doorLockCluster.on('attr.lockState', this.onLockStateChange.bind(this));
      }

      // Debug: Sjekk tilgjengeligheten av doorLock-klyngen
      if (zclNode.endpoints[1].clusters.doorLock) {
        this.log('doorLock cluster is available');
      } else {
        this.log('doorLock cluster is NOT available');
      }

      this.log('Door Lock Cluster Name:', CLUSTER.DOOR_LOCK.NAME);

      // Debug: Logg hele zclNode-objektet for å se detaljene
      this.log('zclNode:', zclNode);
    } catch (error) {
      this.log('Error in onNodeInit:', error);
    }
  }

  // Håndterer endringer i låsens tilstand
  onLockStateChange(value) {
    this.log('Lock state changed:', value);
    this.setCapabilityValue('locked', value === 'locked');
  }

  async onInit() {
    this.log('HT-SLM-2 has been initialized');
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

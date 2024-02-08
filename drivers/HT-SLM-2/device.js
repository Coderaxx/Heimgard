'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER, debug } = require('zigbee-clusters');
const { convertUint8ToString, convertStringToHex } = require('../../lib/util');
const HeimgardDoorLockCluster = require('../../lib/HeimgardDoorLockCluster');
Cluster.addCluster(HeimgardDoorLockCluster);

//debug(true);

class HTSLM2 extends ZigBeeDevice {
    async onNodeInit({ zclNode }) {
        this.homey.app.log('Started device initialization. Initializing node...', 'HT-SLM-2');
        this.settings = await this.getSettings();
        //this.enableDebug();
        //this.printNode();

        //this.log(await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].discoverCommandsGenerated());
        //this.log(await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].discoverCommandsReceived());
        //this.log(await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].discoverAttributesExtended());

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

        zclNode.endpoints[1].clusters.powerConfiguration.on('attr.batteryPercentageRemaining', this._onReport.bind(this));
        zclNode.endpoints[1].clusters.doorLock.on('attr.lockState', this._onReport.bind(this));
        zclNode.endpoints[1].clusters.doorLock.on('attr.soundVolume', this._onReport.bind(this));
        zclNode.endpoints[1].clusters.doorLock.on('event.operatingEventNotification', this._onOperatingEventNotification.bind(this));
        zclNode.endpoints[1].clusters.doorLock.on('event.programmingEventNotification', this._onProgrammingEventNotification.bind(this));

        await this.initFlows();

        this.homey.app.log('HT-SLM-2 Node has been initialized', 'HT-SLM-2');
    }

    async initFlows() {
        this._setUserPIn = this.homey.flow.getActionCard('setUserPin');
        this._setUserPIn.registerRunListener(async (args) => {
            await this.zclNode.endpoints[1].clusters.doorLock.setPinCode({
                userID: args.userID,
                userStatus: 0x01,
                userType: 0x00,
                pinCode: Buffer.from(`${args.pinCode}`),
            }).then(() => {
                this.homey.app.log(`Added a new user with ID ${args.userID} and PIN ${args.pinCode}.`, 'HT-SLM-2');
            }).catch(e => this.homey.app.log('Failed to add a new user:', 'HT-SLM-2', 'ERROR', e));
        });

        this._deleteUserPIn = this.homey.flow.getActionCard('deleteUserPin');
        this._deleteUserPIn.registerRunListener(async (args) => {
            await this.zclNode.endpoints[1].clusters.doorLock.clearPinCode({
                userID: args.userID
            }).then(() => {
                this.homey.app.log(`Deleted user with ID ${args.userID}.`, 'HT-SLM-2');
            }).catch(e => this.homey.app.log('Failed to delete user:', 'HT-SLM-2', 'ERROR', e));
        });

        this._deleteAllUserPins = this.homey.flow.getActionCard('deleteAllUserPins');
        this._deleteAllUserPins.registerRunListener(async (args) => {
            await this.zclNode.endpoints[1].clusters.doorLock.clearAllPinCodes().then(() => {
                this.homey.app.log(`Deleted all user pins.`, 'HT-SLM-2');
            }).catch(e => this.homey.app.log('Failed to delete user:', 'HT-SLM-2', 'ERROR', e));
        });

        this._userUnlock = this.homey.flow.getDeviceTriggerCard('userUnlock');
        this._userLock = this.homey.flow.getDeviceTriggerCard('userLock');
        
        this._unlockWithSpecificMethod = this.homey.flow.getDeviceTriggerCard('unlockWithSpecificMethod');
        this._unlockWithSpecificMethod.registerRunListener(async (args, state) => {
            if (args.userID === state.userID && args.method === state.method) {
                this.homey.app.log(`The lock was unlocked with ${args.method}`, 'HT-SLM-2');
                return true;
            }
            return false;
        });
        this._lockWithSpecificMethod = this.homey.flow.getDeviceTriggerCard('lockWithSpecificMethod');
        this._lockWithSpecificMethod.registerRunListener(async (args, state) => {
            if (args.userID === state.userID && args.method === state.method) {
                this.homey.app.log(`The lock was locked with ${args.method}`, 'HT-SLM-2');
                return true;
            }
            return false;
        });

        this.homey.app.log('HT-SLM-2 flows were initialized', 'HT-SLM-2');
    }

    async onAdded() {
        this.homey.app.log('HT-SLM-2 has been added', 'HT-SLM-2');
    }

    async onSettings({ oldSettings, newSettings, changedKeys }) {
        if (changedKeys.includes('batteryThreshold')) {
            this.batteryThreshold = newSettings.batteryThreshold;
        } else if (changedKeys.includes('soundVolume')) {
            const soundVolume = await convertStringToHex(newSettings.soundVolume);
            await this.zclNode.endpoints[1].clusters.doorLock.writeAttributes({ soundVolume: soundVolume }).then(() => {
                this.homey.app.log('Sound volume has been changed from ' + oldSettings.soundVolume + ' to ' + newSettings.soundVolume, 'HT-SLM-2');
            }).catch(e => this.homey.app.log(e, 'HT-SLM-2', 'ERROR'));
        }

        this.homey.app.log('HT-SLM-2 settings were changed', 'HT-SLM-2');
    }

    async onRenamed(name) {
        this.homey.app.log('HT-SLM-2 was renamed to ' + name, 'HT-SLM-2');
    }

    async onDeleted() {
        this._setUserPIn = null;
        this._deleteUserPIn = null;
        this._deleteAllUserPins = null;
        this._userUnlock = null;
        this._userLock = null;
        this._unlockWithSpecificMethod = null;
        this._lockWithSpecificMethod = null;

        this.homey.app.log('HT-SLM-2 has been deleted', 'HT-SLM-2');
    }

    async _onOperatingEventNotification(payload) {
        payload = await convertUint8ToString(payload);

        if (payload) {
            if (payload.operationEventCode && payload.userID) {
                if (payload.operationEventCode === 'Unlock') {
                    this._userUnlock.trigger(this, { userID: payload.userID });
                    this._unlockWithSpecificMethod.trigger(this, { userID: payload.userID, method: payload.operationEventSource }, { method: payload.operationEventSource });

                    this.homey.app.log(`User ${payload.userID} has unlocked the door.`, 'HT-SLM-2');
                } else if (payload.operationEventCode === 'Lock') {
                    this._userLock.trigger(this, { userID: payload.userID });
                    this._lockWithSpecificMethod.trigger(this, { userID: payload.userID, method: payload.operationEventSource }, { method: payload.operationEventSource });

                    this.homey.app.log(`User ${payload.userID} has locked the door.`, 'HT-SLM-2');
                }
            }
        }

        this.homey.app.log('Received an operating event notification:', 'HT-SLM-2', 'DEBUG', payload);
    }

    async _onProgrammingEventNotification(payload) {
        payload = await convertUint8ToString(payload);
        this.homey.app.log('Received a programming event notification:', 'HT-SLM-2', 'DEBUG', payload);
    }

    _onReport(data) {
        this.homey.app.log('Received an attribute report:', 'HT-SLM-2', 'DEBUG', data);
    }

    _onCommand(data) {
        this.homey.app.log('Received a command response:', 'HT-SLM-2', 'DEBUG', data);
    }

}

module.exports = HTSLM2;
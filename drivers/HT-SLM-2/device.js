'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { Cluster, CLUSTER, debug } = require('zigbee-clusters');
const DoorLockBoundCluster = require('../../lib/DoorLockBoundCluster');
const HeimgardDoorLockCluster = require('../../lib/HeimgardDoorLockCluster');
Cluster.addCluster(HeimgardDoorLockCluster);

debug(true);

class HTSLM2 extends ZigBeeDevice {
    async onNodeInit({ zclNode }) {
        this.homey.app.log('Started device initialization. Initializing node...', 'HT-SLM-2');
        this.settings = await this.getSettings();
        this.enableDebug();
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

        zclNode.endpoints[1].clusters.doorLock.on('attr.lockState', this._onReport.bind(this));
        zclNode.endpoints[1].clusters.doorLock.on('attr.soundVolume', this._onReport.bind(this));
        zclNode.endpoints[1].clusters.powerConfiguration.on('attr.batteryPercentageRemaining', this._onReport.bind(this));
        zclNode.endpoints[1].clusters.doorLock.on('event.operatingEventNotification', this._onOperatingEventNotification.bind(this));
        zclNode.endpoints[1].clusters.doorLock.on('event.programmingEventNotification', this._onProgrammingEventNotification.bind(this));

        await zclNode.endpoints[1].clusters[CLUSTER.DOOR_LOCK.NAME].getPinCode({
            userID: 5,
        }).then((res) => {
            this.homey.app.log('Received response for getPinCode command:', 'HT-SLM-2', 'DEBUG', {
                userID: res.userID,
                userStatus: res.userStatus,
                userType: res.userType,
                pinCode: res.pinCode.toString(),
            });
        }).catch(e => this.homey.app.log(e, 'HT-SLM-2', 'ERROR'));

        await this.initFlows();

        this.homey.app.log('HT-SLM-2 Node has been initialized', 'HT-SLM-2');
    }

    async initFlows() {
        const setUserPIn = this.homey.flow.getActionCard('setUserPin');
        setUserPIn.registerRunListener(async (args) => {
            await this.zclNode.endpoints[1].clusters.doorLock.setPinCode({
                userID: parseInt(args.userID) || args.userID,
                userStatus: parseInt(args.userStatus) || args.userStatus,
                userType: parseInt(args.userType) || args.userType,
                pinCode: Buffer.from(`${args.pinCode}`),
            }).then(() => {
                this.homey.app.log(`Added a new user with ID ${args.userID} and PIN ${args.pinCode}. (UserType: ${args.userType} | UserStatus: ${args.userStatus})`, 'HT-SLM-2');
            }).catch(e => this.homey.app.log('Failed to add a new user:', 'HT-SLM-2', 'ERROR', e));
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
            let soundVolume;
            switch (newSettings.soundVolume) {
                case 'off':
                    soundVolume = 0x00;
                    break;
                case 'low':
                    soundVolume = 0x01;
                    break;
                case 'high':
                    soundVolume = 0x02;
                    break;
                default:
                    break;
            }
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
        this.homey.app.log('HT-SLM-2 has been deleted', 'HT-SLM-2');
    }

    _onOperatingEventNotification(payload) {
        this.homey.app.log('Received an operating event notification:', 'HT-SLM-2', 'DEBUG', payload);
    }

    _onProgrammingEventNotification(payload) {
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
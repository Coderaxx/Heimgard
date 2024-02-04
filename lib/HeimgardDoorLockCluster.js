'use strict';

const { DoorLockCluster, ZCLDataTypes, Cluster } = require('zigbee-clusters');

class HeimgardDoorLockCluster extends DoorLockCluster {

    static get ATTRIBUTES() {
        return {
            ...super.ATTRIBUTES,
            lockState: {
                id: 0,
                type: ZCLDataTypes.enum8({
                    notFullyLocked: 0x00,
                    locked: 0x01,
                    unlocked: 0x02,
                    undefined: 0xFF,
                })
            },
            lockType: {
                id: 1,
                type: ZCLDataTypes.enum8({
                    deadBolt: 0x00,
                    magnetic: 0x01,
                    other: 0x02,
                    mortise: 0x03,
                    rim: 0x04,
                    latchBolt: 0x05,
                    cylindricalLock: 0x06,
                    tubularLock: 0x07,
                    interconnectedLock: 0x08,
                    deadLacth: 0x09,
                    doorFurniture: 0x0A,
                })
            },
            actuatorEnabled: { id: 2, type: ZCLDataTypes.bool },
            doorState: {
                id: 3,
                type: ZCLDataTypes.enum8({
                    open: 0x00,
                    closed: 0x01,
                    errorJammed: 0x02,
                    errorForcedOpen: 0x03,
                    errorUnspecified: 0x04,
                    undefined: 0xFF,
                })
            },
            doorOpenEvents: { id: 4, type: ZCLDataTypes.uint32 },
            doorClosedEvents: { id: 5, type: ZCLDataTypes.uint32 },
            openPeriod: { id: 16, type: ZCLDataTypes.uint16 },
            numberOfTotalUsersSupported: {
                id: 17, type: ZCLDataTypes.uint16
            },
            numberOfPINUsersSupported: {
                id: 18, type: ZCLDataTypes.uint16
            },
            numberOfRFIDUsersSupported: {
                id: 19, type: ZCLDataTypes.uint16
            },
            maxPINCodeLength: {
                id: 23, type: ZCLDataTypes.uint8
            },
            minPINCodeLength: {
                id: 24, type: ZCLDataTypes.uint8
            },
            maxRFIDCodeLength: {
                id: 25, type: ZCLDataTypes.uint8
            },
            minRFIDCodeLength: {
                id: 26, type: ZCLDataTypes.uint8
            },
            enableLogging: {
                id: 32, type: ZCLDataTypes.bool
            },
            language: {
                id: 33, type: ZCLDataTypes.string
            },
            autoRelockTime: {
                id: 35, type: ZCLDataTypes.uint32
            },
            soundVolume: {
                id: 36, type: ZCLDataTypes.uint8
            },
            enableLocalProgramming: {
                id: 40, type: ZCLDataTypes.bool
            },
            keypadOperationEventMask: {
                id: 65, type: ZCLDataTypes.map16(
                    'Unknown or manufacturer-specific keypad operation event',
                    'Lock, source: keypad',
                    'Unlock, source: keypad',
                    'Lock, source: keypad, error: invalid PIN',
                    'Lock, source: keypad, error: invalid schedule',
                    'Unlock, source: keypad, error: invalid code',
                    'Unlock, source: keypad, error: invalid schedule',
                    'Non-Access User operation event, source keypad.',
                )
            },
            rfOperationEventMask: {
                id: 66, type: ZCLDataTypes.map16(
                    'Unknown or manufacturer-specific RF operation event',
                    'Lock, source: RF',
                    'Unlock, source: RF',
                    'Lock, source: RF, error: invalid code',
                    'Lock, source: RF, error: invalid schedule',
                    'Unlock, source: RF, error: invalid code',
                    'Unlock, source: RF, error: invalid schedule',
                )
            },
            manualOperationEventMask: {
                id: 67, type: ZCLDataTypes.map16(
                    'Unknown or manufacturer-specific manual operation event',
                    'Thumbturn Lock',
                    'Thumbturn Unlock',
                    'One touch lock',
                    'Key Lock',
                    'Key Unlock',
                    'Auto lock',
                    'Schedule Lock',
                    'Schedule Unlock',
                    'Manual Lock (Key or Thumbturn)',
                    'Manual Unlock (Key or Thumbturn)',
                )
            },
            rfidOperationEventMask: {
                id: 68, type: ZCLDataTypes.map16(
                    'Unknown or manufacturer-specific keypad operation event',
                    'Lock, source: RFID',
                    'Unlock, source: RFID',
                    'Lock, source: RFID, error: invalid RFID ID',
                    'Lock, source: RFID, error: invalid schedule',
                    'Unlock, source: RFID, error: invalid RFID ID',
                    'Unlock, source: RFID, error: invalid schedule',
                )
            },
            keypadProgrammingEventMask: {
                id: 69, type: ZCLDataTypes.map16
            },
            rfProgrammingEventMask: {
                id: 70, type: ZCLDataTypes.map16
            },
        }
    }

    static get COMMANDS() {
        return {
            ...super.COMMANDS,
            lockDoor: { id: 0 },
            unlockDoor: { id: 1 },
            toggleDoor: { id: 2 },
            unlockWithTimeout: {
                id: 3,
                args: {
                    timeout: ZCLDataTypes.uint16
                }
            },
            getLogRecord: {
                id: 4,
                args: {
                    logIndex: ZCLDataTypes.uint16
                }
            },
            setPinCode: {
                id: 5,
                args: {
                    userID: ZCLDataTypes.uint16,
                    userStatus: ZCLDataTypes.uint8,
                    userType: ZCLDataTypes.enum8({
                        0: 'Unrestricted User',
                        1: 'Year Day Schedule User',
                        2: 'Week Day Schedule User',
                        3: 'Master User',
                        4: 'Non Access User',
                        0xff: 'Not Supported',
                    }),
                    pinCode: ZCLDataTypes.octstr,
                }
            },
            getPinCode: {
                id: 6,
                args: {
                    userID: ZCLDataTypes.uint16,
                }
            },
            clearPinCode: {
                id: 7,
                args: {
                    userID: ZCLDataTypes.uint16,
                }
            },
            clearAllPinCodes: { id: 8 },
            setUserStatus: {
                id: 9,
                args: {
                    userID: ZCLDataTypes.uint16,
                    userStatus: ZCLDataTypes.uint8,
                }
            },
            getUserStatus: {
                id: 10,
                args: {
                    userID: ZCLDataTypes.uint16,
                    userStatus: ZCLDataTypes.enum8({
                        0: 'Unrestricted User',
                        1: 'Year Day Schedule User',
                        2: 'Week Day Schedule User',
                        3: 'Master User',
                        4: 'Non Access User',
                        0xff: 'Not Supported',
                    })
                }
            },
            getUserType: {
                id: 21,
                args: {
                    userID: ZCLDataTypes.uint16,
                    userType: ZCLDataTypes.enum8({
                        0: 'Unrestricted User',
                        1: 'Year Day Schedule User',
                        2: 'Week Day Schedule User',
                        3: 'Master User',
                        4: 'Non Access User',
                        0xff: 'Not Supported',
                    }),
                }
            },
            setRFIDCode: {
                id: 22,
                args: {
                    userID: ZCLDataTypes.uint16,
                    userStatus: ZCLDataTypes.uint8,
                    userType: ZCLDataTypes.enum8({
                        0: 'Unrestricted User',
                        1: 'Year Day Schedule User',
                        2: 'Week Day Schedule User',
                        3: 'Master User',
                        4: 'Non Access User',
                        0xff: 'Not Supported',
                    }),
                    rfidCode: ZCLDataTypes.octstr,
                }
            },
            getRFIDCode: {
                id: 23,
                args: {
                    userID: ZCLDataTypes.uint16
                }
            },
            clearRFIDCode: {
                id: 24,
                args: {
                    userID: ZCLDataTypes.uint16
                }
            },
            clearAllRFIDCodes: { id: 25 },
            operatingEventNotification: {
                id: 32,
                direction: Cluster.DIRECTION_SERVER_TO_CLIENT,
                args: {
                    operationEventSource: ZCLDataTypes.uint8,
                    operationEventCode: ZCLDataTypes.uint8,
                    userID: ZCLDataTypes.uint16,
                    pinCode: ZCLDataTypes.uint8,
                    localTime: ZCLDataTypes.uint32,
                    data: ZCLDataTypes.string,
                }
            },
            programmingEventNotification: {
                id: 33,
                direction: Cluster.DIRECTION_SERVER_TO_CLIENT,
                args: {
                    programmingEventSource: ZCLDataTypes.uint8,
                    programmingEventCode: ZCLDataTypes.uint8,
                    userID: ZCLDataTypes.uint16,
                    pinCode: ZCLDataTypes.uint8,
                    userType: ZCLDataTypes.enum8({
                        0: 'Unrestricted User',
                        1: 'Year Day Schedule User',
                        2: 'Week Day Schedule User',
                        3: 'Master User',
                        4: 'Non Access User',
                        0xff: 'Not Supported',
                    }),
                    userStatus: ZCLDataTypes.uint8,
                    localTime: ZCLDataTypes.uint32,
                    data: ZCLDataTypes.string,
                }
            },
        }
    }

    async onOperatingEventNotification(payload) {
        if (payload && payload !== null) {
            payload = {
                operationEventSource: payload.operationEventSource,
                operationEventCode: payload.operationEventCode,
                userID: payload.userID,
                pinCode: payload.pinCode,
                localTime: payload.localTime,
                data: payload.data,
            };
            this.emit('event.operatingEventNotification', payload);
        }
    }

}

module.exports = HeimgardDoorLockCluster;
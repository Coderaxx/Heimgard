'use strict';

const { DoorLockCluster, ZCLDataTypes } = require('zigbee-clusters');

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
                id: 65, type: ZCLDataTypes.map16
            },
            rfOperationEventMask: {
                id: 66, type: ZCLDataTypes.map16
            },
            manualOperationEventMask: {
                id: 67, type: ZCLDataTypes.map16
            },
            rfidOperationEventMask: {
                id: 68, type: ZCLDataTypes.map16
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
                    userType: ZCLDataTypes.enum8,
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
                }
            },
            getUserType: {
                id: 21,
                args: {
                    userID: ZCLDataTypes.uint16,
                    userType: ZCLDataTypes.enum8
                }
            },
            setRFIDCode: {
                id: 22,
                args: {
                    userID: ZCLDataTypes.uint16,
                    userStatus: ZCLDataTypes.uint8,
                    userType: ZCLDataTypes.enum8,
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
            test1: { id: 29 },
            test2: { id: 30 },
            OperatingEventNotification: {
                id: 32,
                args: {
                    operationEventSource: ZCLDataTypes.uint8,
                    operationEventCode: ZCLDataTypes.uint8,
                    userID: ZCLDataTypes.uint16,
                    pinCode: ZCLDataTypes.octstr,
                    localTime: ZCLDataTypes.uint32,
                    data: ZCLDataTypes.string,
                }
            },
            ProgrammingEventNotification: {
                id: 33,
                args: {
                    programmingEventSource: ZCLDataTypes.uint8,
                    programmingEventCode: ZCLDataTypes.uint8,
                    userID: ZCLDataTypes.uint16,
                    pinCode: ZCLDataTypes.octstr,
                    userType: ZCLDataTypes.enum8,
                    userStatus: ZCLDataTypes.uint8,
                    localTime: ZCLDataTypes.uint32,
                    data: ZCLDataTypes.string,
                }
            },
        }
    }

}

module.exports = HeimgardDoorLockCluster;
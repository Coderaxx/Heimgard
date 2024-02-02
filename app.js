'use strict';

const Homey = require('homey');

class Heimgard extends Homey.App {
    async onInit() {
        this.log('Heimgard has been initialized');
    }

    async log(message, instance = 'Heimgard', severity = 'DEBUG', data = null) {
        const now = new Date();

        let datestring = now.toLocaleDateString('nb-NO', {
            dateStyle: 'short',
            timeZone: 'Europe/Oslo'
        });
        let timestring = now.toLocaleTimeString('nb-NO', {
            timeStyle: 'medium',
            timeZone: 'Europe/Oslo'
        });

        let debugDateString = `${datestring} ${timestring}`;
        datestring = `${datestring} - ${timestring}`;

        const debugLog = this.homey.settings.get('debugLog') || [];
        const entry = { registered: debugDateString, severity, message };

        switch (severity) {
            case 'DEBUG':
                severity = '\x1b[36mDEBUG\x1b[0m';
                break;
            case 'WARNING':
                severity = '\x1b[33mWARNING\x1b[0m';
                break;
            case 'ERROR':
                severity = '\x1b[31mERROR\x1b[0m';
                break;
            default:
                severity = '\x1b[36mDEBUG\x1b[0m';
                break;
        }

        const logMessage = `${datestring} [${instance}] [${severity}] ${message}`;

        if (data) {
            console.log(logMessage, data || '');

            if (typeof data === 'string') {
                entry.data = { data };
            } else if (data.message) {
                entry.data = { error: data.message, stacktrace: data.stack };
            } else {
                entry.data = data;
            }
        } else {
            console.log(logMessage || '');
        }

        debugLog.push(entry);
        if (debugLog.length > 100) {
            debugLog.splice(0, 1);
        }
        this.homey.settings.set('debugLog', debugLog);
        this.homey.api.realtime('debugLog', entry);
    }

}

module.exports = Heimgard;

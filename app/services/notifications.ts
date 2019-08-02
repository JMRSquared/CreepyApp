import permissions from "nativescript-permissions";
const ad = require("tns-core-modules/utils/utils").ad;
const context = ad.getApplicationContext();

export default class Notification {
    constructor(){
        this.jobService();
        this.scheduleJob(context);
        this.onNotificationRecieved();
    }

    requestPermission(){
        return new Promise((resolve,reject) => {
            permissions.requestPermission("android.permission.BIND_NOTIFICATION_LISTENER_SERVICE", "I need these permissions because I'm cool")
            .then(() => {
                resolve(true);
                console.log("Woo Hoo, I have the power!");
            })
            .catch(() => {
                resolve(false);
                console.log("Uh oh, no permissions - plan B time!");
            });
        });
    }

    scheduleJob(context) {
        // Create a component from the JobService that should be triggered
        let component = new android.content.ComponentName(context, com.tns.notifications.MyJobService.class);
        console.log(component)
    
        // Set the id of the job to something meaningful for you
        const builder = new android.app.job.JobInfo.Builder(1, component);
    
        // Optional: Set how often the task should be triggered. The minimum is 15min.
        builder.setPeriodic(15 * 60 * 1000);
        
        // persist this job across device reboots.
        builder.setPersisted(true);

        // runs only when device is connected to 
        // builder.setRequiredNetwork(android.app.job.JobInfo.NETWORK_TYPE_ANY);
        
        // Optional: Set additional requirements under what conditions your job should be triggered
        // builder.setRequiresCharging(false);
    
        const jobScheduler = context.getSystemService(android.content.Context.JOB_SCHEDULER_SERVICE);
        console.log("Job Scheduled: " + jobScheduler.schedule(builder.build()));
    }

    onNotificationRecieved(){
        const tt = android.service.notification.NotificationListenerService.class.getMethods();
        console.log("Methods",tt);
        android.service.notification.NotificationListenerService.extend("com.jmrsquared.creepy.NotificationListener", {
            onNotificationPosted: (sbn) => {
                const title = 'Message from ' + sbn.getPackageName().toLowerCase();
                let body = [];
                if(sbn.getNotification().extras){
                    if ((android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N)){
                        const extraMessages = sbn.getNotification().extras.get(android.app.Notification.EXTRA_MESSAGES);
                        if(extraMessages){
                            for(let i=0;i<extraMessages.length;i++){
                                body.push(extraMessages[i].getString("text"));
                            }
                        }else{
                            body.push('----------------');
                            console.log("---- WE DO NOT HAVE EXTRA MESSAGES");
                        }
                    }else{  
                        body.push(sbn.getNotification().extras.getCharSequence(android.app.Notification.EXTRA_TEXT).toString());
                        body.push(sbn.getNotification().extras.getCharSequence(android.app.Notification.EXTRA_TITLE).toString());
                    }
                }else{
                    body.push("######################")
                    console.log("WE DO NOT HAVE EXTRAS");
                }
                if(sbn.getPackageName().toLowerCase().indexOf('whatsapp') >= 0){

                }
                body.forEach(b => {
                    this.sendPushNotification(title,b);
                });
            },
            onCreate: () => {
                console.log("Created");
            },
            onStart: (Intent, Int32) => {
                console.log("On start");
            },
            onDestroy:() =>{
                console.log("On destroy the process")
            }
        });
    }

    sendPushNotification(title,body){
        // Do something useful here, fetch data and show notification for example
        const builder = new android.app.Notification.Builder(context);
        builder.setContentTitle(title)
            .setAutoCancel(true)
            .setColor(android.R.color.holo_purple)//getResources().getColor(R.color.colorAccent))
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

        // The id of the channel.
        const channelId = "my_channel_01";
        // The user-visible name of the channel.
        const name = "Channel name";
        // The user-visible description of the channel.
        const description = "Channel description";
        const importance = android.app.NotificationManager.IMPORTANCE_LOW;
        const mChannel = new android.app.NotificationChannel(channelId, name,importance);
        // Configure the notification channel.
        mChannel.setDescription(description);
        mChannel.enableLights(true);
        // Sets the notification light color for notifications posted to this
        // channel, if the device supports this feature.
        mChannel.setLightColor(android.graphics.Color.RED);
        mChannel.enableVibration(true);
        mNotificationManager.createNotificationChannel(mChannel);

        builder.setChannelId(channelId);

        mNotificationManager.notify(1, builder.build());
    }

    jobService() {
        android.app.job.JobService.extend("com.tns.notifications.MyJobService", {
            onStartJob: function(params) {       
                console.log("Job execution ...");

                // Do something useful here, fetch data and show notification for example
                const builder = new android.app.Notification.Builder(context);
                builder.setContentTitle("Scheduled Notification")
                    .setAutoCancel(true)
                    .setColor(android.R.color.holo_purple)//getResources().getColor(R.color.colorAccent))
                    .setContentText("This notification has been triggered by Notification Service")
                    .setVibrate([100, 200, 100])
                    .setSmallIcon(android.R.drawable.btn_star_big_on);
            
                // will open main NativeScript activity when the notification is pressed
                const mainIntent = new android.content.Intent(context, com.tns.NativeScriptActivity.class); 
                
                // example for custom intent passing custom data via the broadcast receiver
                let intent = new android.content.Intent("customservice");
                var broadcastManager = androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(ad.getApplicationContext());
                broadcastManager.sendBroadcast(intent);

                const mNotificationManager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);

                // The id of the channel.
                const channelId = "my_channel_01";
                // The user-visible name of the channel.
                const name = "Channel name";
                // The user-visible description of the channel.
                const description = "Channel description";
                const importance = android.app.NotificationManager.IMPORTANCE_LOW;
                const mChannel = new android.app.NotificationChannel(channelId, name,importance);
                // Configure the notification channel.
                mChannel.setDescription(description);
                mChannel.enableLights(true);
                // Sets the notification light color for notifications posted to this
                // channel, if the device supports this feature.
                mChannel.setLightColor(android.graphics.Color.RED);
                mChannel.enableVibration(true);
                mNotificationManager.createNotificationChannel(mChannel);

                builder.setChannelId(channelId);

                mNotificationManager.notify(1, builder.build());

                return false;
            },
            
            onStopJob: function() {
                console.log("Stopping job ...");
            }
        });
    }
    
    hasPermission(){
        return permissions.hasPermission("android.permission.BIND_NOTIFICATION_LISTENER_SERVICE")
    }
}
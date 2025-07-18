package com.cogniphi.services;

// Referred : https://harunwangereka.medium.com/android-background-services-b5aac6be3f04
// Referred : https://github.com/wangerekaharun/AndroidBackgroundSevices/tree/master

import android.app.Activity;
import android.app.IntentService;
import android.content.Intent;
import android.util.Log;
import androidx.annotation.Nullable;

public class BackgroundIntentService extends IntentService {
    public static final String ACTION = "com.cogniphi.receivers.ResponseBroadcastReceiver";
    // Must create a default constructor
    public BackgroundIntentService() {
        // Used to name the worker thread, important only for debugging.
        super("BackgroundIntentService");
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        // This describes what will happen when service is triggered
        Log.i("BackgroundIntentService", "Service running");
        // create a broadcast to send the toast message
        String toastMessage = "Trip In progress";
        Intent toastIntent = new Intent(ACTION);
        toastIntent.putExtra("resultCode", Activity.RESULT_OK);
        toastIntent.putExtra("toastMessage", toastMessage);
        sendBroadcast(toastIntent);
    }
}
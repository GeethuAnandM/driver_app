package com.cogniphi.receivers;

// Referred : https://harunwangereka.medium.com/android-background-services-b5aac6be3f04
// Referred : https://github.com/wangerekaharun/AndroidBackgroundSevices/tree/master

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.cogniphi.services.BackgroundIntentService;

public class ToastBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Intent serviceIntent = new Intent(context, BackgroundIntentService.class);
        context.startService(serviceIntent);
    }
}

package com.cogniphi;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.cogniphi.services.LocationUpdateService;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import javax.annotation.Nullable;

public class ReactNativeCallBack extends ReactContextBaseJavaModule {
    ReactApplicationContext context;
    public static final String TAG = "com.cogniphi.driver";
    public ReactNativeCallBack(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "ReactNativeCallBack";
    }

    // call from javascript layer
    @ReactMethod
    public void startService(double tripId, double driverId,double vehicleId, Callback callBack){
        try {
            callBack.invoke("invoked from android native module");

            MainActivity.tripId = (long)tripId;
            MainActivity.driverId = (long)driverId;
            MainActivity.vehicleId = (long)vehicleId;

            if (LocationUpdateService.IS_RUNNING){
                return;
            }
            // Intent serviceIntent = new Intent(context, LocationUpdateService.class);
            // serviceIntent.setAction("Start");
            // context.startService(serviceIntent);
        }
        catch(Exception e){
            Log.e(TAG, "error starting service: " + e.getMessage());

            callBack.invoke("error invoked from android native module");
        }
    }

    @ReactMethod
    public void stopService(){
        MainActivity.tripId = 0;
        MainActivity.driverId = 0;
          MainActivity.vehicleId = 0;

        if (!LocationUpdateService.IS_RUNNING){
            return;
        }
        Log.e(TAG, "stopping background service ");
        Intent serviceIntent = new Intent(context, LocationUpdateService.class);
        serviceIntent.setAction("Stop");
        context.stopService(serviceIntent);
    }
}

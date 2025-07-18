package com.cogniphi.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import com.cogniphi.MainActivity;
import com.cogniphi.sqllite.tbl_packet_dataDao;
import com.cogniphi.sqllite.tbl_packet_dataDatabase;
import com.cogniphi.sqllite.tbl_packet_dataModel;
import com.facebook.react.HeadlessJsTaskService;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.Granularity;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.Priority;
import com.cogniphi.receivers.ResponseBroadcastReceiver;
import com.cogniphi.receivers.ToastBroadcastReceiver;
import com.google.android.gms.location.SettingsClient;

import android.content.IntentFilter;
import android.app.AlarmManager;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import java.text.SimpleDateFormat;

public class LocationUpdateService extends HeadlessJsTaskService {

    public static final String CHANNEL_ID = "DriverChannel";
    private static final String TAG = "com.cogniphi.driver";
    private FusedLocationProviderClient client;
    private LocationRequest locationRequest;
    private static final int NOTIFICATION_ID = 12345678;
    public static boolean IS_RUNNING = false;
    private ResponseBroadcastReceiver broadcastReceiver;
    private int alarmIntervalInSeconds = 10 * 1000;
    private tbl_packet_dataDatabase db;
    private tbl_packet_dataDao dao;
    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    @Override
    public void onCreate() {
        super.onCreate();

        db= tbl_packet_dataDatabase.getInstance(this);
        dao=db.tbl_packet_dataDao();

        broadcastReceiver = new ResponseBroadcastReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BackgroundIntentService.ACTION);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            registerReceiver(broadcastReceiver, intentFilter, Context.RECEIVER_NOT_EXPORTED);
            scheduleAlarm();
        }
        else{updateNotification("🚨Support "+Build.VERSION_CODES.O+" to 33");}

        try {
            Log.e(TAG, "let's get this location ");
            client = LocationServices.getFusedLocationProviderClient(this);
            createLocationRequest();
            LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder();
            builder.addLocationRequest(locationRequest);
            LocationSettingsRequest locationSettingsRequest = builder.build();
            SettingsClient settingsClient = LocationServices.getSettingsClient(this);
            settingsClient.checkLocationSettings(locationSettingsRequest);
            client.requestLocationUpdates(locationRequest, new LocationCallback() {
                @Override
                public void onLocationResult(@NonNull LocationResult locationResult) {
                    saveGPS(locationResult.getLastLocation());
                }
            },
            Looper.myLooper());
        } catch (SecurityException unlikely) {
            Log.e(TAG, "Lost location permission. Could not request updates. " + unlikely);
        }
    }

    private void createLocationRequest() {
        long IntervalMillis=1 * 1000; // 40Km/h=11.11meters/second so its good to check each second that "Is New GPS Data is Above 10 Meters"
        long MaxUpdateDelayMillis=2 * 1000; // Batch Call i.e Even Interval is 1 seconds , Still next 2 consecutive will be taken as One Batch
        locationRequest = new LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, IntervalMillis)
                .setWaitForAccurateLocation(true)
                .setMinUpdateDistanceMeters(10)
                .setMaxUpdateDelayMillis(MaxUpdateDelayMillis)
                .setGranularity(Granularity.GRANULARITY_PERMISSION_LEVEL)
                .build();
    }

    private void scheduleAlarm() {
        try {
            Intent toastIntent = new Intent(getApplicationContext(), ToastBroadcastReceiver.class);
            PendingIntent toastAlarmIntent = PendingIntent.getBroadcast(
                    getApplicationContext(),
                    0,
                    toastIntent,
                    PendingIntent.FLAG_IMMUTABLE);
            long startTime = System.currentTimeMillis(); // alarm starts immediately
            AlarmManager alarmManager = (AlarmManager) this.getSystemService(Context.ALARM_SERVICE);

            alarmManager.setInexactRepeating(
                    AlarmManager.RTC_WAKEUP,
                    startTime,
                    alarmIntervalInSeconds,
                    toastAlarmIntent);

        } catch (Exception ex) {
            Log.e(TAG, "🚨ALM_EX01:" + ex.getMessage());
            updateNotification("🚨ALM_EX01:"+ex.getMessage());
        }
    }
    private void saveGPS(Location newLocation) {
        try {
            if (newLocation != null) {
                tbl_packet_dataModel model=new tbl_packet_dataModel();
                model.latitude=newLocation.getLatitude();
                model.longitude=newLocation.getLongitude();
                model.packet_time=newLocation.getTime();
                model.speed=newLocation.getSpeed() * 3.6;
                model.battery_voltage= ((BatteryManager)getApplicationContext().getSystemService(BATTERY_SERVICE))
                        .getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
                model.is_send=0;
                dao.insert(model);
                if(InternetIsConnected()){
                    sendLocationToServer();
                }
            }
        } catch (Exception ex) {
            Log.e(TAG, "🚨SAV_EX01:" + ex.getMessage());
            updateNotification("🚨SAV_EX01"+ex.getMessage());
        }
    }
    public boolean InternetIsConnected() {
        try {
            String command = "ping -c 1 google.com";
            return (Runtime.getRuntime().exec(command).waitFor() == 0);
        } catch (Exception e) {
            return false;
        }
    }

    private void sendLocationToServer() {
        try {
            //String sendLocationToServerAPI="http://3.108.230.88:11028"; //Environment:Production
           // String sendLocationToServerAPI="http://52.66.95.69:11028"; //Environment:Development
               String sendLocationToServerAPI="http://13.233.175.113:11028"; //Environment:Qa
            ApiService apiService = RetrofitClient.getClient(sendLocationToServerAPI).create(ApiService.class);
            dao=db.tbl_packet_dataDao();
            List<tbl_packet_dataModel> items= dao.getListToSend();
            final int size = items.size();
            for (int i = 0; i < size; i++)
            {
                tbl_packet_dataModel model = items.get(i);
                Call<Void> call = apiService.sendLocation(
                        Settings.Secure.ANDROID_ID,
                        model.latitude,
                        model.longitude,
                        model.packet_time,
                        MainActivity.driverId,
                        model.speed,
                        model.battery_voltage,
                        MainActivity.tripId,
                        MainActivity.vehicleId);

                call.enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                        if (response.isSuccessful()) {
                            model.is_send=1;
                            dao.update(model);
                            dao.deleteAllSend();
                            updateNotification(dateFormat.format(model.packet_time));
                        } else {
                            model.is_send=0;
                            dao.update(model);
                            updateNotification("🚨SND_RSP_01");
                        }
                    }
                    @Override
                    public void onFailure(@NonNull Call<Void> call, Throwable t) {
                        model.is_send=0;
                        dao.update(model);
                        updateNotification("🚨SND_RSP_02:"+t.getMessage());
                    }
                });
            }
        } catch (Exception ex) {
            updateNotification("🚨SND_RSP_EX_01:"+ex.getMessage());
        }
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if(intent.getAction().equals("Start")){
            createNotificationChannel();
            startForeground(NOTIFICATION_ID, getNotification("0 - Not Started"));
            IS_RUNNING = true;
        }
        else if(intent.getAction().equals("Stop")){
            Log.i(TAG, "Received Stop Foreground Intent");
            unregisterReceiver(broadcastReceiver);
            dao=db.tbl_packet_dataDao();
            dao.deleteAll();
            // end service code
            stopForeground(true);
            stopSelfResult(startId);
            IS_RUNNING = false;
        }

        return START_NOT_STICKY;
    }

    private Notification getNotification(String message) {
        String inputs = "Location Updates " + message;
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);
        Intent stopServiceIntent = new Intent(this, LocationUpdateService.class);
        stopServiceIntent.setAction("Stop");
        PendingIntent stopServicePendingIntent = PendingIntent.getService(this, 0, stopServiceIntent, PendingIntent.FLAG_IMMUTABLE);


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return new Notification.Builder(this)
                    .setContentTitle("Driver")
                    .setContentText(inputs)
                    .setAutoCancel(true)
                    .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                    .setContentIntent(pendingIntent)
                    .setPriority(Notification.PRIORITY_HIGH)
                    .setWhen(System.currentTimeMillis())
                    .setOnlyAlertOnce(true)
                    .setChannelId(CHANNEL_ID)
                    .build();
        }
        else{
            return new Notification.Builder(this)
                    .setContentTitle("Driver")
                    .setContentText(inputs)
                    .setAutoCancel(true)
                    .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                    .setContentIntent(pendingIntent)
                    .setPriority(Notification.PRIORITY_HIGH)
                    .setWhen(System.currentTimeMillis())
                    .setOnlyAlertOnce(true)
                    .build();
        }
    }

    private void updateNotification(String message) {

        Notification notification = getNotification(message);

        NotificationManager mNotificationManager = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            mNotificationManager.notify(NOTIFICATION_ID, notification);
        }
    }

    private void createNotificationChannel() {
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Driver Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }
}
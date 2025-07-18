package com.cogniphi.sqllite;

import android.content.Context;
import android.os.AsyncTask;
import androidx.annotation.NonNull;
import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;
import androidx.sqlite.db.SupportSQLiteDatabase;

@Database(entities = {tbl_packet_dataModel.class}, version = 1, exportSchema = false)
public abstract class tbl_packet_dataDatabase extends RoomDatabase {

    private static tbl_packet_dataDatabase instance;

    public abstract tbl_packet_dataDao tbl_packet_dataDao();

    public static synchronized tbl_packet_dataDatabase getInstance(Context context) {
        if (instance == null) {
            instance =
                    Room.databaseBuilder(context.getApplicationContext(),tbl_packet_dataDatabase.class, "itac")
                    .allowMainThreadQueries()
                    .fallbackToDestructiveMigration()
                    .addCallback(roomCallback)
                    .build();
        }
        return instance;
    }
    private static RoomDatabase.Callback roomCallback = new RoomDatabase.Callback() {
        @Override
        public void onCreate(@NonNull SupportSQLiteDatabase db) {
            super.onCreate(db);
            new PopulateDbAsyncTask(instance).execute();
        }
    };
    private static class PopulateDbAsyncTask extends AsyncTask<Void, Void, Void> {
        PopulateDbAsyncTask(tbl_packet_dataDatabase instance) {
            tbl_packet_dataDao dao = instance.tbl_packet_dataDao();
        }
        @Override
        protected Void doInBackground(Void... voids) {
            return null;
        }
    }
}
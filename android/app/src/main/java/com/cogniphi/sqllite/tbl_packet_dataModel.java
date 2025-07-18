package com.cogniphi.sqllite;

import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "tbl_packet_data")
public class tbl_packet_dataModel {

    // PrimaryKey auto increment
    @PrimaryKey(autoGenerate = true)
    public int data_id;
    @ColumnInfo(name = "latitude")
    public double latitude;
    @ColumnInfo(name = "longitude")
    public double longitude;
    @ColumnInfo(name = "packet_time")
    public long packet_time;
    @ColumnInfo(name = "speed")
    public double speed;
    @ColumnInfo(name = "battery_voltage")
    public int battery_voltage;
    @ColumnInfo(name = "is_send")
    public int is_send;
}
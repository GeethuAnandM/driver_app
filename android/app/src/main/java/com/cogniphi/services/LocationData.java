package com.cogniphi.services;

public class LocationData {

    private double latitude;
    private double longitude;
    private Long timestamp;
    private Long driverId;
    private double speed;
    private double batteryPercentage;
    private String uuid;

    public LocationData(double latitude, double longitude, Long timestamp, Long driverId, double speed, double batteryPercentage, String uuid) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
        this.driverId = driverId;
        this.speed = speed;
        this.batteryPercentage = batteryPercentage;
        this.uuid = uuid;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    @Override
    public String toString() {
        return "LocationData{" +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                ", timestamp='" + timestamp + '\'' +
                ", driverId='" + driverId + '\'' +
                '}';
    }
}

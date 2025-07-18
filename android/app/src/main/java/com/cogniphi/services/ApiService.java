package com.cogniphi.services;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface ApiService {
    @GET("api/endpoint") // replace with your endpoint
     Call<Void> sendLocation(@Query("id") String uuid, @Query("lat") double latitude, @Query("lon") double longitude, @Query("timestamp") Long timestamp, @Query("driverId") Long driverId, @Query("speed") double speed, @Query("batt") double batteryPercentage, @Query("tripId") Long tripId,@Query("vehicleId") Long vehicleId);
}

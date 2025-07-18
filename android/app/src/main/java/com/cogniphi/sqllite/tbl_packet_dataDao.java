package com.cogniphi.sqllite;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;
import java.util.List;

@Dao
public interface tbl_packet_dataDao {
    @Query("SELECT * FROM tbl_packet_data WHERE is_send=0 order by data_id asc")
    List<tbl_packet_dataModel> getListToSend();

    @Insert
    public void insert(tbl_packet_dataModel model);

    @Update
    public void update(tbl_packet_dataModel model);

    @Delete
    public void delete(tbl_packet_dataModel model);

    @Query("DELETE FROM tbl_packet_data WHERE is_send=1")
    public void deleteAllSend();

    @Query("DELETE FROM tbl_packet_data")
    public void deleteAll();
}

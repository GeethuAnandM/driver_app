import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from "react-native";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useTheme } from "@react-navigation/native";
import { moderateScale, scale } from "react-native-size-matters";
import Text_Custom from "../../Text_Custom";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { markNoteAsRead } from "../../../Services/Actions/AuthActions";
import { tripStore } from "../../../Store/AuthStore/TripStore";

const NotesContainer = ({ notes, title }) => {
  const { colors, dark } = useTheme();
  const acknowledgeHintAnim = useRef(new Animated.Value(1)).current;

  const noteType = title === "Trip Notes" ? "Trip Note" : "Driver Note";
  const showAcknowledgment = noteType === "Trip Note";

  const filteredNotes = useMemo(() => {
    return notes?.filter(note => note.noteType === noteType) || [];
  }, [notes, noteType]);

  const [readNotes, setReadNotes] = useState([]);

  const pulseAnims = useRef(filteredNotes.map(() => new Animated.Value(1))).current;
  var tripStatus=tripStore.selectedTrip.status

  useEffect(() => {
    if (showAcknowledgment && filteredNotes.length > 0) {
      const initiallyRead = filteredNotes
        .map((note, index) => (note.isRead ? index : null))
        .filter(i => i !== null);
      setReadNotes(initiallyRead);
    } else {
      setReadNotes([]);
    }
  }, [filteredNotes, showAcknowledgment]);

  useEffect(() => {
    if (showAcknowledgment && filteredNotes.length > 0) {
      filteredNotes.forEach((_, index) => {
        if (!readNotes.includes(index)) {
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnims[index], {
                toValue: 1.2,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnims[index], {
                toValue: 1,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          ).start();
        } else {
          pulseAnims[index].setValue(1);
        }
      });
    }
  }, [filteredNotes.length, readNotes, showAcknowledgment]);

  const markAsRead = async (index) => {
    if (!readNotes.includes(index)) {
      try {
        await markNoteAsRead(tripStore.selectedTrip.tripId);
        setReadNotes(prev => [...prev, index]);
        pulseAnims[index].stopAnimation();
        pulseAnims[index].setValue(1);
      } catch (error) {
        console.error("Failed to mark note as read:", error);
      }
    }
  };

  const styles = StyleSheet.create({
    noteTitle: {
      fontSize: scale(16),
      textTransform: "capitalize",
      fontFamily: "NunitoSans-Bold",
      marginBottom: moderateScale(10),
    },
    detailCard: {
      backgroundColor: colors.SecondaryBackground,
      padding: moderateScale(10),
      borderRadius: scale(10),
      borderColor: colors.cardBorder,
      borderWidth: 1,
      marginBottom: moderateScale(15),
    },
    sectionHeader: {
      flexDirection: "row",  // Align items in a row
      justifyContent: "space-between", // Space between the title and the right-aligned content
      alignItems: "center",  // Align items vertically in the center
      marginBottom: moderateScale(5),
    },
    sectionTitle: {
      color: colors.primary1,
      fontWeight: "700",
      fontSize: scale(12),
    },
    acknowledgeHint: {
      color: "red",
      fontSize: scale(12),
      marginTop: moderateScale(5),
      fontWeight: 'bold',
    },
    notesContainer: { marginVertical: moderateScale(10) },
    noteTitleContainer: {
      paddingVertical: moderateScale(10),
      borderBottomColor: dark ? "#2B2B2B" : "#E9EFF3",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
    },
    noteContent: {
      flex: 1,
      paddingRight: moderateScale(10),
    },
    emptyText: {
      textAlign: "center",
      color: colors.text,
      paddingVertical: moderateScale(10),
    },
    acknowledgeIndicator: {
      flexDirection: "row",
      alignItems: "center",
      maxWidth: "70%",
    },
    acknowledgeText: {
      color: 'red',
      marginLeft: scale(5),
      fontSize: scale(12),
      fontWeight: 'bold',
    },
  });

  const allNotesRead = filteredNotes.length > 0 && filteredNotes.every((_, index) => readNotes.includes(index));

  return (
    <View style={styles.detailCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
  
        {showAcknowledgment && filteredNotes.length > 0 && !allNotesRead && !(tripStatus === "Cancelled" || tripStatus === "Completed") && (
          <Animated.View
            style={[styles.acknowledgeIndicator, { transform: [{ scale: acknowledgeHintAnim }] }]}
          >
            <Text style={styles.acknowledgeText}>
              Tap <MaterialCommunityIcons name="checkbox-marked-outline" size={16} color="red" /> to acknowledge
            </Text>
          </Animated.View>
        )}
      </View>
  
      {filteredNotes.length === 0 ? (
        <Text style={styles.emptyText}>No {title} available</Text>
      ) : (
        <View style={styles.notesContainer}>
          {filteredNotes.map((item, index) => {
            const isRead = readNotes.includes(index);
  
            return (
              <View
                key={item.note + item?.noteTitle}
                style={[
                  styles.noteTitleContainer,
                  { borderBottomWidth: index !== filteredNotes.length - 1 ? 1 : 0 },
                ]}
              >
                <View style={styles.noteContent}>
                  {item?.noteTitle && (
                    <Text_Custom text={item?.noteTitle} style={styles.noteTitle} />
                  )}
                  <Text_Custom text={item.note} />
                </View>
  
                {showAcknowledgment && (
                  <TouchableOpacity
                    onPress={() => markAsRead(index)}
                    disabled={isRead}
                  >
                    <Animated.View style={{ transform: [{ scale: pulseAnims[index] }] }}>
                      {(isRead || tripStatus !== "Cancelled") && (
                        <MaterialCommunityIcons
                          name={isRead ? "check-circle" : "checkbox-marked-outline"}
                          size={24}
                          color={isRead ? "green" : "red"}
                        />
                      )}
                    </Animated.View>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
  
};

export default NotesContainer;

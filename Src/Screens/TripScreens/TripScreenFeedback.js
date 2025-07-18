import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { observer } from "mobx-react";
import { AirbnbRating } from "react-native-ratings";
import {Submit_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import { Button } from "react-native-paper";
import {
  createCompleteTrip,
  postFeedback,
} from "../../Services/Actions/TripActions";
import { tripStore } from "../../Store/AuthStore/TripStore";
import {
  showError,
  showSuccess,
} from "../../Utils/helper";
import { feedbackStore } from "../../Store/AuthStore/FeedbackStore";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import {
  moderateScale,
} from "react-native-size-matters";
import { useNavigation, useTheme } from "@react-navigation/native";
const TripScreenFeedback = () => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  // const [selectedColor, setSelectedColor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState(feedbackStore.EndFeedback.review);
  const [rating, setRating] = useState(0);

  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    if (feedbackStore.EndFeedback.verified === true) {
      setIsDisable(true);
    }
  }, []);

  const handleReview = (text) => {
    if (!isDisable) {
      setReview(text);
    }
  };

  useEffect(() => {
    console.log("review comments ", review);
  }, [review]);

  const { driverId, tripId, customerId } = tripStore.selectedTrip;

  const [selectedFeedback, setSelectedFeedback] = useState(
    feedbackStore.EndFeedback.feedback
  );

  const handleFeedbackSelection = (feedback) => {
    if (!isDisable) {
      setSelectedFeedback((prevFeedback) => {
        const currentFeedback = prevFeedback || [];
        if (currentFeedback.includes(feedback)) {
          // If the feedback is already selected, remove it from the selectedFeedback array
          // imageStore.setEndFeedback(true);
          //imageStore.setEndFeedbackSelected(selectedFeedback)
          return currentFeedback.filter((item) => item !== feedback);
        } else {
          // imageStore.setEndFeedback(true);
          //imageStore.setEndFeedbackSelected(selectedFeedback)
          // If the feedback is not selected, add it to the selectedFeedback array
          return [...currentFeedback, feedback];
        }
      });
    }
  };

  const customerFeedbackValidation =
    tripStore.selectedTrip.customerFeedbackValidation;

    const handleSubmit = async () => {
    if (!isDisable) {
      //const feedbackString = selectedFeedback.join(',');
      const feedbackString = selectedFeedback ? selectedFeedback.join(",") : "";

      // imageStore.setEndFeedbackSelected(selectedFeedback)
      // imageStore.setEndFeedbackReview(review);
      // console.log("review  from imagestore in feedback",imageStore.EndFeedback.review)
      // console.log("feedback array from imagestore in feedback",imageStore.EndFeedback.feedback)
      const requestBody = {
        driverId: driverId,
        tripId: tripId,
        rating: rating,
        comments: review,
        feedback: feedbackString,
        createdBy: driverId,
        customerId: customerId,
      };

      const rateFeedback = async (requestBody) => {
        try {
          const response = await postFeedback(requestBody);
          console.log("response from postFeedback:", response); // Log the response
        } catch (error) {
          console.error("API error from feedback:", error);
        }
      };

      // Call rateFeedback with the correct requestBody
      //rateFeedback(requestBody);
     
      feedbackStore.setEndFeedbackSelected(feedbackString);
      feedbackStore.setEndFeedbackReview(review);  
      feedbackStore.setEndRating( rating.toString());  
      feedbackStore.setEndFeedback(true);
      showSuccess("feedback submitted");
      setLoading(true);
      tripStore.setCurrentTripStartTime(Date.now());
      await createCompleteTrip("feedback").then(async (res) => {
        //console.log("res from feedback ",res)
        if (res.status) {
          feedbackStore.resetEndFeedback();
          setLoading(false);
           loaderStore.setIsLoading(false);
     
            //showSuccess("Trip completed");
            //navigation.goBack();
          
            navigation.navigate("Listing", {
              screen: "TripDetailsScreen",
              params: { trip: tripStore.selectedTrip },
              
            });
        
        } else {
          setLoading(false);
          loaderStore.setIsLoading(false);
          Alert.alert("Somethig wents wrong!", res.message);
          // setModalVisible(!modalVisible);
        }
      });
      showSuccess("Feedback submitted");
      feedbackStore. resetEndFeedback();
     // navigation.goBack();
      
    } else {
      showError("feedback already submitted");
    }
  };

  const skip = () => {
    console.log("customerFeedbackvalidation", customerFeedbackValidation);
    //navigation.navigate(screen);
    navigation.goBack();
  };
  const moveNext = () => {
    console.log("feedback");
  };
  const MyRatingComponent = () => {
    // const handleRating = (rating) => {
    //   console.log('Selected rating:', rating);
    // };
    console.log("rating");
  };

  const handleReset = () => {
    setSelectedFeedback(null);
  };

  const handleRating = (selectedRating) => {
    if (!isDisable) {
      // Toggle the selection if the same star is clicked again
      console.log("rate", selectedRating);
      setRating(selectedRating);
      //feedbackStore.setEndRating(selectedRating);
      

      // const newRating = selectedRating === rating ? 0 : selectedRating;
      // setRating(newRating);
    } else {
      showError("rating already given");
    }
  };

  const styles = StyleSheet.create({
    main_container: {
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScale(20),
      flex: 1,
    },
    reviewInput: {
   
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 5,
      height: 80,
      fontWeight: "bold",
      color: "black",
      textAlignVertical: "top",
      marginHorizontal: moderateScale(5),
      marginTop:moderateScale(10),
    },

    placeholderTextColor: {
      color: "gray", // You can choose a color for the placeholder text
    },
    // image: {
    //   alignSelf: "center",
    //   marginTop: 10,
    //   width: 100,
    //   height: 100,
    // },
    heading: {
      textAlign: "center",
      fontSize: 24,
      fontWeight: "bold",
      color: "#00008B",
    },
    feedback: {
      //marginVertical: moderateScale(),
      
    },
    labelcontainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginTop: 10,
    },
    button: {
      width: "48%",
      marginVertical: 5,
      // backgroundColor: colors.primary1,
      backgroundColor: colors.lightBlue,
      //backgroundColor: "#00008B",
      borderRadius: 50,
    },
    buttonLabel: {
      fontSize: 16,
      // color: "#fff",
      color: colors.primary1,
      fontWeight: "bold",
    },
    selectedButtonLabel: {
      fontWeight: "bold",
      color: "#fff",
    },
    submitbutton: {
      width: "48%",
      marginVertical: 5,
      backgroundColor: colors.primary1,
      //backgroundColor: "#00008B",
      borderRadius: 50,
      marginLeft: moderateScale(100),
    },
    selectedButton: {
      //backgroundColor: "#808080",
      backgroundColor: colors.primary1,
      //color: "#fff",
      // Green color for selected buttons
    },
    imageContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      width: 100, // Adjust the width and height for your desired circle size
      height: 100,
      //marginLeft: 150, // Adjust the margin as needed
      borderRadius: 50, // Half of the width and height to create a circle
      overflow: "hidden", // Ensure the image is clipped to the circle
      marginLeft: moderateScale(100),
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover", // Adjust this based on your image requirements
    },

    submitbuttonLabel: {
      fontSize: 16,
      color: "#fff",
      fontWeight: "bold",
    },
  });

  return (
    
    <View style={styles.main_container}>

      <CommonHeader title="Rate Your Customer" goBack />
      
      <ScrollView
        contentContainerStyle={{
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScale(20),
          // flex: 1,
          justifyContent: "space-between",
          paddingBottom: moderateScale(20),
        }}
      >
      
      {/* <Text style={styles.heading}>Rate Your Customer</Text> */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://itac-dev-files.s3.ap-south-1.amazonaws.com/pro1684751556489.png",
          }}
          style={styles.image}
        />
      </View>
      {/* <SVG.userIcon />  */}
      <Text
        style={{
          fontSize: 20,
          marginLeft: moderateScale(10),
          textAlign: "center",
          color: "black",
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        {tripStore.selectedTrip.customerData?.name}
      </Text>

      <View style={styles.feedback}>
        
        <AirbnbRating
          count={5}
          reviews={[
            <Text style={{ fontSize: 20, color: "grey" }}>Bad</Text>,
            <Text style={{ fontSize: 20, color: "grey" }}>Poor</Text>,
            <Text style={{ fontSize: 20, color: "grey" }}>Fair</Text>,
            <Text style={{ fontSize: 20, color: "grey" }}>Good</Text>,
            <Text style={{ fontSize: 20, color: "grey" }}>Excellent</Text>,
          ]}
          defaultRating={feedbackStore.EndFeedback.rating}
          size={30}
          showRating
          onFinishRating={handleRating}
        />

        {/* <Text
          style={{
            fontSize: 16,
            color: "grey",
            marginLeft: moderateScale(120),
            fontWeight: "bold",
          }}
        >
          Leave a feedback
        </Text> */}

        <View style={styles.labelcontainer}>
          <Button
            mode="contained"
            onPress={() => handleFeedbackSelection("Rude")}
            style={[
              styles.button,
              selectedFeedback &&
                selectedFeedback.includes("Rude") &&
                styles.selectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedFeedback &&
                selectedFeedback.includes("Rude") &&
                styles.selectedButtonLabel,
            ]}
          >
            Rude
          </Button>
          <Button
            mode="contained"
            onPress={() => handleFeedbackSelection("Friendly")}
            style={[
              styles.button,
              selectedFeedback &&
                selectedFeedback.includes("Friendly") &&
                styles.selectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedFeedback &&
                selectedFeedback.includes("Friendly") &&
                styles.selectedButtonLabel,
            ]}
          >
            Friendly
          </Button>

          <Button
            mode="contained"
            onPress={() => handleFeedbackSelection("OnTime")}
            style={[
              styles.button,
              selectedFeedback &&
                selectedFeedback.includes("OnTime") &&
                styles.selectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedFeedback &&
                selectedFeedback.includes("OnTime") &&
                styles.selectedButtonLabel,
            ]}
          >
            OnTime
          </Button>

          <Button
            mode="contained"
            onPress={() => handleFeedbackSelection("Talkative")}
            style={[
              styles.button,
              selectedFeedback &&
                selectedFeedback.includes("Talkative") &&
                styles.selectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedFeedback &&
                selectedFeedback.includes("Talkative") &&
                styles.selectedButtonLabel,
            ]}
          >
            Talkative
          </Button>
          <Button
            mode="contained"
            onPress={() => handleFeedbackSelection("Delayed")}
            style={[
              styles.button,
              selectedFeedback &&
                selectedFeedback.includes("Delayed") &&
                styles.selectedButton,
            ]}
            labelStyle={[
              styles.buttonLabel,
              selectedFeedback &&
                selectedFeedback.includes("Delayed") &&
                styles.selectedButtonLabel,
            ]}
          >
            Delayed
          </Button>
        </View>
        <View>
      
             
            <TextInput
              style={styles.reviewInput}
              placeholder="Type your feedback here"
              onChangeText={(text) => handleReview(text)}
              multiline
              value={review}
              placeholderTextColor={styles.placeholderTextColor.color}
              keyboardType="url" 
            />
            {/* Additional content goes here */}
         
        </View>

        <Submit_Button
          text={"Submit"}
          disable={Loading}
          disabled={Loading}
          style={{  width: "48%",
          marginVertical: 5,
          backgroundColor: colors.primary1,
          //backgroundColor: "#00008B",
          borderRadius: 50,
          marginLeft: moderateScale(50)}} 
          onPress={() => {
            if (!rating && feedbackStore.EndFeedback.rating =="") {
              alert("Please provide a star rating before submitting.");
            } else {
              handleSubmit();
            }
          }}/>

        

        {/* {!customerFeedbackValidation && (
          <TouchableOpacity
            style={{ marginTop: moderateScale(20) }}
            onPress={() => skip()}
          >
            <Text_Custom
              text={"Skip"}
              style={{
                fontSize: scale(14),
                color: colors.primary1,
                fontFamily: "NunitoSans-Bold",
                marginLeft: moderateScale(160),
              }}
            />
          </TouchableOpacity>
        )} */}
      </View>
      </ScrollView>
    </View>
  );
};
export default observer(TripScreenFeedback);

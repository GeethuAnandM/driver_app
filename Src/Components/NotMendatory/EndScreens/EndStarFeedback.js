import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import CommonHeader from "../../CommonHeader/CommonHeader";

import { Gradient_Button, Submit_Button } from "../../Button/Button";

import { Button } from "react-native-paper";
import {
  postFeedback
} from "../../../Services/Actions/TripActions";

import { tripStore } from "../../../Store/AuthStore/TripStore";

//import { tripStore } from "../../Store/AuthStore/TripStore";
import { useNavigation, useTheme } from "@react-navigation/native";
import {
  moderateScale,
  scale
} from "react-native-size-matters";
import Text_Custom from "../../../Components/Text_Custom";
import { imageStore } from "../../../Store/AuthStore/ImageStore";
import { showError, showSuccess } from "../../../Utils/helper";
const EndStarFeedback = (props) => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  // const [selectedColor, setSelectedColor] = useState(null);
  const [fetchData, setFetchData] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState(imageStore.EndFeedback.review);
  const [rating, setRating] = useState(0);
 
 
  const {
   
    customerFeedbackValidation,
  } = tripStore.selectedTrip;

  const handleReview = (text) => {
    if (!imageStore.EndFeedback.verified === true) {
      setReview(text);
    }
  };

  useEffect(() => {
    console.log("review comments ", review);
  }, [review]);

  const { driverId, tripId, customerId } = tripStore.selectedTrip;

  const [selectedFeedback, setSelectedFeedback] = useState(
    imageStore.EndFeedback.feedback
  );

  const handleFeedbackSelection = (feedback) => {
    if (!imageStore.EndFeedback.verified === true) {
      setSelectedFeedback((prevFeedback) => {
        const currentFeedback = prevFeedback || [];
        if (currentFeedback.includes(feedback)) {
       
          return currentFeedback.filter((item) => item !== feedback);
        } else {
         
          return [...currentFeedback, feedback];
        }
      });
    }
  };



  const handleSubmit = (screen) => {
    if (!imageStore.EndFeedback.verified === true) {
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
      imageStore.setEndFeedbackSelected(feedbackString);
      imageStore.setEndFeedbackReview(review);
      imageStore.setEndFeedback(true);
      imageStore.setEndRating(rating.toString());
      //console.log("imageStore.EndFeedback.verified",imageStore.EndFeedback.verified)
      //feedbackStore.setEndFeedback(true);
      showSuccess("Feedback submitted");
      navigation.navigate(screen);
    } else {
      
      showError("feedback already submitted");
    }
  };

  const skip = () => {
   
      navigation.navigate("AddDocFinish");
     

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
    if (!imageStore.EndFeedback.verified === true) {
      // Toggle the selection if the same star is clicked again
      console.log("rate", selectedRating);
      setRating(selectedRating);
      //imageStore.setEndRating(selectedRating);
    

      // const newRating = selectedRating === rating ? 0 : selectedRating;
      // setRating(newRating);
    } else {
      showError("rating already given");
    }
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1, // Make the ScrollView take up the entire available space
    },
    content: {
      padding: 16, // Add padding to the content to ensure it's not too close to the edges
    },
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
          defaultRating={imageStore.EndFeedback.rating}
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
        >y
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
        
         
            <TextInput
              style={styles.reviewInput}
              placeholder="Type your feedback here"
              onChangeText={(text) => handleReview(text)}
              multiline
              value={review}
              placeholderTextColor={styles.placeholderTextColor.color}
              keyboardType="url"
              editable={!imageStore.EndFeedback.verified}
            />
            {/* Additional content goes here */}
         
     
{!imageStore.EndFeedback.EndFeedbackValidated &&

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
            
            if (!rating && imageStore.EndFeedback.rating =="") {
              alert("Please provide a star rating before submitting.");
            } else {
              imageStore.setEndFeedbackValidated(true);
              handleSubmit("AddDocFinish");
            }
          }}/>
        }



{imageStore.EndFeedback.EndFeedbackValidated === true && (
  <Gradient_Button
    text="Next"
    onPress={() => navigation.navigate("AddDocFinish")}
  />
)}
      
          
      {!customerFeedbackValidation && !imageStore.EndFeedback.EndFeedbackValidated && (
  <TouchableOpacity
    style={{ marginTop: moderateScale(10) }}
    onPress={() => skip()}
  >
    <Text_Custom
      text={"Skip"}
      style={{
        fontSize: scale(14),
        color: colors.primary1,
        fontFamily: "NunitoSans-Bold",
        marginLeft: moderateScale(135),
      }}
    />
  </TouchableOpacity>
)}

      </View>
      </ScrollView>
    </View>
 
   
  );
};
export default observer(EndStarFeedback);

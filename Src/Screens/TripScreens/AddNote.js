import { useTheme } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { moderateScale, scale } from "react-native-size-matters";
import { Gradient_Button } from "../../Components/Button/Button";
import CommonHeader from "../../Components/CommonHeader/CommonHeader";
import Container from "../../Components/Container/Container";
import Loader from "../../Components/Loader/Loader";
import TextInput_custom from "../../Components/TextInput_custom";
import Text_Custom from "../../Components/Text_Custom";
import { addNote } from "../../Services/Actions/TripActions";
import { Formik } from "formik";
import * as yup from "yup";
import { loaderStore } from "../../Store/AuthStore/LoaderStore";
import { showSuccess } from "../../Utils/helper";
import { tripStore } from "../../Store/AuthStore/TripStore";
const AddNote = (props) => {
  const { colors } = useTheme();
  const [height, setHeight] = useState(0);
  const Cancel = () =>
    props.navigation.navigate("TripDetailsScreen", {
      trip: { tripId: props.route.params.tripID },
    });
  const [note, setNote] = React.useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [Loading, setLoading] = useState(false);
  const tripId=tripStore.selectedTrip.tripId;
  const saveNote = async (values) => {
    await addNote(values.description, values.title,tripId).then((res) => {
      if (res.status) {
        showSuccess("Note Added");
        setNote("");
        setLoading(false);
        Cancel();
        loaderStore.setIsLoading(false);
      }
    });
  };
  const notesValidationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  });
  return (
    <Container>
      <Loader isLoadingProps={Loading} />
      <CommonHeader goBack={true} title={"Trip Details"} moveTo={Cancel} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: moderateScale(50) }}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: colors.SecondaryBackground,
          borderRadius: 10,
          borderColor: colors.cardBorder,
          borderWidth: 1,
          margin: moderateScale(20),
          paddingHorizontal: moderateScale(12),
          paddingVertical: moderateScale(20),
        }}
      >
        <Formik
          enableReinitialize={true}
          validationSchema={notesValidationSchema}
          initialValues={{ title: "", description: "" }}
          onSubmit={(values) => {
            setLoading(true);
            saveNote(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <>
              <Text_Custom
                text="Title"
                style={{
                  fontSize: scale(16),
                  fontFamily: "NunitoSans-Bold",
                  marginVertical: moderateScale(15),
                }}
              />
              <TextInput_custom
                placeholder="Enter Title"
                // onChangeText={(e) => setNoteTitle(e)}
                onChangeText={handleChange("title")}
                value={values.title}
                ERROR_MSG={{
                  show: touched.title ? errors.title : "",
                  msg: touched.title ? errors.title : "",
                }}
                onBlur={handleBlur("title")}
              />
              <Text_Custom
                text="Description"
                style={{ fontSize: scale(16), fontFamily: "NunitoSans-Bold" }}
              />
              <TextInput_custom
                placeholder="Enter Description"
                // onChangeText={(e) => setNoteTitle(e)}
                onChangeText={handleChange("description")}
                value={values.description}
                ERROR_MSG={{
                  show: touched.description ? errors.description : "",
                  msg: touched.description ? errors.description : "",
                }}
                onBlur={handleBlur("description")}
                containerStyles={{
                  paddingTop: 10,
                }}
                textInputStyles={{
                  height: Math.max(20, height + 20),
                }}
                inputProps={{
                  numberOfLines: 10,
                  maxLength: 255,
                  returnKeyType: "done",
                  keyboardType: "web-search",
                  multiline: true,
                  onContentSizeChange: (event) => {
                    setHeight(event.nativeEvent.contentSize.height);
                  },
                }}
              />
              
              <Gradient_Button
                onPress={handleSubmit}
                text="Save"
                disabled={Loading}
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </Container>
  );
};
export default observer(AddNote);
const styles = StyleSheet.create({});

import { getItem } from "../Services/apiCalls";
import { authStore } from "../Store/AuthStore/AuthStore";
// const EMAIL_REGEX =
//   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const EMAIL_REGEX =
  /^(([^<>()[\]{}\\'.,&^`|?*$~/=%+!;_#:-\s@"]+(\.[^<>()[\]{}\\.,;_#:-\s@"]+)*(\-[^<>()[\]{}\\.,;_#:-\s@"]+)*(\_[^<>()[\]{}\\.,;_#:-\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASS_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,1000}$/;
//const PASS_PHONE = /^[0-9]{10}$/;
export const PASS_PHONE = /^[0-9]{10}$/;

///^[0-9]{10}$/.test(value);
export const VALIDATE_TYPE = "username";
const amount_REGEX = /^[0-9]*[1-9][0-9]*$/;
export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email);
};
export const validateAmount = (amount) => {
  return amount_REGEX.test(amount);
};
export const validatePass = (password) => {
  return PASS_REGEX.test(password);
};
export const validatePhone = (phone) => {
  return PASS_PHONE.test(phone);
};
export const isNumeric = (value) => {
  return /^-?\d+$/.test(value);
};

export const isRegisteredUser = async (value) => {
  const registeredPhone = await getItem("registeredPhone");
  const registeredEmail = await getItem("registeredEmail");
console.log("value from isRegistered",value)
  if (value === registeredPhone || value === registeredEmail) {
      console.log("registeredPhone:", registeredPhone);
      console.log("registeredEmail:", registeredEmail);
      return true;
  }

  return false; // Ensure a boolean return value if there's no match
};

export const findDriver = () => {
  var driverData = authStore.driverData;
  if (driverData?.licenseExpirationDate?.trim() == "") {
    return false;
  } else if (driverData?.licenseNumber?.trim() == "") {
    return false;
  } else if (driverData?.licensePath == "" || driverData?.licensePath == null) {
    return false;
  } else {
    return true;
  }
};
export const EXPENSE_VALIDATION_STRING = "No special characters are allowed";

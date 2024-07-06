import { ToastAndroid } from "react-native";

export const validateAndRegister = (ownerName, mobileNo, email, password, confirmPassword, storeName, city, address, province) => {
    // Validate ownerName
    console.log("ownerName ==>",ownerName)
    if (!/^[a-zA-Z ]+$/.test(ownerName) || !/[a-zA-Z]/.test(ownerName)) {
        ToastAndroid.show('Owner Name should contain at least one alphabet character and not consist of only spaces.', ToastAndroid.LONG);
        return;
    }

    // Validate mobileNo
    console.log("mobileNo ==>",mobileNo)
    const mobileNoRegex = /^[0-9]{10,13}$/;
    if (!mobileNoRegex.test(mobileNo)) {
        ToastAndroid.show('Mobile Number. should be 10 to 13 digits.', ToastAndroid.LONG);
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        ToastAndroid.show('Please enter a valid email address.', ToastAndroid.LONG);
        return;
    }

    // Validate password
    if (password.length < 6) {
        ToastAndroid.show('Password should be at least 6 characters long.', ToastAndroid.LONG);
        return;
    }

    // Validate confirm password
    if (confirmPassword && password !== confirmPassword) {
        ToastAndroid.show('Passwords do not match.', ToastAndroid.LONG);
        return;
    }
    if (!confirmPassword) {
        ToastAndroid.show('Please Enter The Confirm Password.', ToastAndroid.LONG);
        return;
    }
    // Validate storeName, city, and address
    if (!/^[a-zA-Z ]+$/.test(storeName) || !/[a-zA-Z]/.test(storeName)) {
        ToastAndroid.show('Store Name is required.', ToastAndroid.LONG);
        return;
    }
    console.log("city=> ",city,"subDistrict=> ",address,"province=> ",province)
    if (!city) {
        ToastAndroid.show('City is required.' + city, ToastAndroid.LONG);
        return;
    }
    if (!address) {
        ToastAndroid.show('Sub District is required.', ToastAndroid.LONG);
        return;
    }
    if (!province) {
        ToastAndroid.show('Province is required.', ToastAndroid.LONG);
        return;
    }
   
    return "isValid";
};

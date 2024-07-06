import React, { useEffect } from "react";
import { View } from "react-native";
import Globals from "./Globals";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

export const Banner = async (bannerTypeName) => {
    const apiUrl = `${Globals.baseUrl}/Banner`;
    const response = await axios.get(apiUrl);

    if (response.data.isSuccess) {
        const banner = response.data.payload.find(banner => banner.bannerTypeName === bannerTypeName);

        if (banner) {
            return banner.imageUrl;
        }
    }

}
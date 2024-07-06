import { createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const initialState = {
    data: []
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProduct(state, action) {
            return {
                ...state,
                data: action.payload
            }
        }
    }
});

const storeList = [
    {
        id: 0,
        storeName: "Amul",
        price: 1200,
        stock: 10
    },
    {
        id: 1,
        storeName: "Gowardhan",
        price: 1100,
        stock: 2
    },
    {
        id: 2,
        storeName: "Prabhat ",
        price: 1600,
        stock: 3
    },
]
export const fecthProducts = () => async (dispatch) => {
    try {
        //fetch logic
        // const response = axios.get('/api');
        dispatch(productActions.setProduct(response.data));
    }
    catch (ex) {
        console.log({ ex })
    }
}

export const productActions = productSlice.actions;
export const productReducers = productSlice.reducer;
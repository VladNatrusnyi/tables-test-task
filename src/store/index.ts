import {combineReducers, configureStore} from "@reduxjs/toolkit"
import authSlice from "./authSlice";
import tableSlice from "./tableSlice";
import filterSlice from "./filterSlice";

const rootReducer = combineReducers({
    auth: authSlice
})
export const store = configureStore({
    reducer: {
        auth: authSlice,
        table: tableSlice,
        filter: filterSlice
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

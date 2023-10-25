import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit'
import apiDB from "../apiDB";
import {LogInFormValues} from "../Models/LogIn";

export const LogInUser = createAsyncThunk<boolean, LogInFormValues, { rejectValue: string }>(
    "auth/LogInUser",
    async (body, thunkAPI) => {
        try {
            const responseData = await apiDB.post("/login/", JSON.stringify(body));
            console.log('ssss', responseData)
            return !!responseData.data

        } catch (error) {
            return thunkAPI.rejectWithValue('Invalid credentials.');
        }
    }
);

interface InitialState {
    isLoggedIn: boolean,
    loading: boolean;
    error: string | null;
}

const initialState: InitialState  = {
    isLoggedIn: false,
    loading: false,
    error: null,
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(LogInUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LogInUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = action.payload;
            })
            .addCase(LogInUser.rejected, (state, action) => {
                state.loading = false;
                console.log('err', action)
                state.error = action.payload || 'Something went wrong';
            });
    }
})

export const {
    setIsLoggedIn
} = authSlice.actions
export default authSlice.reducer

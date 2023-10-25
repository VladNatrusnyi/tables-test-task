import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit'
import apiDB from "../apiDB";
import {Limit, TableItem} from "../Models/Table";
import {FilterData} from "../Models/Filter";
import { setCount, setTableItems} from "./tableSlice";

export const getFilteredTable = createAsyncThunk<{count: number, items: TableItem[]}, {limit: Limit, page: number, paramStr: string}, { rejectValue: string }>(
    "filter/getFilteredTable",
    async ({limit, page, paramStr}, thunkAPI) => {
        try {

            console.log('path', paramStr)
            const responseData = await apiDB.get(`/table/?${paramStr}&limit=${limit}&offset=${(page - 1) * limit}`);
            thunkAPI.dispatch(setCount(responseData.data.count));
            thunkAPI.dispatch(setTableItems(responseData.data.results));

            return {
                count: responseData.data.count,
                items: responseData.data.results
            }

        } catch (error) {
            return thunkAPI.rejectWithValue('Error filtering table data');
        }
    }
);


interface InitialTablesState {
    filterData: FilterData;
    filterLoading: boolean;
    filterError: string | null;
}

const initialState: InitialTablesState  = {
    filterData: {
        name: '',
        email: '',
        address: '',
        birthday_date: '',
        phone_number: '',
    },
    filterLoading: false,
    filterError: null,
}


const filterSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setFilterData: (state, action: PayloadAction<FilterData>) => {
            state.filterData = {
                ...state.filterData,
                ...action.payload,
            };
        },
        clearFilterData: (state) => {
            state.filterData = {
                name: '',
                email: '',
                address: '',
                birthday_date: '',
                phone_number: '',
            };
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getFilteredTable.pending, (state) => {
                state.filterLoading = true;
                state.filterError = null;
            })
            .addCase(getFilteredTable.fulfilled, (state, action) => {
                state.filterLoading = false;
            })
            .addCase(getFilteredTable.rejected, (state, action) => {
                state.filterLoading = false;
                state.filterError = action.payload || 'Something went wrong';
            })
    }
})

export const {
    setFilterData,
    clearFilterData
} = filterSlice.actions
export default filterSlice.reducer

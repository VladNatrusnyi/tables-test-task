import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit'
import apiDB, {BASE_URL} from "../apiDB";
import {Limit, TableItem} from "../Models/Table";

export const getTable = createAsyncThunk<{count: number, items: TableItem[]}, {limit: Limit, page: number}, { rejectValue: string }>(
    "table/getTable",
    async ({limit, page}, thunkAPI) => {
        try {
            const responseData = await apiDB.get(`/table/?limit=${limit}&offset=${(page - 1) * limit}`);
            return {
                count: responseData.data.count,
                items: responseData.data.results
            }

        } catch (error) {
            return thunkAPI.rejectWithValue('Error loading table data');
        }
    }
);


export const updateTable = createAsyncThunk<{data:TableItem, currentId: number}, {id: number, body: TableItem}, { rejectValue: string }>(
    "table/updateTable",
    async ({id, body}, thunkAPI) => {
        //here I used fetch, because with the help of axios it did not update the data correctly
        try {
            const response = await fetch(BASE_URL + `/table/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const responseData = await response.json();
            return {
                data: responseData,
                currentId: id
            }

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error || 'Error updating table data');
        }
    }
);



interface InitialTablesState {
    limit: Limit;
    currentPage: number;
    count: number;
    tableItems: TableItem[],
    loading: boolean;
    error: string | null;
    updateLoading: boolean;
    updateError: string | null;
}

const initialState: InitialTablesState  = {
    limit: 5,
    count: 0,
    currentPage: 0,
    tableItems: [],
    loading: false,
    error: null,

    updateLoading: false,
    updateError: null,
}


const tableSlice = createSlice({
    name: 'table',
    initialState,
    reducers: {
        setTableItems: (state, action: PayloadAction<TableItem[]>) => {
            state.tableItems = action.payload
        },
        setLimit: (state, action: PayloadAction<Limit>) => {
            state.limit = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getTable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTable.fulfilled, (state, action) => {
                state.loading = false;
                state.tableItems = action.payload.items
                state.count = action.payload.count
            })
            .addCase(getTable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Something went wrong';
            })

            .addCase(updateTable.pending, (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
            })
            .addCase(updateTable.fulfilled, (state, action) => {
                state.updateLoading = false;

                const updatedEl = action.payload.data;
                const currentId = action.payload.currentId;

                if (Array.isArray(updatedEl.email) && updatedEl.email[0]) {
                    state.updateError = updatedEl.email[0];
                } else {
                    state.tableItems = state.tableItems.map(obj => (obj.id === currentId ? {...updatedEl, id: currentId} : obj))
                }

            })
            .addCase(updateTable.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload || 'Something went wrong';
            });
    }
})

export const {
    setTableItems,
    setLimit,
    setCurrentPage,
    setCount
} = tableSlice.actions
export default tableSlice.reducer

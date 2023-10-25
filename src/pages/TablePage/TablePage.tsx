import React, {FC, useEffect} from "react";
import {UserTable} from "../../components/UsersTable/UsersTable";
import {useAppDispatch, useAppSelector} from "../../helpers/redux-hook";
import {getTable, setCurrentPage, setLimit} from "../../store/tableSlice";
import {Button} from "antd";
import { useSearchParams} from "react-router-dom";
import {SearchParam} from "../../Models/Table";


export const TablePage: FC = () => {
    const dispatch = useAppDispatch()
    const {
        tableItems,
        loading,
        error
    } = useAppSelector(state => state.table)

    const [searchParams] = useSearchParams();

    const pageLimit: SearchParam = searchParams.get('limit');
    const pageNumber: SearchParam  = searchParams.get('page');


    useEffect(() => {
        dispatch(getTable({limit: 5, page: 0}))
    },[])


    useEffect(() => {

        if (pageLimit && pageNumber) {
            dispatch(setCurrentPage(+pageNumber))
            dispatch(setLimit(+pageLimit))
            dispatch(getTable({limit: +pageLimit, page: +pageNumber } ))
        }
    }, [pageLimit, pageNumber])

    const loadFirstPageOfData = () => dispatch(getTable({limit: 5, page: 0}))



    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>
              error: {error}
              <br/>
              Click to reload the data
              <Button onClick={loadFirstPageOfData} block>Get Data</Button>
            </div>}
            { tableItems.length ?  <UserTable /> : <div>No table data found</div>}

        </div>
    )
}

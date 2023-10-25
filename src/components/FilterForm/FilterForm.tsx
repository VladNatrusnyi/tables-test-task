import {FC, useState} from "react";
import {Button, Form, Input, Space, Spin} from "antd";
import {FilterData} from "../../Models/Filter";
import {useAppDispatch, useAppSelector} from "../../helpers/redux-hook";
import {clearFilterData, getFilteredTable, setFilterData} from "../../store/filterSlice";
import {setCurrentPage, setLimit} from "../../store/tableSlice";
import {useSearchParams} from "react-router-dom";
import {Limit, SearchParam} from "../../Models/Table";
import {convertDateToYYYYMMDD} from "../../helpers/formatDate";
import {generateQueryString, hasFilledField} from "../../helpers/filterHelpers";

type ValidationRule = {
    required?: boolean;
    message: string;
    whitespace?: boolean;
    min?: number;
    type?: 'email';
    pattern?: RegExp;
};

type ValidationRules = {
    [key: string]: ValidationRule[];
};

type FilterInput = {
    label: string;
    validationRules: ValidationRule[];
    name: string;
};


const filterInputs: FilterInput[] = [
    {
        label: 'Name contains:',
        validationRules: [
            { whitespace: true, message: 'Field should not contain whitespaces' },
            { min: 1, message: 'Field should contain more than one character' },
        ],
        name: 'name'
    },
    {
        label: 'Email contains:',
        validationRules: [
            { whitespace: true, message: 'Field should not contain whitespaces' },
            { min: 1, message: 'Field should contain more than one character' },
        ],
        name: 'email'
    },
    {
        label: 'Phone number contains:',
        validationRules: [
            { whitespace: true, message: 'Field should not contain whitespaces' },
            { min: 1, message: 'Field should contain more than one character' },
        ],
        name: 'phone_number'
    },
    {
        label: 'Birthday date:',
        validationRules: [
            { whitespace: true, message: 'Field should not contain whitespaces' },
            { pattern: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{2}$/, message: 'Please enter a date in the format "dd-mm-yy"' },
        ],
        name: 'birthday_date'
    },
    {
        label: 'Address contains:',
        validationRules: [
            { whitespace: true, message: 'Field should not contain whitespaces' },
            { min: 1, message: 'Field should contain more than one character' },
        ],
        name: 'address'
    },

]

export const FilterForm: FC = () => {
    const dispatch = useAppDispatch();

    const [searchParams, setSearchParams] = useSearchParams();

    const updatePageParams = (page: number, limit: Limit) => {
        searchParams.set('page', page.toString());
        searchParams.set('limit', limit.toString());
        setSearchParams(searchParams);
        dispatch(setLimit(limit))
        dispatch(setCurrentPage(page))
    };

    const pageLimit: SearchParam = searchParams.get('limit');
    const pageNumber: SearchParam  = searchParams.get('page');

    const {
        limit
    } = useAppSelector(state => state.table)

    const {
        filterData,
        filterLoading,
        filterError
    } = useAppSelector(state => state.filter);

    const onFinish = (values: FilterData) => {
        console.log('Received values of form: ', values);
        if (pageLimit && pageNumber) {
            dispatch(getFilteredTable(
                {
                    limit: limit,
                    page: 1,
                    paramStr: generateQueryString(
                        {...values, birthday_date: values.birthday_date
                                ? convertDateToYYYYMMDD(values.birthday_date)
                                : ''
                        })}))
        }

    };

    const onFieldsChange = (changedValues: FilterData, allValues: FilterData) => {
        dispatch(setFilterData(allValues))
        console.log('Змінені значення:', changedValues);
        console.log('Всі значення форми:', allValues);
    };

    const [form] = Form.useForm();
    const [filterData2, setFilterData2] = useState<FilterData>(filterData);

    const clear = () =>  {
        form.resetFields();
        dispatch(clearFilterData())
        setFilterData2({
            name: '',
            email: '',
            address: '',
            birthday_date: '',
            phone_number: '',
        });
        updatePageParams(1, 5)
    }


    return(
        <>
            <Form
                form={form}
                name="filters"
                className="filters"
                initialValues = {filterData2}
                onFinish={onFinish}
                layout={'vertical'}
                size={'middle'}
                onValuesChange={onFieldsChange}
            >
                {
                    filterInputs.map(input => {
                        return (
                            <Form.Item
                                label={input.name}
                                name={input.name}
                                rules={input.validationRules}
                            >
                                <Input placeholder={input.label} />
                            </Form.Item>
                        )
                    })
                }
                <Form.Item>
                    <Space wrap>
                        <Button disabled={!hasFilledField(filterData)} type="primary" htmlType="submit" className="login-form-button">
                            Filter out
                        </Button>
                        <Button onClick={clear} type="default"  className="login-form-button">
                            Clear
                        </Button>
                        {filterLoading && <Spin size="large" />}
                        {filterError && <div style = {{color: 'red'}}>Error: {filterError}</div>}
                    </Space>
                </Form.Item>
            </Form>
        </>

    )
}

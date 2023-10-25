import React, {useEffect, useState} from 'react';
import {Alert, Form, Input, InputNumber, Popconfirm, Table, Typography, message} from 'antd';
import {Limit, TableItem} from "../../Models/Table";
import {useAppDispatch, useAppSelector} from "../../helpers/redux-hook";
import {setCurrentPage, setLimit, setTableItems, updateTable} from "../../store/tableSlice";
import {useSearchParams} from "react-router-dom";

import {convertDateToYYYYMMDD, convertTextToDate} from "../../helpers/formatDate";

type MessageStatus ='success' | 'error' | 'warning'
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: TableItem;
    index: number;
    children: React.ReactNode;
}

type ValidationRule = {
    required?: boolean; // Зробити поле необов'язковим
    message: string;
    whitespace?: boolean;
    min?: number;
    type?: 'email';
    pattern?: RegExp;
};

type ValidationRules = {
    [key: string]: ValidationRule[];
};

const validationRules: ValidationRules = {
    name: [
        { required: true, message: 'This field is required' },
        { whitespace: true, message: 'Field should not contain whitespaces' },
        { min: 2, message: 'Field should contain more than one character' },
    ],
    email: [
        { required: true, message: 'This field is required' },
        { whitespace: true, message: 'Field should not contain whitespaces' },
        { type: 'email', message: 'Please enter a valid email address' },
    ],
    birthday_date: [
        { required: true, message: 'This field is required' },
        { whitespace: true, message: 'Field should not contain whitespaces' },
        { pattern: /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{2}$/, message: 'Please enter a date in the format "dd-mm-yy"' },
    ],
    phone_number: [
        { required: true, message: 'This field is required' },
        { whitespace: true, message: 'Field should not contain whitespaces' },
        { pattern: /^\+\d+$/, message: 'Please enter a valid phone number in the format (+ Country code and phone number)'},
    ],
    address: [
        { required: true, message: 'This field is required' },
        { whitespace: true, message: 'Field should not contain whitespaces' },
        { min: 2, message: 'Field should contain more than one character' },
    ]
}

const EditableCell: React.FC<EditableCellProps> = (
    {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={validationRules[dataIndex]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export const UserTable: React.FC = () => {
    const dispatch = useAppDispatch()
    const {
        limit,
        count,
        tableItems,
        updateLoading,
        updateError,
        currentPage
    } = useAppSelector(state => state.table)

//set params
    const [searchParams, setSearchParams] = useSearchParams();
    const updatePageParams = (page: number, limit: Limit) => {
        searchParams.set('page', page.toString());
        searchParams.set('limit', limit.toString());
        setSearchParams(searchParams);
        dispatch(setLimit(limit))
        dispatch(setCurrentPage(page))
    };


    const [messageApi, contextHolder] = message.useMessage();

    const showMessage = (type: MessageStatus, content: string ) => {
        messageApi.open({
            type,
            content,
        });
    }

    useEffect(() => {
        if (updateError) {
            setEditingKey(null);
            showMessage('error', updateError);
        }
    }, [updateError])


    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number|null>(null);

    const isEditing = (record: TableItem) => record.id === editingKey;

    const edit = (record: Partial<TableItem> & { id: React.Key }) => {
        form.setFieldsValue({ name: '', email: '', birthday_date: '', phone_number: '',address: '', ...record });
        setEditingKey(record.id);
    };


    const cancel = (page: number, pageSize: Limit) => {
        updatePageParams(page,pageSize)

        setEditingKey(null);
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as TableItem;

            const newData = [...tableItems];
            const index = newData.findIndex((TableItem) => key === TableItem.id);
            if (index > -1) {
                const TableItem = newData[index];
                newData.splice(index, 1, {
                    ...TableItem,
                    ...row,
                });

                console.log('ROE', row)

                dispatch(updateTable({id: TableItem.id, body: {...row, birthday_date: convertDateToYYYYMMDD(row.birthday_date)}}))

                setEditingKey(null);
            } else {
                newData.push(row);
                dispatch(setTableItems(newData))
                setEditingKey(null);
                setEditingKey(null);
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };


    const columns = [
        {
            title: 'name',
            dataIndex: 'name',
            width: '20%',
            editable: true,
            sorter: (a:TableItem, b:TableItem) => a.name.localeCompare(b.name),
        },
        {
            title: 'email',
            dataIndex: 'email',
            width: '25%',
            editable: true,
            sorter: (a:TableItem, b:TableItem) => a.email.localeCompare(b.email),
        },
        {
            title: 'birthday_date',
            dataIndex: 'birthday_date',
            width: '10%',
            editable: true,
            sorter: (a: TableItem, b: TableItem) => {
                // Перетворюємо текст в об'єкти Date
                const dateA = new Date(convertTextToDate(a.birthday_date));
                const dateB = new Date(convertTextToDate(b.birthday_date));

                // Порівнюємо дати і повертаємо результат
                return dateA.getTime() - dateB.getTime();
            }
        },
        {
            title: 'phone_number',
            dataIndex: 'phone_number',
            width: '20%',
            editable: true,
            sorter: (a:TableItem, b:TableItem) => a.phone_number.localeCompare(b.phone_number),
        },
        {
            title: 'address',
            dataIndex: 'address',
            width: '40%',
            editable: true,
            sorter: (a:TableItem, b:TableItem) => a.address.localeCompare(b.address),
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: TableItem) => {
                const editable = isEditing(record);
                return (

                    editable ? (
                        <span>
                            <div>
                                <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                                    Save
                                </Typography.Link>
                            </div>
                            <div>
                                <Popconfirm title="Sure to cancel?" onConfirm={() =>  setEditingKey(null)}>
                                    <a>Cancel</a>
                                </Popconfirm>
                            </div>
                        </span>
                    ) : (
                        <Typography.Link disabled={editingKey !== null} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>

                    )
                )
            },
        },
    ];

    const mergedColumns = columns.map((col, index) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: TableItem) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>

            {contextHolder}

            {updateLoading && <Alert message="Updating..." type="info" />}

            <br/>

            <Form form={form} component={false}>
                <Table
                    size="small"
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={tableItems}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: (page: number, pageSize: Limit) => cancel(page, pageSize),
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20'],
                        pageSize: limit,
                        total: count,
                        current: currentPage,
                    }}
                />
            </Form>
        </>

    );
};

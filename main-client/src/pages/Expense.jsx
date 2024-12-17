import React, { useEffect, useState } from 'react';
import {
    Card,
    Col,
    Row,
    Typography,
    Button,
    Modal,
    Form,
    DatePicker,
    Select,
    Table,
    Input,
} from 'antd';
import {
    HomeTwoTone,
    SmileTwoTone,
    HeartTwoTone,
    SafetyCertificateTwoTone,
    AppstoreTwoTone,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { expenseApi } from '../api/expenseApi';
import { toast } from 'react-toastify';
import Loading from '../components/loading';
import { exportApi } from '../api/exportApi';
import FileSaver from 'file-saver'

const pageSize = 4;
const { Title } = Typography;

function Expenses() {
    const [expenseRecords, setExpenseRecords] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [expenseByType, setExpenseByType] = useState([]);
    const [totalExpense, setTotalExpense] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState();
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [form] = Form.useForm();

    const expenseCategories = [
        { name: 'Chi phí sinh hoạt', color: '#FF6F61', icon: <HomeTwoTone twoToneColor="#FF6F61" style={{ fontSize: 48 }} /> },
        { name: 'Chi phí giải trí & sở thích', color: '#6A9FB5', icon: <SmileTwoTone twoToneColor="#6A9FB5" style={{ fontSize: 48 }} /> },
        { name: 'Chi phí chăm sóc sức khỏe', color: '#4F75FF', icon: <HeartTwoTone twoToneColor="#4F75FF" style={{ fontSize: 48 }} /> },
        { name: 'Tiết kiệm & đầu tư', color: '#4CAF50', icon: <SafetyCertificateTwoTone twoToneColor="#4CAF50" style={{ fontSize: 48 }} /> },
        { name: 'Chi phí gia đình', color: '#6A1B9A', icon: <HomeTwoTone twoToneColor="#6A1B9A" style={{ fontSize: 48 }} /> },
        { name: 'Khác', color: '#E0A75E', icon: <AppstoreTwoTone twoToneColor="#E0A75E" style={{ fontSize: 48 }} /> },
    ];

    const onLoadData = async () => {
      try {
        const payload = {
          limit: pageSize,
          page: currentPage,
          order: 'desc'
        }
        setIsLoading(true)
        const response = await expenseApi.getAllExpenses(payload)
        const statistics = await expenseApi.getByType();
        let expenses = [...response.data.data]
        setExpenseByType(statistics.data.data)
        setExpenseRecords(expenses);
        setTotalExpense(response.data.meta.totalCount)
        setIsLoading(false)
      }
      catch (err) {
        toast.error(err);
        setIsLoading(false)
      }
    };
    useEffect(() => {
      onLoadData();
    }, [currentPage])

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const parseCurrency = (value) => parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

    const formatInputCurrency = (value) => {
        if (!value) return '';
        if (typeof value !== 'number') {
            value = parseInt(value.replace(/[^0-9]/g, ''), 10);
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const handleAddExpense = async (values) => {
        const newExpense = {
            type: values.type,
            value: parseCurrency(values.value),
            date: values.date.format('YYYY-MM-DD'),
            note: values.note,
        };
        try {
          const response = await expenseApi.createExpense(newExpense);
          if(!response.data.success) {
            toast.error("Xảy ra lỗi khi thêm khoản chi tiêu!");
            return;
          }
          setCurrentPage(1)
          onLoadData();
          toast.success('Khoản chi tiêu đã được thêm!');
        }
        catch (err) {
          toast.error(err.response.statusText);
        }
        setIsModalVisible(false);
    };

    const handleEditExpense = async (values) => {
        const updatedExpense = {
            ...currentExpense,
            id: currentExpense._id,
            type: values.type,
            value: parseCurrency(values.value),
            date: values.date.format('YYYY-MM-DD'),
            note: values.note,
        };
        try {
          const response = await expenseApi.updateExpense(updatedExpense);
          if(!response.data.success) {
            toast.error("Xảy ra lỗi khi sửa khoản chi tiêu!");
            return;
          }
          onLoadData();
          toast.success('Khoản chi tiêu đã được sửa!');
        }
        catch (err) {
          toast.error(err.response.statusText);
        }
        setIsModalVisible(false);
        setIsEditMode(false);
        form.resetFields();
    };

    const handleDeleteExpense = async (id) => {
        try {
          const response = await expenseApi.deleteExpense({id});
          if(!response.data.success) {
            toast.error("Xảy ra lỗi khi xóa khoản chi tiêu!");
            return;
          }
          setCurrentPage(1);
          onLoadData();
          toast.success('Khoản chi tiêu đã được xóa!');
        }
        catch (err) {
          toast.error(err.response.statusText);
        }
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setCurrentPage(pagination.current);
    }

    const renderExpenseModal = () => (
        <Modal
            title={isEditMode ? 'Chỉnh sửa chi tiêu' : 'Thêm khoản chi tiêu'}
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            maskClosable={false}
        >
            <Form
                form={form}
                initialValues={{
                    type: currentExpense ? currentExpense.type : '',
                    value: currentExpense ? formatCurrency(currentExpense.value) : '',
                    date: currentExpense ? moment(currentExpense.date) : moment(),
                    note: currentExpense ? currentExpense.note : '',
                }}
                onFinish={isEditMode ? handleEditExpense : handleAddExpense}
            >
                <Form.Item
                    name="type"
                    label="Loại chi tiêu"
                    rules={[{ required: true, message: 'Vui lòng chọn loại chi tiêu!' }]}
                >
                    <Select>
                        {expenseCategories.map((category) => (
                            <Select.Option key={category.name} value={category.name}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="value"
                    label="Số tiền"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                >
                    <Input type="text" addonAfter="VND"
                     onChange={(e) =>
                        form.setFieldsValue({ value: formatInputCurrency(e.target.value) })
                    }
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Ngày chi tiêu"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item name="note" label="Ghi chú">
                    <Input.TextArea rows={3} />
                </Form.Item>

                <Form.Item style={{ textAlign: 'end' }}>
                    <Button type="primary" htmlType="submit">
                        {isEditMode ? 'Lưu thay đổi' : 'Thêm khoản chi tiêu'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );

    const columns = [
        { title: 'Loại chi tiêu', dataIndex: 'type', key: 'type' },
        { title: 'Số tiền', dataIndex: 'value', key: 'value', render: formatCurrency },
        { title: 'Ngày chi tiêu', dataIndex: 'date', key: 'date' },
        { 
            title: 'Tháng năm', 
            dataIndex: 'date', 
            key: 'monthYear',
            render: (date) => moment(date).format('MM-YYYY') 
        },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => showEditExpenseModal(record)}>
                        <EditOutlined />
                    </Button>
                    <Button danger type="link" onClick={() => handleDeleteExpense(record._id)}>
                        <DeleteOutlined />
                    </Button>
                </span>
            ),
        },
    ];

    const showAddExpenseModal = () => {
        setIsModalVisible(true);
        setIsEditMode(false);
        setCurrentExpense(null);
        form.setFieldsValue({
            type: "",
            value: '',
            date: '',
            note: '',
        });
    };

    const showEditExpenseModal = (expense) => {
        setIsModalVisible(true);
        setIsEditMode(true);
        setCurrentExpense(expense);
        form.setFieldsValue({
            type: expense.type,
            value: formatInputCurrency(expense.value),
            date: moment(expense.date),
            note: expense.note,
        });
    };
    // Add "Tháng" column based on "Ngày nhận"
    const addMonthColumn = (records) => {
        return records.map(record => ({
            ...record,
            month: moment(record.date).format('MM-YYYY'), // Extract "Month-Year" format
        }));
    };

    return (
        (isLoading ? <Loading secondLoading={true}/>:<div>
            <Title level={4} style={{ color: '#444' }}>
                Quản lý chi tiêu
            </Title>

            <Row gutter={[12, 12]}>
                {expenseCategories.map((category, index) => (
                    <Col span={8} key={index}>
                        <Card bordered={false}>
                            <div className="statistic-card">
                                <div>
                                    <div className="number_total">
                                        {formatCurrency(
                                            expenseByType
                                                .filter((record) => record.type === category.name)
                                                .reduce((total, record) => total + record.total, 0)
                                        )}
                                    </div>
                                    <div className="title_total" style={{ color: category.color }}>
                                        {category.name}
                                    </div>
                                </div>
                                <div style={{ alignSelf: 'center' }}>{category.icon}</div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Button
                // type="primary"
                icon={<DownloadOutlined />}
                onClick={async () => {
                    const data = await exportApi.downloadExpense();
                    // If you want to download file automatically using link attribute.
                    const blob = new Blob([data.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',});
                    FileSaver.saveAs(blob, 'expense.xlsx')
                }}
                style={{ marginTop: 20, marginBottom: 20, float: 'right' }}
            >
                Excel
            </Button>
            <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={showAddExpenseModal}
                style={{ marginTop: 20, marginBottom: 20, marginRight: 12, float: 'right' }}
            >
                Thêm chi tiêu
            </Button>

            <Table
                columns={columns}
                dataSource={expenseRecords.map(record => ({
                    ...record,
                    monthYear: moment(record.date).format('MM-YYYY'), // Thêm thuộc tính monthYear
                }))}
                rowKey="id"
                style={{ marginTop: 20 }}
                pagination={{pageSize: pageSize, total: totalExpense, current: currentPage}}
                onChange={handleTableChange}
            />

            {renderExpenseModal()}
        </div>
        )
    );
}

export default Expenses;

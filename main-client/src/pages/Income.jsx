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
    Input
} from 'antd';
import {
    DollarOutlined,
    StockOutlined,
    CarryOutOutlined,
    ClockCircleOutlined,
    AppstoreOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { toast } from 'react-toastify';
import { incomeApi } from '../api/incomeApi';
import Loading from '../components/loading';
import FileSaver from 'file-saver'
import { exportApi } from '../api/exportApi';

const pageSize = 4
const { Title } = Typography;

function Income() {
    const [incomeRecords, setIncomeRecords] = useState([
        { id: 1, type: 'Thu nhập chính / Lương', value: 10000000, date: '2024-11-01' },
        { id: 2, type: 'Thu nhập đầu tư', value: 4000000, date: '2024-11-05' },
        { id: 3, type: 'Việc làm thêm', value: 3000000, date: '2024-11-10' },
        { id: 4, type: 'Thu nhập không thường xuyên', value: 2000000, date: '2024-11-12' },
        { id: 5, type: 'Thu nhập khác', value: 1500000, date: '2024-11-15' },
    ]);
    const [incomeByType, setIncomeByType] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [totalIncome, setTotalIncome] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [currentIncome, setCurrentIncome] = useState(null);
    const [form] = Form.useForm();

    const onLoadData = async () => {
        try {
          const payload = {
            limit: pageSize,
            page: currentPage,
            order: 'desc'
          }
          setIsLoading(true)
          const response = await incomeApi.getAllIncomes(payload)
          const statistics = await incomeApi.getByType();
          let incomes = [...response.data.data]
          setIncomeByType(statistics.data.data)
          setIncomeRecords(incomes);
          setTotalIncome(response.data.meta.totalCount)
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

    const incomeTypes = [
        { label: 'Thu nhập chính / Lương', value: 'Thu nhập chính / Lương', color: '#FF6F61'},
        { label: 'Thu nhập đầu tư', value: 'Thu nhập đầu tư', color: '#6A9FB5'},
        { label: 'Việc làm thêm', value: 'Việc làm thêm', color: '#4F75FF'},
        { label: 'Thu nhập không thường xuyên', value: 'Thu nhập không thường xuyên', color: '#4CAF50' },
        { label: 'Thu nhập khác', value: 'Thu nhập khác', color: '#6A1B9A' },
    ];

    const formatCurrency = (value) => {
        if (typeof value !== 'number') {
            value = parseInt(value.replace(/[^0-9]/g, ''), 10);
        }
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value || 0);
    };

    const parseCurrency = (value) => {
        const number = value.replace(/[^0-9]/g, '');
        return number ? parseInt(number, 10) : 0;
    };

    const formatInputCurrency = (value) => {
        if (!value) return '';
        if (typeof value !== 'number') {
            value = parseInt(value.replace(/[^0-9]/g, ''), 10);
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setCurrentPage(pagination.current);
    }

    const showAddIncomeModal = () => {
        setIsModalVisible(true);
        setIsEditMode(false)
        setCurrentIncome();
        form.setFieldsValue({
            type: '',
            value: '',
            date: '',
        });
        setIsModalVisible(true);
    };

    const showEditIncomeModal = (income) => {
        setIsModalVisible(true);
        setIsEditMode(true);
        setCurrentIncome(income);
        form.setFieldsValue({
            type: income.type,
            value: income.value,
            date: moment(income.date),
        });
    };

    const handleAddIncome = async (values) => {
        const newIncome = {
            type: values.type,
            value: parseCurrency(values.value),
            date: values.date.format('YYYY-MM-DD'),
        }
        try {
          const response = await incomeApi.createIncome(newIncome);
          if(!response.data.success) {
            toast.error("Xảy ra lỗi khi thêm khoản thu nhập!");
            return;
          }
          setCurrentPage(1)
          onLoadData();
          toast.success('Khoản thu nhập đã được thêm!');
        }
        catch (err) {
          toast.error(err.response.statusText);
        }
        setIsModalVisible(false);
    };

    const handleEditIncome = async (values) => {
        const updatedIncome = {
              ...currentIncome,
              id: currentIncome._id,
              type: values.type,
              value: values.value,
              date: values.date.format('YYYY-MM-DD'),
            };
        try {
          const response = await incomeApi.updateIncome(updatedIncome);
          if(!response.data.success) {
            toast.error("Xảy ra lỗi khi sửa khoản thu nhập!");
            return;
          }
          onLoadData();
          toast.success('Khoản thu nhập đã được sửa!');
        }
        catch (err) {
          toast.error(err.response.statusText);
        }
        setIsModalVisible(false);
        setIsEditMode(false);
        setCurrentIncome();
        form.resetFields();
    };

    const handleDeleteIncome = async (id) => {
        try {
          const response = await incomeApi.deleteIncome({id});
          if(!response.data.success) {
            toast.error("Xảy ra lỗi khi xóa khoản thu nhập!");
            return;
          }
          setCurrentPage(1);
          onLoadData();
          toast.success('Khoản thu nhập đã được xóa!');
        }
        catch (err) {
          toast.error(err.response.statusText);
        }
    };

    const totalIncomeByCategory = (category) => {
        return incomeByType
            .filter((record) => record.type === category)
            .reduce((total, record) => total + record.total, 0);
    };

    // Add "Tháng" column based on "Ngày nhận"
    const addMonthColumn = (records) => {
        return records.map(record => ({
            ...record,
            month: moment(record.date).format('MM-YYYY'), // Extract "Month-Year" format
        }));
    };

    const columns = [
        {
            title: 'Loại thu nhập',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Số tiền',
            dataIndex: 'value',
            key: 'value',
            render: (value) => formatCurrency(value),
        },
        {
            title: 'Ngày nhận',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Tháng',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => showEditIncomeModal(record)}>
                        <EditOutlined />
                    </Button>
                    <Button danger type="link" onClick={() => handleDeleteIncome(record._id)}>
                        <DeleteOutlined />
                    </Button>
                </span>
            ),
        },
    ];

    const renderIncomeModal = () => (
        <Modal
            title={isEditMode ? 'Chỉnh sửa thu nhập' : 'Thêm thu nhập'}
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            maskClosable={false}
        >
            <Form
                form={form}
                initialValues={{
                    type: currentIncome ? currentIncome.type : '',
                    value: currentIncome ? formatCurrency(currentIncome.value) : '',
                    date: currentIncome ? moment(currentIncome.date) : moment(),
                }}
                onFinish={isEditMode ? handleEditIncome : handleAddIncome}
            >
                <Form.Item
                    name="type"
                    label="Loại thu nhập"
                    rules={[{ required: true, message: 'Vui lòng chọn loại thu nhập!' }]}
                >
                    <Select>
                        {incomeTypes.map((incomeType) => (
                            <Select.Option key={incomeType.value} value={incomeType.value}>
                                {incomeType.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="value"
                    label="Số tiền"
                    rules={[{ required: true, message: 'Vui lòng nhập số tiền thu nhập!' }]}
                >
                    <Input
                        type="text"
                        addonAfter="VND"
                        onChange={(e) =>
                            form.setFieldsValue({ value: formatInputCurrency(e.target.value) })
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label="Ngày nhận"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày nhận!' }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item style={{ textAlign: 'end' }}>
                    <Button type="primary" htmlType="submit">
                        {isEditMode ? 'Lưu thay đổi' : 'Thêm thu nhập'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );

    return (
        (isLoading ? <Loading secondLoading={true}/>:
        <div>
            <Title level={4} style={{ color: '#444' }}>
               Quản lý thu nhập
            </Title>

            <Row gutter={[12, 12]}>
                {incomeTypes.map((category, index) => (
                    <Col span={8} key={index}>
                        <Card bordered={false}>
                            <div className="statistic-card">
                                <div>
                                    <div className="number_total">
                                        {formatCurrency(totalIncomeByCategory(category.value))}
                                    </div>
                                    <div className="title_total" style={{ color: category.color }}>
                                        {category.label}
                                    </div>
                                </div>
                                <div style={{ alignSelf: 'center' }}>
                                    {category.value === 'Thu nhập chính / Lương' ? (
                                        <DollarOutlined style={{ fontSize: 48, color: '#FF6F61' }} />
                                    ) : category.value === 'Thu nhập đầu tư' ? (
                                        <StockOutlined style={{ fontSize: 48, color: '#6A9FB5' }} />
                                    ) : category.value === 'Việc làm thêm' ? (
                                        <CarryOutOutlined style={{ fontSize: 48, color: '#4F75FF' }} />
                                    ) : category.value === 'Thu nhập không thường xuyên' ? (
                                        <ClockCircleOutlined style={{ fontSize: 48, color: '#4CAF50' }} />
                                    ) : (
                                        <AppstoreOutlined style={{ fontSize: 48, color: '#6A1B9A' }} />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Button
                // type="primary"
                icon={<DownloadOutlined />}
                onClick={async () => {
                    const data = await exportApi.downloadIncome();
                    // If you want to download file automatically using link attribute.
                    const blob = new Blob([data.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',});
                    FileSaver.saveAs(blob, 'income.xlsx')
                }}
                style={{ marginTop: 20, marginBottom: 20, float: 'right' }}
            >
                Excel
            </Button>
            <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={showAddIncomeModal}
                style={{ marginTop: 20, marginBottom: 20, marginRight: 12, float: 'right' }}
            >
                Thêm thu nhập
            </Button>

            <Table
                columns={columns}
                dataSource={addMonthColumn(incomeRecords)} // Add "month" column dynamically
                rowKey="id"
                style={{ marginTop: 20 }}
                pagination={{pageSize: pageSize, total: totalIncome, current: currentPage}}
                onChange={handleTableChange}
            />

            {renderIncomeModal()}
        </div>
    ));
}

export default Income;

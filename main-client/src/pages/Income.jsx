import React, { useState } from 'react';
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
} from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

function Income() {
    const [incomeRecords, setIncomeRecords] = useState([
        { id: 1, type: 'Thu nhập chính / Lương', value: 10000000, date: '2024-11-01' },
        { id: 2, type: 'Thu nhập đầu tư', value: 4000000, date: '2024-11-05' },
        { id: 3, type: 'Việc làm thêm', value: 3000000, date: '2024-11-10' },
        { id: 4, type: 'Thu nhập không thường xuyên', value: 2000000, date: '2024-11-12' },
        { id: 5, type: 'Thu nhập khác', value: 1500000, date: '2024-11-15' },
    ]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentIncome, setCurrentIncome] = useState(null);
    const [form] = Form.useForm();

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

    const formaInputCurrency = (value) => {
        if (!value) return '';
        if (typeof value !== 'number') {
            value = parseInt(value.replace(/[^0-9]/g, ''), 10);
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const showAddIncomeModal = () => {
        setIsModalVisible(true);
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
            value: formaInputCurrency(income.value),
            date: moment(income.date),
        });
    };

    const handleAddIncome = (values) => {
        const newIncome = {
            id: incomeRecords.length + 1,
            type: values.type,
            value: parseCurrency(values.value),
            date: values.date.format('YYYY-MM-DD'),
        };
        setIncomeRecords([...incomeRecords, newIncome]);
        setIsModalVisible(false);
    };

    const handleEditIncome = (values) => {
        const updatedIncome = {
            ...currentIncome,
            type: values.type,
            value: parseCurrency(values.value),
            date: values.date.format('YYYY-MM-DD'),
        };
        setIncomeRecords(
            incomeRecords.map((income) =>
                income.id === currentIncome.id ? updatedIncome : income
            )
        );
        setIsModalVisible(false);
        setIsEditMode(false);
        form.resetFields();
    };

    const handleDeleteIncome = (id) => {
        setIncomeRecords(incomeRecords.filter((income) => income.id !== id));
    };

    const totalIncomeByCategory = (category) => {
        return incomeRecords
            .filter((record) => record.type === category)
            .reduce((total, record) => total + record.value, 0);
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
                    <Button danger type="link" onClick={() => handleDeleteIncome(record.id)}>
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
                            form.setFieldsValue({ value: formaInputCurrency(e.target.value) })
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
        <div>
            <Title level={4} style={{ color: '#444' }}>
                Các nguồn thu nhập
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
                type="primary"
                icon={<EditOutlined />}
                onClick={showAddIncomeModal}
                style={{ marginTop: 20, marginBottom: 20, float: 'right' }}
            >
                Thêm thu nhập
            </Button>

            <Table
                columns={columns}
                dataSource={addMonthColumn(incomeRecords)} // Add "month" column dynamically
                rowKey="id"
                style={{ marginTop: 20 }}
            />

            {renderIncomeModal()}
        </div>
    );
}

export default Income;

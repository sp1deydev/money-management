import React, { useEffect, useState } from 'react';
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    BackTop,
    Card,
    Col,
    Row,
    Spin,
    Typography,
} from 'antd';
import { DollarTwoTone, HeartTwoTone, SmileTwoTone, HomeTwoTone, SafetyCertificateTwoTone, AppstoreTwoTone } from '@ant-design/icons';
import Loading from '../components/loading';
import { toast } from 'react-toastify';
import { expenseApi } from '../api/expenseApi';

const { Title } = Typography;

const ExpenseDashboard = () => {
    const [isLoading, setIsLoading] = useState(false)
    // useEffect(() => {
    //     const testLoading = setTimeout(() => {setIsLoading(false)}, 1000)
    //     return () => clearTimeout(testLoading)
    // }, [])
    const balance = 12000000; // Current balance
    const currencyFormatter = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);

    // Expense categories with harmonious colors
    const [expenseCategories, setExpenseCategories] = useState([]);

    const weeklyExpenses = [
        { name: 'Tuần 1', total: 4000000 },
        { name: 'Tuần 2', total: 3000000 },
        { name: 'Tuần 3', total: 5000000 },
        { name: 'Tuần 4', total: 2000000 },
    ];

    const monthlyExpenses = [
        { name: 'Tháng 1', total: 12000000 },
        { name: 'Tháng 2', total: 8000000 },
        { name: 'Tháng 3', total: 15000000 },
        { name: 'Tháng 4', total: 11000000 },
        { name: 'Tháng 5', total: 17000000 },
        { name: 'Tháng 6', total: 10000000 },
        { name: 'Tháng 7', total: 9000000 },
        { name: 'Tháng 8', total: 14000000 },
        { name: 'Tháng 9', total: 13000000 },
        { name: 'Tháng 10', total: 15000000 },
        { name: 'Tháng 11', total: 12000000 },
        { name: 'Tháng 12', total: 16000000 },
    ];

    const yearlyExpenses = [
        { name: 'Năm 2022', total: 150000000 },
        { name: 'Năm 2023', total: 160000000 },
        { name: 'Năm 2024', total: 180000000 },
    ];

    const formatPieChartData = (data) => {
        const newData = data.map((item) => {
            switch (item.type) {
              case "Chi phí sinh hoạt":
                return {
                  name: item.type,
                  value: item.total,
                  color: "#FF6F61", // Soft Coral
                  icon: <HomeTwoTone twoToneColor="#FF6F61" style={{ fontSize: 48 }} />,
                };
              case "Chi phí giải trí & sở thích":
                return {
                  name: item.type,
                  value: item.total,
                  color: "#6A9FB5", // Soft Blue
                  icon: <SmileTwoTone twoToneColor="#6A9FB5" style={{ fontSize: 48 }} />,
                };
              case "Chi phí chăm sóc sức khỏe":
                return {
                  name: item.type,
                  value: item.total,
                  color: "#4F75FF", // Gold
                  icon: <HeartTwoTone twoToneColor="#4F75FF" style={{ fontSize: 48 }} />,
                };
              case "Chi phí gia đình":
                return {
                  name: item.type,
                  value: item.total,
                  color: "#6A1B9A", // Gold
                  icon: <HomeTwoTone twoToneColor="#6A1B9A" style={{ fontSize: 48 }} />,
                };
              case "Tiết kiệm & đầu tư":
                return {
                  name: item.type,
                  value: item.total,
                  color: "#4CAF50", // Green
                  icon: (
                    <SafetyCertificateTwoTone
                      twoToneColor="#4CAF50"
                      style={{ fontSize: 48 }}
                    />
                  ),
                };
              case "Khác":
                return {
                  name: "Khác",
                  value: item.total,
                  color: "#E0A75E", // Slate Gray
                  icon: (
                    <AppstoreTwoTone twoToneColor="#E0A75E" style={{ fontSize: 48 }} />
                  ),
                };
            }
        });
        return newData
    }

    const onLoadData = async () => {
          try {
            setIsLoading(true)
            const statistics = await expenseApi.getByType();
            const formattedData = formatPieChartData(statistics.data.data);
            setExpenseCategories(formattedData)
            setIsLoading(false)
          }
          catch (err) {
            toast.error(err);
            setIsLoading(false)
          }
        };
        useEffect(() => {
          onLoadData();
        }, [])

    return (
        (isLoading ? <Loading secondLoading={true}/> :
        <div>
            <Spin spinning={false}>
                <div className="container" style={{ backgroundColor: '#E8F5E9' }}>
                    {/* Balance */}
                    <Row gutter={12} style={{ marginTop: 20 }}>
                        <Col span={8}>
                            <Card bordered={false}>
                                <div className="statistic-card">
                                    <div>
                                        <div className="number_total">
                                            {currencyFormatter(balance)}
                                        </div>
                                        <div className="title_total" style={{color:'#1677ff'}}>Số dư hiện tại</div>
                                    </div>
                                    <div style={{ alignSelf: 'center' }}>
                                        <DollarTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Category Cards */}
                    {/* <Title level={4} style={{ marginTop: 40, color: '#444' }}>Chi tiêu theo danh mục</Title>
                    <Row gutter={[12, 12]}>
                        {expenseCategories.map((category, index) => (
                            <Col span={8} key={index}>
                                <Card bordered={false}>
                                    <div className="statistic-card">
                                        <div>
                                            <div className="number_total">
                                                {currencyFormatter(category.value)}
                                            </div>
                                            <div className="title_total" style={{color:`${category.color}`}}>{category.name}</div>
                                        </div>
                                        <div style={{ alignSelf: 'center' }}>
                                            {category.icon}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row> */}

                    {/* Charts */}
                    <Row gutter={12} style={{ marginTop: 40 }}>
                        <Col span={12}>
                            <div className="chart">
                                <Title level={4} style={{ color: '#444' }}>Phân bổ chi tiêu theo danh mục</Title>
                                <ResponsiveContainer width="100%" aspect={2 / 1}>
                                    <PieChart>
                                        <Pie
                                            data={expenseCategories}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            // outerRadius={140}
                                            fill="#8884d8"
                                            label={(entry) =>
                                                `${entry.name}`
                                            }
                                        >
                                            {expenseCategories.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="chart">
                                <Title level={4} style={{ color: '#444' }}>Chi tiêu hàng tuần</Title>
                                <ResponsiveContainer width="100%" aspect={2 / 1}>
                                    <ComposedChart
                                        data={weeklyExpenses}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid stroke="#f5f5f5" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total" barSize={20} fill="#66BB6A" />
                                        <Line type="monotone" dataKey="total" stroke="#7E57C2" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </Col>
                    </Row>

                    {/* Monthly Expenses Chart */}
                    <Row gutter={12} style={{ marginTop: 40 }}>
                        <Col span={12}>
                            <div className="chart">
                                <Title level={4} style={{ color: '#444' }}>Chi tiêu theo tháng</Title>
                                <ResponsiveContainer width="100%" aspect={2 / 1}>
                                    <ComposedChart
                                        data={monthlyExpenses}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid stroke="#f5f5f5" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total" barSize={20} fill="#42A5F5" />
                                        <Line type="monotone" dataKey="total" stroke="#F44336" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="chart">
                                <Title level={4} style={{ color: '#444' }}>Chi tiêu theo năm</Title>
                                <ResponsiveContainer width="100%" aspect={2 / 1}>
                                    <ComposedChart
                                        data={yearlyExpenses}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid stroke="#f5f5f5" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total" barSize={20} fill="#FFB74D" />
                                        <Line type="monotone" dataKey="total" stroke="#4CAF50" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </Col>
                    </Row>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    ));
};

export default ExpenseDashboard;

import { Card, Input, Button, Row, Col, Typography, Form, Avatar, List, Skeleton, Upload, Space, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { backendURL } from "../../Global";
import { UserOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import {
    allowSubmitForm,
    modifyStateProperty,
    joinAllServerErrorMessages, setServerErrors,
    validateFormDataInputRequired
} from "../../Utils/UtilsValidations"

let SellersProfiles = ({ openNotification }) => {
    const { sellerId } = useParams();
    const [user, setUser] = useState()
    const { Text, Title } = Typography;
    const [purchases, setPurchases]=useState([])
    const [sales, setSales]=useState([])

    useEffect(() => {
        getSellerInfo();
        getPurchases()
        getSales()
    }, [])

    let getSellerInfo = async () => {

        let response = await fetch(backendURL + "/userPrivate?id=" + sellerId,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });
        if(response.ok){
            let data = await response.json()
            setUser(data[0])
        }

    }
    let getPurchases = async () => {

        let response = await fetch(backendURL + "/transactions?buyerId="+sellerId,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });
        if (response.ok) {
            let jsonData = await response.json();
            setPurchases(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }

    }
    let getSales = async () => {

        let response = await fetch(backendURL + "/transactions?sellerId="+sellerId,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });
        if (response.ok) {
            let jsonData = await response.json();
            setSales(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }

    }
    return (
        <Row align="middle" justify="center">
            <Col>
                <Card title="Profile" style={{ minWidth: "700px" }}>
                    <Space direction="vertical" style={{ marginRight: 30 }}>
                        <Avatar src={backendURL + "/images/" + sellerId + "user.png"} size={150} icon={<UserOutlined />} />
                    </Space>
                    <Space direction="vertical" style={{ marginRight: 30 }}>
                        <Title level={2}>User data</Title>
                        <Text>Email: {user?.email}</Text>
                        <Text>Name: {user?.name}</Text>
                        <Text>Surname: {user?.surname}</Text>
                        <Text>Birthday: {user?.birthday}</Text>
                        <Text>Country: {user?.country}</Text>
                        <Text>Address: {user?.address}</Text>
                        <Text>PostalCode: {user?.postalCode}</Text>
                    </Space>
                    
                    <Space direction="vertical" style={{ marginRight: 30 }}>
                        <Title level={2}>Purchases</Title>
                       {purchases.map((purchas)=><Button>{purchas.title}</Button>)}
                    </Space>
                    <Space direction="vertical" style={{ marginRight: 30 }}>
                        <Title level={2}>Sales</Title>
                        {sales.map((sale)=><Button>{sale.title}</Button>)}
                    </Space>
                </Card>

            </Col>
        </Row>
    )
}
export default SellersProfiles
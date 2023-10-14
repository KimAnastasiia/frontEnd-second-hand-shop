import { Card, Input, Button, Row, Col, Typography, Form } from "antd";
import { useState, useEffect } from "react";
import { backendURL } from "../../Global";
import { Avatar, Upload, Space, DatePicker } from 'antd';
import { UserOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import {
    allowSubmitForm,
    modifyStateProperty,
    joinAllServerErrorMessages, setServerErrors,
    validateFormDataInputRequired
} from "../../Utils/UtilsValidations"
let ProfileUser = ({ openNotification }) => {
    const { Text, Title } = Typography;
    const [myFile, setMyFile] = useState()
    const [user, setUser] = useState()
    const [formErrors, setFormErrors] = useState({})
    const [makeCart, setMakeCart] = useState(false)
    const { email } = useParams();
    const [formData, setFormData] = useState({})
    const { RangePicker } = DatePicker;
    useEffect(() => {
        getUserInfo();
    }, [])

    let getUserInfo = async () => {

        let response = await fetch(backendURL + "/userPrivate/" + email,
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });
        if (response.ok) {
            let jsonData = await response.json();
            setUser(jsonData[0])
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
    }
    let createCart = async () => {

        let response = await fetch(backendURL + "/userPayment/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" ,
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify(formData)
            })
        if (response.ok) {
            setMakeCart(false)
        }
    }
    let uploadPhoto = async () => {

        const formDataPhotos = new FormData();

        formDataPhotos.append('photo', myFile);
        formDataPhotos.append('userId', user.id);
        let response = await fetch(backendURL + "/users/photo", {
            method: "POST",
            body: formDataPhotos
        })
        if (response.ok) {
            let data = await response.json()
            console.log(data)
        }

    }
    return (
        <Row align="middle" justify="center">
            <Col>
                <Card title="Profile" style={{ minWidth: "700px" }}>
                    <Space direction="vertical" style={{ marginRight: 30 }}>
                        <Avatar src={backendURL + "/images/" + localStorage.getItem("id") + "user.png"} size={150} icon={<UserOutlined />} />
                        <Upload >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Space>
                    <Space direction="vertical" style={{ marginRight: 30 }}>
                        <Title level={2}>User data</Title>
                        <Text>Email: {user?.email}</Text>
                        <Text>Name: {user?.name}</Text>
                        <Text>Surname: {user?.surname}</Text>
                        <Text>Birthday: {user?.birthday}</Text>
                        <Text>Country: {user?.country}</Text>
                        <Text>Adress: {user?.adress}</Text>
                        <Text>PostalCode: {user?.postalCode}</Text>
                    </Space>
                    <Space direction="vertical">
                        <Title level={2}>User payment data</Title>


                        {makeCart == false &&
                            <Form.Item>
                                <Button onClick={() => { setMakeCart(true) }} type="dashed" block icon={<PlusOutlined />}>
                                    Add paymant
                                </Button>
                            </Form.Item>
                        }

                        {makeCart == true &&

                            <>
                                <Input onChange={(input) => modifyStateProperty(formData, setFormData, "alias", input.currentTarget.value)} placeholder="Alias"></Input>
                                <Input onChange={(input) => modifyStateProperty(formData, setFormData, "number", input.currentTarget.value)} placeholder="Number"></Input>
                                <RangePicker onChange={(input) => modifyStateProperty(formData, setFormData, "expirationCart", input[0].$d + input[1].$d)} />
                                <Input onChange={(input) => modifyStateProperty(formData, setFormData, "code", input.currentTarget.value)} placeholder="Code"></Input>
                                <Button onClick={() => { createCart() }} style={{ width: "100%" }} type="primary">Add</Button>
                            </>
                        }

                    </Space>


                </Card>

            </Col>
        </Row>
    )
}
export default ProfileUser;
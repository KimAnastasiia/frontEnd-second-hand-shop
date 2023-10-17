import { Card, Input, Button, Row, Col, Typography, Form } from "antd";
import { useState, useEffect } from "react";
import { backendURL } from "../../Global";
import { useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import {
    allowSubmitForm,
    modifyStateProperty,
    joinAllServerErrorMessages, setServerErrors,
    validateFormDataInputRequired,
    validateFormDataInputEmail
} from "../../Utils/UtilsValidations"
import { DatePicker, Select, Radio, Upload } from 'antd';

let EditUserInfo = ({openNotification}) => {
   

    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [myFile, setMyFile]=useState()
    let navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const { email } = useParams();
    useEffect(() => {
        getAllCountries()
        getUserInfo()
    }, []);

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
            setFormData(jsonData[0])
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
    }
    let getAllCountries = async () => {
        let response = await fetch('https://restcountries.com/v3.1/all',
            {
                method: "GET",

            })
        if (response.ok) {
            let data = await response.json()
            let temp = data
            temp = temp.map((country) => {
                return {
                    value: country.name.common,
                    label: country.name.common,
                }
            })
            setCountries(temp)
        }
    }

    let chageValueImage =(file)=>{
        setMyFile(file)
    }
    
    let edit = async () => {

        let response = await fetch(backendURL+"/userPrivate/",
        {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json ",
                "apikey": localStorage.getItem("apiKey")
            },
            body: JSON.stringify(formData)
        });

        if ( response.ok ){
            let jsonData = await response.json();
            openNotification("top","Successfully", "success" )

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors; 
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )
        }
      
    }
    let uploadPhoto = async (id) => {

        const formDataPhotos = new FormData();

        formDataPhotos.append('photo', myFile);
        formDataPhotos.append('userId', id);
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
        <Row align="middle" justify="center" style={{ minHeight: "70vh" }}>
            <Col>
                <Card title="Edit data" style={{ width: "500px" }}>

                    <Form.Item label="" validateStatus={
                        validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input value={formData?.name} placeholder="Name" onChange={(input) => modifyStateProperty(formData, setFormData, "name", input.currentTarget.value)}>

                        </Input>
                    </Form.Item>

                    <Form.Item label="" >
                        <Input value={formData?.surname}  placeholder="Surname" onChange={(input) => modifyStateProperty(formData, setFormData, "surname", input.currentTarget.value)}></Input>
                    </Form.Item>

                    <Form.Item label="" >
                        <DatePicker defaultValue={moment(formData.birthday, "YYYY-MM-DD")}  format='YYYY-MM-DD'  placeholder="Birthday"  onChange={(data,dateString)=>{ modifyStateProperty(formData, setFormData, "birthday", dateString)}} />
                    </Form.Item>

                    <Form.Item label="" validateStatus={
                        validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Radio.Group value={formData?.documentIdentity}  onChange={(e)=>{ modifyStateProperty(formData, setFormData, "documentIdentity", e.target.value)}}>
                            <Radio value={"DNI"}>DNI</Radio>
                            <Radio value={"Passport"}>Passport</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="" validateStatus={
                        validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input value={formData?.documentNumber}  placeholder="Document Number"  onChange={(input) => modifyStateProperty(formData, setFormData, "documentNumber", input.currentTarget.value)} ></Input>
                    </Form.Item>

                    <Form.Item label="">
                            <Upload action={ (file) => {chageValueImage(file)} }  listType="picture-card">
                                Upload
                            </Upload>
                    </Form.Item>

                    <Form.Item label="" validateStatus={
                        validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Select
                            onChange={(value) => modifyStateProperty(formData, setFormData, "country", value)}
                            showSearch
                            style={{
                                width: 200,
                            }}
                            value={formData?.country}
                            placeholder="Country"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={countries}
                        />
                    </Form.Item>

                    <Form.Item label="" >
                        <Input value={formData?.address} placeholder="Address" onChange={(input) => modifyStateProperty(formData, setFormData, "address", input.currentTarget.value)}></Input>
                    </Form.Item>

                    <Form.Item label="" >
                        <Input value={formData?.postalCode} placeholder="Postal code" onChange={(input) => modifyStateProperty(formData, setFormData, "postalCode", input.currentTarget.value)}></Input>
                    </Form.Item>

                    <Form.Item label=""
                        validateStatus={
                            validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input value={formData?.password} onChange={(input) => modifyStateProperty(formData, setFormData, "password", input.currentTarget.value)}
                            size="large" type="text" placeholder="your password"></Input>

                        {formErrors?.password?.msg && <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                    </Form.Item>

                    
                <Button type="primary" onClick={()=>{edit()}} block >Edit account</Button>
                       

                </Card>
            </Col>
        </Row>
    )
}

export default EditUserInfo;
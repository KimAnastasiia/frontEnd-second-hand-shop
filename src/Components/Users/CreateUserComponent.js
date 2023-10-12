import { Card, Input, Button, Row, Col, Typography, Form } from "antd";
import { useState, useEffect } from "react";
import { backendURL } from "../../Global";
import { useNavigate } from "react-router-dom";
import {
    allowSubmitForm,
    modifyStateProperty,
    joinAllServerErrorMessages, setServerErrors,
    validateFormDataInputRequired,
    validateFormDataInputEmail
} from "../../Utils/UtilsValidations"
import { DatePicker, Select, Radio, Upload } from 'antd';

let CreaUserComponent = (props) => {
    let { openNotification } = props
    let requiredInForm = ["email", "password"]
    let [formData, setFormData] = useState({})
    let [formErrors, setFormErrors] = useState({})
    const [myFile, setMyFile]=useState()
    let navigate = useNavigate();

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        getAllCountries()
    }, []);

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
    let clickCreate = async () => {
        let response = await fetch(backendURL + "/users", {
            method: "POST",
            headers: { "Content-Type": "application/json " },
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            let data= await response.json()
            uploadPhoto(data.userId)
            openNotification("top", "User created successfull", "success")
            navigate("/login")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
    }
    let chageValueImage =(file)=>{
        setMyFile(file)
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
                <Card title="Create user" style={{ width: "500px" }}>

                    <Form.Item label="" validateStatus={
                        validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input placeholder="Name" onChange={(input) => modifyStateProperty(formData, setFormData, "name", input.currentTarget.value)}>

                        </Input>
                    </Form.Item>

                    <Form.Item label="" >
                        <Input placeholder="Surname" onChange={(input) => modifyStateProperty(formData, setFormData, "surname", input.currentTarget.value)}></Input>
                    </Form.Item>

                    <Form.Item label="" >
                        <DatePicker placeholder="Birthday" onChange={(data,dateString)=>{ modifyStateProperty(formData, setFormData, "birthday", dateString)}} />
                    </Form.Item>

                    <Form.Item label="" validateStatus={
                        validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Radio.Group onChange={(e)=>{ modifyStateProperty(formData, setFormData, "documentIdentity", e.target.value)}}>
                            <Radio value={"DNI"}>DNI</Radio>
                            <Radio value={"Passport"}>Passport</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="" validateStatus={
                        validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input placeholder="Document Number"  onChange={(input) => modifyStateProperty(formData, setFormData, "documentNumber", input.currentTarget.value)} ></Input>
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
                        <Input placeholder="Adress" onChange={(input) => modifyStateProperty(formData, setFormData, "adress", input.currentTarget.value)}></Input>
                    </Form.Item>

                    <Form.Item label="" >
                        <Input placeholder="Postal code" onChange={(input) => modifyStateProperty(formData, setFormData, "postalCode", input.currentTarget.value)}></Input>
                    </Form.Item>

                    <Form.Item label="" validateStatus={
                        validateFormDataInputEmail(formData, "email", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input onChange={(input) => modifyStateProperty(formData, setFormData, "email", input.currentTarget.value)}
                            size="large" type="text" placeholder="your email"></Input>


                        {formErrors?.email?.msg && <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label=""
                        validateStatus={
                            validateFormDataInputRequired(formData, "password", formErrors, setFormErrors) ? "success" : "error"}>
                        <Input onChange={(input) => modifyStateProperty(formData, setFormData, "password", input.currentTarget.value)}
                            size="large" type="text" placeholder="your password"></Input>

                        {formErrors?.password?.msg && <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                    </Form.Item>

                    {allowSubmitForm(formData, formErrors, requiredInForm) ?
                        <Button type="primary" onClick={clickCreate} block >Create account</Button> :
                        <Button type="primary" onClick={clickCreate} block disabled>Create account</Button>
                    }

                </Card>
            </Col>
        </Row>
    )
}

export default CreaUserComponent;
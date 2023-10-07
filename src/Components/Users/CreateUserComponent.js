import { Card, Input, Button, Row, Col, Typography, Form } from "antd";
import { useState } from "react";
import { backendURL } from "../../Global";
import { useNavigate } from "react-router-dom";
import {  
    allowSubmitForm, 
    modifyStateProperty, 
    joinAllServerErrorMessages,setServerErrors,
    validateFormDataInputRequired,
    validateFormDataInputEmail } from "../../Utils/UtilsValidations"

let CreaUserComponent = (props) => {
    let { openNotification } = props

    let requiredInForm = ["email","password"]
    let [formData, setFormData] = useState({})
    let [formErrors, setFormErrors] = useState({})

    let navigate = useNavigate();

    let clickCreate = async () => {
        let response = await fetch(backendURL+"/users",{
            method: "POST",
            headers: { "Content-Type" : "application/json "},
            body: JSON.stringify(formData)
        })

        if (response.ok){
            openNotification("top","User created successfull", "success" )
            navigate("/login")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors; 
            
            setServerErrors(serverErrors,setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )
        }   
    }

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh"}}>
            <Col>
                <Card title="Create user" style={{ width: "500px"}}>

                    <Form.Item label="" validateStatus={ 
                        validateFormDataInputEmail(formData,"email", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"email",input.currentTarget.value) } 
                            size="large" type="text" placeholder="your email"></Input>
                            

                        { formErrors?.email?.msg && <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label="" 
                        validateStatus={ 
                            validateFormDataInputRequired(formData,"password", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"password",input.currentTarget.value) } 
                            size="large"  type="text" placeholder="your password"></Input>
                        
                        { formErrors?.password?.msg && <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                    </Form.Item>

                    { allowSubmitForm(formData,formErrors,requiredInForm) ? 
                        <Button type="primary" onClick={clickCreate} block >Create account</Button> :
                        <Button type="primary" onClick={clickCreate} block disabled>Create account</Button>
                    }

                </Card>
            </Col>
        </Row>
    )
}

export default CreaUserComponent;
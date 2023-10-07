import { Card, Input, Button, Row, Col, Form, Typography  } from "antd";
import { useState } from "react";
import { backendURL } from "../../Global";
import { useNavigate } from "react-router-dom";
import { 
    allowSubmitForm, 
    modifyStateProperty, 
    joinAllServerErrorMessages,setServerErrors,
    validateFormDataInputRequired,
    validateFormDataInputEmail } from "../../Utils/UtilsValidations"

let LoginUserComponent = (props) => {
    let { setLogin, openNotification } = props

    let requiredInForm = ["email","password"]
    let [formData, setFormData] = useState({})
    let [formErrors, setFormErrors] = useState({})

    let navigate = useNavigate();

    let clickLogin = async () => {
        let response = await fetch(backendURL+"/users/login",{
            method: "POST",
            headers: { "Content-Type" : "application/json "},
            body: JSON.stringify(formData)
        })

        if (response.ok){
            let jsonData = await response.json();
            if ( jsonData.apiKey != null){
                localStorage.setItem("apiKey",jsonData.apiKey)
                localStorage.setItem("email",jsonData.email)
                setLogin(true)
                openNotification("top","Login successfull", "success" )
                navigate("/")
            }
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
                <Card title="Login" style={{ width: "500px"}}>

                    <Form.Item label="" validateStatus={ 
                        validateFormDataInputEmail(
                            formData,"email", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"email",input.currentTarget.value) } 
                            size="large" type="text" placeholder="your email"></Input>
                            

                        { formErrors?.email?.msg && <Typography.Text type="danger"> {formErrors?.email?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label="" 
                        validateStatus={ validateFormDataInputRequired(formData,"password", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"password",input.currentTarget.value) } 
                            size="large"  type="text" placeholder="your password"></Input>
                        
                        { formErrors?.password?.msg && <Typography.Text type="danger"> {formErrors?.password?.msg} </Typography.Text>}
                    </Form.Item>

                    { allowSubmitForm(formData,formErrors,requiredInForm) ? 
                        <Button type="primary" onClick={clickLogin} block >Login</Button> :
                        <Button type="primary" onClick={clickLogin} block disabled>Login</Button>
                    }

                </Card>
            </Col>
        </Row>
    )
}

export default LoginUserComponent;
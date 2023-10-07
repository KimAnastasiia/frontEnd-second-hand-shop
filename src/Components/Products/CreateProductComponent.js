import { Card, Input, Button, Row, Col, Form, Typography,Upload  } from "antd";
import { backendURL } from "../../Global";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  
    allowSubmitForm, 
    modifyStateProperty, 
    joinAllServerErrorMessages,setServerErrors,
    validateFormDataInputRequired } from "../../Utils/UtilsValidations"
import ImgCrop from 'antd-img-crop';

let CreateProductComponent = (props) => {
    let { openNotification } = props

    let requiredInForm = ["title","description","price"]
    let [formData, setFormData] = useState({})
    let [formErrors, setFormErrors] = useState({})

    let navigate = useNavigate();
    const [fileList, setFileList] = useState([

    ]);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    let clickCreateProduct = async () => {

        let response = await fetch(backendURL+"/products",{
            method: "POST",
            headers: { 
                "Content-Type" : "application/json ",
                "apikey": localStorage.getItem("apiKey")
            },
            body: JSON.stringify(formData)
        })

        if (response.ok){
            openNotification("top","Product created successfull", "success" )
            navigate("/products")
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
                <Card title="Create product" style={{ width: "500px"}}>

                    <Form.Item label="" validateStatus={ 
                        validateFormDataInputRequired(formData,"title", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"title",input.currentTarget.value) } 
                            size="large" type="text" placeholder="product title"></Input>
                            

                        { formErrors?.title?.msg && <Typography.Text type="danger"> {formErrors?.title?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label="" 
                        validateStatus={ 
                            validateFormDataInputRequired(formData,"description", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"description",input.currentTarget.value) } 
                            size="large"  type="text" placeholder="description"></Input>
                        
                        { formErrors?.description?.msg && <Typography.Text type="danger"> {formErrors?.description?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label="" 
                        validateStatus={ 
                            validateFormDataInputRequired(formData,"price", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"price",input.currentTarget.value) } 
                            size="large"  type="number" placeholder="price"></Input>
                        
                        { formErrors?.price?.msg && <Typography.Text type="danger"> {formErrors?.price?.msg} </Typography.Text>}
                    </Form.Item>
                    <ImgCrop rotationSlider>
                        <Upload
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {fileList.length < 5 && '+ Upload'}
                        </Upload>
                    </ImgCrop>
                    { allowSubmitForm(formData,formErrors,requiredInForm) ? 
                        <Button type="primary" onClick={clickCreateProduct} block >Sell Product</Button> :
                        <Button type="primary" onClick={clickCreateProduct} block disabled>Sell Product</Button>
                    }

                </Card>
            </Col>
        </Row>
    )
}

export default CreateProductComponent;
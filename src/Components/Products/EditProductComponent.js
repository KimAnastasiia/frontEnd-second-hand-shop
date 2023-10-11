import { Card, Input, Button, Row, Col, Form, Typography, Upload  } from "antd";
import { backendURL } from "../../Global";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {  
    allowSubmitForm, 
    modifyStateProperty, 
    joinAllServerErrorMessages,setServerErrors,
    validateFormDataInputRequired } from "../../Utils/UtilsValidations"


let EditProductComponent = (props) => {
    let { openNotification } = props

    const { id } = useParams();
    const [myFile, setMyFile]=useState()
    let requiredInForm = ["title","description","price"]
    let [formData, setFormData] = useState({})
    let [formErrors, setFormErrors] = useState({})

    let navigate = useNavigate();

    useEffect(() => {
        getProduct();
    },[])
    let uploadPhotos = async () => {

        const formDataPhotos = new FormData();

        formDataPhotos.append('photos', myFile);
        formDataPhotos.append('productId', formData?.id);
        
        let response = await fetch(backendURL + "/products/photos", {
            method: "POST",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
            body: formDataPhotos
        })
        if (response.ok) {
            let data = await response.json()
            console.log(data)
        }
        
    }
    let getProduct = async () => {
        let response = await fetch(backendURL+"/products/"+id,
        {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if ( response.ok ){
            let jsonData = await response.json();
            setFormData(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors; 

            setServerErrors(serverErrors,setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )
        }
    }
 
    let chageValueImage =(file)=>{
        setMyFile(file)
   
    }
    let clickEditProduct = async () => {
        let response = await fetch(backendURL+"/products/"+id,
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
            openNotification("top","Success modification", "success" )
            uploadPhotos()
            navigate("/products/"+localStorage.getItem("id"))

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors; 
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )
        }
      
    }
 

    return (
        <Row align="middle" justify="center" style={{ minHeight: "70vh"}}>
            <Col>
                <Card title="Edit product" style={{ width: "500px"}}>

                    <Form.Item label="" validateStatus={ 
                        validateFormDataInputRequired(formData,"title", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"title",input.currentTarget.value) } 
                            size="large" type="text" placeholder="product title"
                            value={formData?.title}
                            ></Input>
                            

                        { formErrors?.title?.msg && <Typography.Text type="danger"> {formErrors?.title?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label="" 
                        validateStatus={ 
                            validateFormDataInputRequired(formData,"description", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"description",input.currentTarget.value) } 
                            size="large"  type="text" placeholder="description"
                            value={formData?.description}
                            ></Input>
                            

                        { formErrors?.description?.msg && <Typography.Text type="danger"> {formErrors?.description?.msg} </Typography.Text>}
                    </Form.Item>

                    <Form.Item label="" 
                        validateStatus={ 
                            validateFormDataInputRequired(formData,"price", formErrors, setFormErrors) ? "success" : "error" }>
                        <Input onChange = { (input) => modifyStateProperty(formData, setFormData,"price",input.currentTarget.value) } 
                            size="large"  type="number" placeholder="price"
                            value={formData?.price}
                            ></Input>
                            

                        { formErrors?.price?.msg && <Typography.Text type="danger"> {formErrors?.price?.msg} </Typography.Text>}
                    </Form.Item>
                    <Form.Item name="image">
                            <Upload  action={ (file) => {chageValueImage(file)} }  listType="picture-card">
                                Upload
                            </Upload>
                        </Form.Item>
                    { allowSubmitForm(formData,formErrors,requiredInForm) ? 
                        <Button type="primary" onClick={clickEditProduct} block >Edit Product</Button> :
                        <Button type="primary" onClick={clickEditProduct} block disabled>Edit Product</Button>
                    }
                </Card>
            </Col>
        </Row>
    )
}

export default EditProductComponent
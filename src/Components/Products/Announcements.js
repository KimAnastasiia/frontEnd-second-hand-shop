import { useEffect, useState, useRef } from "react";
import { backendURL } from "../../Global";
import { Card, Image, Modal, Button, Radio, Space, Input, InputNumber, Flex } from 'antd';
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Icon, { AlignRightOutlined } from '@ant-design/icons';

import {
    allowSubmitForm,
    modifyStateProperty,
    joinAllServerErrorMessages, setServerErrors,
    validateFormDataInputRequired
} from "../../Utils/UtilsValidations"
import { HeartOutlined } from '@ant-design/icons';
let Announcements = ({ openNotification }) => {

    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [formErrors, setFormErrors] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [carts, setCarts] = useState([])
    const [selectedCreditCard, setSelectedCreditCard] = useState("");
    const [search, setSearch] = useState("")
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [openModel, setOpenModel]= useState(false)

    const currentProduct = useRef()
    const { Search } = Input;
    useEffect(() => {
        getProducts();
        getUserCarts()
    }, [])

    const onChange = (e) => {
        //console.log('radio checked', e.target.value);
        setSelectedCreditCard(e.target.value);
    };
    const showModal = (product) => {
        currentProduct.current = product
        console.log(currentProduct.current)
        setIsModalOpen(true);
    };

    const handleOk = () => {
        buyProduct(currentProduct.current.id)
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    let getUserCarts = async () => {

        let response = await fetch(backendURL + "/userPayment/",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });
        if (response.ok) {
            let jsonData = await response.json();
            setCarts(jsonData.data)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }

    }

    let getProducts = async () => {
        let response = await fetch(backendURL + "/products",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });

        if (response.ok) {
            let jsonData = await response.json();
            setProducts(jsonData)
            let temp = 0
            jsonData.forEach((product)=>{
                temp=Math.max(temp,product.price)
            })
            setMaxPrice(temp)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
    }


    let buyProduct = async (id) => {

        let response = await fetch(backendURL + "/products",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json ",
                    "apikey": localStorage.getItem("apiKey")
                },
                body: JSON.stringify({
                    buyerId: localStorage.getItem("id"),
                    id: id
                })
            });

        if (response.ok) {
            let jsonData = await response.json();
            openNotification("top", "Successfully purchased", "success")

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
        getProducts();
        addToTransactions()
    }
    let addToTransactions = async () => {
        currentProduct.current.buyerPaymentName = selectedCreditCard
        let response = await fetch(backendURL + "/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json ",
                "apikey": localStorage.getItem("apiKey")
            },
            body: JSON.stringify(currentProduct.current)
        })

        if (response.ok) {
            openNotification("top", "Successfull", "success")
            let data = await response.json()
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
    }
    let addToFavorites = async (productId) => {

        let response = await fetch(backendURL + "/favorites/" + productId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json ",
                "apikey": localStorage.getItem("apiKey")
            }
        })

        if (response.ok) {
            openNotification("top", "Successfull", "success")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
    }
    const HeartSvg = () => (
        <svg width="5em" height="2em" fill="currentColor" viewBox="0 0 1024 1024">
            <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
        </svg>
    );
    const HeartIcon = (props) => <Icon component={HeartSvg} {...props} />;

    const deleteFavorites = async (productId) => {

        let response = await fetch(backendURL + `/favorites/${productId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json ",
                "apikey": localStorage.getItem("apiKey")
            },
        })
        if (response.ok) {
            openNotification("top", "Successfull", "success")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
    };
    const openModelDetails=()=>{
        setOpenModel(true)
    }

    const onOkModelDetails=()=>{
        setOpenModel(false)
    }
    const onCancelModelDetails=()=>{
        setOpenModel(false)
    }
    return (
        <Card title="All products"
            extra={[
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Search
                        placeholder="input search text"
                        onChange={(e) => { setSearch(e.target.value) }}
                        style={{
                            width: 200,
                            marginRight: 20
                        }}
                    />
                    <AlignRightOutlined
                        style={{
                            fontSize: "24px"
                        }}
                        onClick={openModelDetails}
                    />
                </div>
            ]}
        >
            <Modal
                title="Price"
                open={openModel}
                onOk={onOkModelDetails}
                onCancel={onCancelModelDetails}
            
            > 
                <Flex vertical>
                    from: <InputNumber style={{marginBottom:20}} onChange={(e)=>{setMinPrice(e)}}></InputNumber>
                    to: <InputNumber  onChange={(e)=>{setMaxPrice(e)}}></InputNumber>
                </Flex>

            </Modal>
            {products.filter((product) => {
                if(product.price>=minPrice && product.price<=maxPrice){
                    return product.title.toLowerCase().includes(search) 
                }
            }).map((product) =>

                <Card style={{ marginTop: 16, marginLeft: 150, marginRight: 150 }} type="inner" title={product.title + " " + product.price + "€"} extra={[
                    <Button onClick={() => {
                        if (product.sellerId == localStorage.getItem("id")) {
                            navigate(`/profile/` + localStorage.getItem("email"))
                        } else {
                            navigate(`/seller/${product.sellerId}`)
                        }
                    }}>{product.name}</Button>,
                    <HeartIcon
                        onClick={() => { deleteFavorites(product.id) }}
                        style={{
                            color: 'hotpink'
                        }}
                    />,
                    <HeartOutlined onClick={() => { addToFavorites(product.id) }} style={{
                        width: 60,
                        fontSize: 25
                    }} />,
                    localStorage.getItem("id") != product.sellerId && <Button type="primary" onClick={() => { showModal(product) }}>Buy</Button>]}>
                    <Modal title="Choose cart" open={isModalOpen} onCancel={handleCancel} onOk={() => { handleOk() }}>
                        <Radio.Group onChange={onChange} value={selectedCreditCard} >
                            <Space direction="vertical">
                                {carts.map((cart) => <Radio value={cart.alias}>{cart.alias}</Radio>)}
                            </Space>
                        </Radio.Group>
                    </Modal>
                    <Image
                        width={300}
                        height={220}
                        src={backendURL + "/images/" + product.id + ".png"}
                        style={{ padding: 30 }}
                        fallback="data:image/png;base64,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"
                    />
                    {product.description}

                </Card>
            )}

        </Card>
    );

}
export default Announcements
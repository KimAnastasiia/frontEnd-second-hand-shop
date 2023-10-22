import { useEffect, useState } from "react";
import { backendURL } from "../../Global";
import { Table } from "antd";
import { Link } from "react-router-dom";
import {
    allowSubmitForm,
    modifyStateProperty,
    joinAllServerErrorMessages, setServerErrors,
    validateFormDataInputRequired
} from "../../Utils/UtilsValidations"
import { useParams, useNavigate } from "react-router-dom";
let ListPurchases = ({ openNotification }) => {
 

    let [products, setProducts] = useState([])
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        getPurchases()
    }, [])

    let getPurchases = async () => {

        let response = await fetch(backendURL + "/transactions?buyerId="+localStorage.getItem("id"),
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                },
            });
        if (response.ok) {
            let jsonData = await response.json();
            setProducts(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;

            setServerErrors(serverErrors, setFormErrors)
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }

    }
    let columns = [
        {
            title: "Seller Id",
            dataIndex: "sellerId"
        },
        {
            title: "Seller Country",
            dataIndex: "sellerCountry"
        },
        {
            title: "Seller Address",
            dataIndex: "sellerAddress",
        },
        {
            title: "Seller PostCode",
            dataIndex: "sellerPostCode",
        },
        {
            title: "Product Id",
            dataIndex: "productId",
        },
        {
            title: "Price (€)",
            dataIndex: "price",
        },
        {
            title: "Seller PaymentName",
            dataIndex: "sellerPaymentName",
        },
    ]

    return (
        <Table columns={columns} dataSource={products}></Table>
    )
}

export default ListPurchases;
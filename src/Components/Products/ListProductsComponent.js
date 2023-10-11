import { useEffect, useState } from "react";
import { backendURL } from "../../Global";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { joinAllServerErrorMessages } from "../../Utils/UtilsValidations";
import { useParams, useNavigate } from "react-router-dom";
let ListProductsComponent = (props) => {
    let { openNotification } = props

    let [products, setProducts] = useState([])
    const { id } = useParams();
    useEffect(() => {
        getProducts();
    }, [])

    let getProducts = async () => {
        let response = await fetch(backendURL+"/products/allOfUser/"+id,
        {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if ( response.ok ){
            let jsonData = await response.json();
            setProducts(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors; 
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )
        }
    }

    let columns = [
        {
            title: "Id",
            dataIndex: "id",
        },
        {
            title: "Seller Id",
            dataIndex: "sellerId"
        },
        {
            title: "Title",
            dataIndex: "title"
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Price (€)",
            dataIndex: "price",
        },
        {
            title: "Date",
            dataIndex: "date",
        },
        {
            title: "Buyer",
            dataIndex: "buyerId",
        },
        {
            title: "Actions",
            dataIndex: "id",
            render: (id) => <Link to={"/products/edit/"+id}>Edit</Link>
        },
    ]

    return (
        <Table columns={columns} dataSource={products}></Table>
    )
}

export default ListProductsComponent;
import { useEffect, useState } from "react";
import { backendURL } from "../../Global";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { joinAllServerErrorMessages } from "../../Utils/UtilsValidations";

import { useParams, useNavigate } from "react-router-dom";
let ListPurchases = ({ openNotification }) => {
 

    let [products, setProducts] = useState([])

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

export default ListPurchases;
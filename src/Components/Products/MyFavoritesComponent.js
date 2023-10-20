import { useEffect, useState } from "react";
import { backendURL } from "../../Global";
import { Button, Table } from "antd";
import { Link } from "react-router-dom";
import { joinAllServerErrorMessages } from "../../Utils/UtilsValidations";
import { useParams, useNavigate } from "react-router-dom";
let MyFavoritesComponent = ({ openNotification }) => {

    let [favorites, setFavorites] = useState([])

    useEffect(() => {
        getFavorites();
    }, [])

    let getFavorites = async () => {
        let response = await fetch(backendURL+"/favorites",
        {
            method: "GET",
            headers: {
                "apikey": localStorage.getItem("apiKey")
            },
        });

        if ( response.ok ){
            let jsonData = await response.json();
            setFavorites(jsonData)
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors; 
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )
        }
    }

    let columns = [
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
            title: "Actions",
            dataIndex: "id",
            render: (id) => <Button onClick={()=>{deleteFavorites(id)}} >Delete</Button>
        },
    ]

    const deleteFavorites = async (productId) => {

        let response = await fetch(backendURL + `/favorites/${productId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type" : "application/json ",
                "apikey": localStorage.getItem("apiKey")
            },
        })
        if (response.ok) {
            openNotification("top", "Successfull", "success")
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
        getFavorites();
    }

    return (
        <Table columns={columns} dataSource={favorites}></Table>
    )
}

export default MyFavoritesComponent;
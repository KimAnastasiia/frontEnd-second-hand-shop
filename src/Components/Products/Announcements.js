import { useEffect, useState } from "react";
import { backendURL } from "../../Global";
import { Card, Image, Typography, Button } from 'antd';
import { Link } from "react-router-dom";
import { joinAllServerErrorMessages } from "../../Utils/UtilsValidations";
import { useParams, useNavigate } from "react-router-dom";

let Announcements = ({ openNotification }) => {

    let [products, setProducts] = useState([])

    useEffect(() => {
        getProducts();
    }, [])

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
        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors;
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top", notificationMsg, "error")
        }
    }
     
    
    let buyProduct = async (id) => {

        let response = await fetch(backendURL+"/products",
        {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json ",
                "apikey": localStorage.getItem("apiKey")
            },
            body: JSON.stringify({
                buyerId:localStorage.getItem("id"), 
                id:id
            })
        });

        if ( response.ok ){
            let jsonData = await response.json();
            openNotification("top","Successfully purchased", "success" )

        } else {
            let responseBody = await response.json();
            let serverErrors = responseBody.errors; 
            let notificationMsg = joinAllServerErrorMessages(serverErrors)
            openNotification("top",notificationMsg, "error" )
        }
        getProducts();
    }
    return (
        <Card title="Card title">



            {products.map((product) =>

                <Card style={{marginTop: 16, marginLeft:150, marginRight:150}} type="inner" title={product.title+" "+ product.price+"€"} extra={localStorage.getItem("id")!=product.sellerId && <Button type="primary" onClick={()=>{buyProduct(product.id)}}>Buy</Button>}>
                    
                    <Image
                        width={300}
                        height={200}
                        src={backendURL + "/images/" + product.id + ".png"}
                        tyle={{margin: 0,padding:0}}
                        style={{padding:30}}
                    />
                   {product.description}
                 
                </Card>)}

        </Card>
    );

}
export default Announcements
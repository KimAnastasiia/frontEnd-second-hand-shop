
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import "antd/dist/reset.css"
import { Layout, Menu, notification } from "antd"
import { useEffect, useState } from "react";

import CreaUserComponent from "./Components/Users/CreateUserComponent";
import LoginUserComponent from "./Components/Users/LoginUserComponent";
import CreateProductComponent from "./Components/Products/CreateProductComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import EditProductComponent from "./Components/Products/EditProductComponent";
import { backendURL } from "./Global";
import Announcements from "./Components/Products/Announcements";
import ProfileUser from "./Components/Users/ProfileUser";
import EditUserInfo from "./Components/Users/EditUserInfo";
import ListPurchases from "./Components/Products/ListPurchases";
import MyFavoritesComponent from "./Components/Products/MyFavoritesComponent";
import SellersProfiles from "./Components/Users/SellersProfiles";


let App = () => {
  let navigate = useNavigate()
  let location = useLocation()
  let [login, setLogin] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    checkLoginIsActive();
    checkUserAcces();
  }, [])

  let checkUserAcces = async () => {
    let href = location.pathname
    if ( !["/login","/register"].includes(href) && !login){
      navigate("/login")
    }
  }

  let checkLoginIsActive = async () => {
    if(localStorage.getItem("apiKey") == null){
      setLogin(false);
      return;
    }

    let response = await fetch(backendURL+"/users/isActiveApiKey",
    {
        method: "GET",
        headers: {
            "apikey": localStorage.getItem("apiKey")
        }
    });

    if ( response.ok ){
      let jsonData = await response.json();
      setLogin(jsonData.activeApiKey)

      if (!jsonData.activeApiKey){
        navigate("/login")
      }

    } else {
      setLogin(false)
      navigate("/login")
    }  
  }


  const openNotification = (placement, text, type) => {
    api[type]({
      message: 'Notification',
      description: text,
      placement,
    });
  };

  let disconnect = async () => {
    let response = await fetch(backendURL+"/users/disconnect",
    {
        method: "GET",
        headers: {
            "apikey": localStorage.getItem("apiKey")
        }
    });

    localStorage.removeItem("apiKey");
    setLogin(false)
    navigate("/login")
  }


  let { Header, Content, Footer } = Layout;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Header>
        {!login &&
          <Menu theme="dark" mode="horizontal" items={[
            { key: "menuIndex", label: <Link to="/">Index</Link> },
            { key: "menuRegister", label: <Link to="/register">Register</Link> },
            { key: "menuLogin", label: <Link to="/login">Login</Link> },
          ]}>
          </Menu>
        }

        {login &&
          <Menu theme="dark" mode="horizontal" items={[
            { key: "menuIndex", label: <Link to="/">Index</Link> },
            { key: "menuProfile", label: <Link to={"/profile/"+localStorage.getItem("email")}>Profile</Link> },
            { key: "menuCreateProduct", label: <Link to="/products/create">Sell</Link> },
            { key: "menuProducts", label: <Link to={"/products/"+localStorage.getItem("id")}>My products</Link> },
            { key: "menuAllAnnouncements", label: <Link to="/announcements" >All announcements</Link> },
            { key: "menuListPurchases", label: <Link to="/myPurchases" >All Purchases</Link> },
            { key: "menuListFavorites", label: <Link to="/favorites" >List of favorites</Link> },
            { key: "menuDisconnect", label: <Link to="#" onClick={disconnect} >Disconnect</Link> },
          ]}>
          </Menu>
        }

      </Header>

      <Content style={{ padding: "20px 50px" }}>
        <Routes>
          <Route path="/register" element={
            <CreaUserComponent openNotification={openNotification} />
          }></Route>
          <Route path="/login" element={
            <LoginUserComponent setLogin={setLogin} openNotification={openNotification} />
          }></Route>
          <Route path="/" element={
            <p>Inicio</p>
          }></Route>
          <Route path="/products/create" element={
            <CreateProductComponent openNotification={openNotification} />
          }></Route>
          <Route path="/products/:id" element={
            <ListProductsComponent openNotification={openNotification} />
          }></Route>
          <Route path="/products/edit/:id" element={
            <EditProductComponent openNotification={openNotification} />
          }></Route>
          <Route path="/announcements" element={
            <Announcements openNotification={openNotification} />
          }></Route>
          <Route path="/profile/:email" element={
            <ProfileUser openNotification={openNotification} />
          }></Route>
          <Route path="profile/:email/edit" element={
            <EditUserInfo openNotification={openNotification} />
          }></Route>
          <Route path="/myPurchases" element={
            <ListPurchases openNotification={openNotification} />
          }></Route>
          <Route path="/favorites" element={
            <MyFavoritesComponent openNotification={openNotification} />
          }></Route>
          <Route path="/seller/:sellerId" element={
            <SellersProfiles openNotification={openNotification} />
          }></Route>
        </Routes>
      </Content>

      <Footer style={{ textAlign: "center" }}> My Website</Footer>

    </Layout>
  );
}

export default App;

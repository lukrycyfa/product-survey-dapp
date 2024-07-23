import React, { useEffect, useState, useCallback } from "react";
import { Container, Nav } from "react-bootstrap";
import "./App.css";
import "./index.css";
import Wallet from "./components/Wallet";
import Survey from "./components";
import Cover from "./components/utils/Cover";
import coverImg from "./assets/img/sandwich.jpg"
import { login, logout as destroy } from "./utils/auth";
import { Toaster } from "react-hot-toast";

const App = function AppWrapper() {

  const isAuthenticated = window.auth.isAuthenticated;
  const principal = window.auth.principalText;

  return (
    <>

      {isAuthenticated ? (
        <Container fluid>
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet
                principal={principal}
                balance={'--'}
                symbol={"ICP"}
                isAuthenticated={isAuthenticated}
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          <main>
            <Survey />
          </main>
          <Toaster 
            
          />
        </Container>
       ) : (
        <Cover name="Product Survey DAPP" login={login} coverImg={coverImg} />
      )} 
    
    </>
  );
};

export default App;

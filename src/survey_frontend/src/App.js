import React, { useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import "./App.css";
import "./index.css";
import Wallet from "./components/Wallet";
import Survey from "./components";
import { login, logout as destroy } from "./utils/auth";
import { Toaster } from "react-hot-toast";

const App = function AppWrapper() {

  // const isAuthenticated = window.auth.isAuthenticated;
  // const principal = window.auth.principalText;

  // const [balance, setBalance] = useState("0");

  // const getBalance = useCallback(async () => {
  //   if (isAuthenticated) {
  //     setBalance(await principalBalance());
  //   }
  // });

  // useEffect(() => {
  //   getBalance();
  // }, [getBalance]);
  return (
    <>

    {/* <Notification /> */}
      {/* {isAuthenticated ? ( */}
        <Container fluid>
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              <Wallet
                principal={"principal"}
                balance={25}
                symbol={"ICP"}
                // isAuthenticated={isAuthenticated}
                isAuthenticated={true}
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          <main>
            <Survey />
          </main>
          <Toaster />
        </Container>
      {/* ) : (
        <Cover name="Street Food" login={login} coverImg={coverImg} />
      )} */}
    
      {/* <main>
        <div className="watermark">Dai</div>
        <Survey />
      </main>
      <Toaster /> */}
    </>
  );
};

export default App;

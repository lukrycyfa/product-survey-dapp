// imported dependencies
import React, { useEffect, useState, useCallback } from "react";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";
// import Event from "./Event";
// import PurchasedTicket from "./PurchasedTicket";
import Loading from "./Loading";
// import useApi from "../hooks/useApi";
// import { login, logout } from "../utils/auth";
import { Row, Card, Stack, Modal, Button, Nav, Navbar, Container } from "react-bootstrap";
// import { NotificationSuccess, NotificationError } from "./utils/Notifications";
import Product from "./Product";
import UserSurveys from "./UserSurveys";

import { getSurveys as retriveSurvey, createAccount } from "../utils/survey";

export default function Survey() {

  const [_surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);


  // function to get the list of products
  const getSurveys = useCallback(async () => {
    try {
      setLoading(true);
      setSurveys (await retriveSurvey());
      // toast.loading("You are not authenticated, You are not authenticated, You are not authenticated");
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);


  const regAccount = async () => {
    try {
      setLoading(true);
      const _create = await createAccount();
      // if (_tickets.Err) return;
      // setTickets(_tickets.Ok.tickets);
      toast.success("account created successfully");
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSurveys();
  }, [getSurveys]);

  return (
    <>
      {!loading ? (
        <>


          <Card className="text-center rounded-2 border-info shadow-lg bg-dark">
            <Card.Header className="text-white justify-content-center">
            <Stack direction="horizontal" gap={4}>
            <Card.Title >
              Survey Products
            </Card.Title>
            <UserSurveys getsurveys={getSurveys} />
            <Button
              onClick={() => regAccount()}
              className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            >
              CreateAccount
            </Button>
            </Stack>

            </Card.Header>
            <Card.Body>
              <Row xs={1} sm={1} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">

                {_surveys.map((_sur, idx) => (
                  <Product
                    key={idx}
                    product={_sur}
                    _loading={loading}
                  />
                ))}
              </Row>
            </Card.Body>
            <Card.Footer className="text-muted">..........</Card.Footer>
          </Card>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};


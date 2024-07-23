// imported dependencies
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Loader from "./utils/Loader";
import { Row, Card, Stack, Button } from "react-bootstrap";
import Product from "./Product";
import UserSurveys from "./UserSurveys";
import { getSurveys as retriveSurvey, createAccount } from "../utils/survey";

// The Survey construct 
export default function Survey() {
  // _surveys and loading state variables
  const [_surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);

  // get al surveys from canister
  const getSurveys = useCallback(async () => {
    try {
      setLoading(true);
      const _sur = await retriveSurvey();
      setSurveys(_sur);
    } catch (error) {
      toast.error(`${error}`, { duration: 100000 })
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  // create a new user account
  const regAccount = async () => {
    try {
      setLoading(true);
      const _create = await createAccount();
      toast.success(`${_create.message}`);
    } catch (error) {
      console.log({ error });
      toast.custom(`${error}`, { duration:10000})
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSurveys();
  }, [getSurveys]);

  return (
    <>

      <Card className="text-center rounded-2 border-info shadow-lg bg-dark">
        <Card.Header className="text-white justify-content-center">
          {!loading ? (
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
          ) : (
            <Loader />
          )}
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


  );
};


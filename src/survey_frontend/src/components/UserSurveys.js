// imported dependencies
import React, { useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Button, Modal, Stack, Carousel, Container, Col, Row, Card, Badge } from "react-bootstrap";

// import Loader from "./utils/Loader";
import Loading from "./Loading";
import { NotificationSuccess, NotificationError } from "./utils/Notifications";
import SurveyProduct from "./Surveyproduct";
import AddProduct from "./Addproduct";

import { getUsersSurveys, addSurveyQuestion, addProduct, updateProduct, addClassifier,
  deleteAccount, deleteProduct, deleteClassifierExample, deleteSurveyQuestion
  } from "../utils/survey";

// The ManageEvent construct taking the getevents function as --prop
export default function UserSurveys({ getsurveys }) {
// const ManagedEvents = ({ getevents }) => {

  //manageevents, loading 
  const [_surveys, setSurveys] = useState([]);
  const [_examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(false);

  // managedevent  modal state 
  const [show, setShow] = useState(false);
  const [_show, _setShow] = useState(false);
  // managedevent modal state toggler
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const _handleClose = () => _setShow(false);
  const _handleShow = () => _setShow(true);

  // get all managed event
  const getAllSurveys = async () => {
    try {
      setLoading(true);
      // call the canister
      const _mgmsurveys = await getUsersSurveys();
      setSurveys(_mgmsurveys.products)
      setExamples(_mgmsurveys.classifierExamples)
      // if (_mgmevents.Err) return;
      // setManagedEvents(_mgmevents.Ok.events);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  // add an event
  const createProduct = async (data) => {
    try {
      setLoading(true);
      const _create = await addProduct(data)
      // if (_create.Err) {
      //   toast(<NotificationError text={`${_create.Err.NotFound}`} />);
      //   return;
      // }
      getAllSurveys();
      toast(<NotificationSuccess text="Event added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a Event." />);
    } finally {
      setLoading(false);
    }
  };

  const patchProduct = async (id, data) => {
    try {
      setLoading(true);
      const _update = await updateProduct(id, data)
      // if (_create.Err) {
      //   toast(<NotificationError text={`${_create.Err.NotFound}`} />);
      //   return;
      // }
      getAllSurveys();
      toast(<NotificationSuccess text="Event added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a Event." />);
    } finally {
      setLoading(false);
    }
  };

  // update an event
  const addQuestion = async (pId, data, classexamples) => {
    try {
      setLoading(true);
      const _add = await addSurveyQuestion(pId, data);
      for (i of classexamples) await addClassifier(i);
      // if (_update.Err) {
      //   toast(<NotificationError text={`${_update.Err.NotFound}`} />);
      //   return;
      // }
      getAllSurveys();
      toast(<NotificationSuccess text="Event Updated successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Update Event." />);
    } finally {
      setLoading(false);
    }
  };

  // delete an event
  const deleteQuestion = async (pId, qId) => {
    setLoading(true);
    try {
      // call the canister
      const _delete = await deleteSurveyQuestion(pId, qId);
      // if (_delete.Err) {
      //   toast(<NotificationError text={`${_delete.Err.NotFound}`} />);
      //   return;
      // }
      getAllSurveys();
      toast(<NotificationSuccess text="Event Delete successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Delete Event." />);
    } finally {
      setLoading(false);
    }
  };

  const deleteExample = async (iDx) => {
    setLoading(true);
    try {
      // call the canister
      const _delete = await deleteClassifierExample(iDx);
      // if (_delete.Err) {
      //   toast(<NotificationError text={`${_delete.Err.NotFound}`} />);
      //   return;
      // }
      getAllSurveys();
      toast(<NotificationSuccess text="Event Delete successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Delete Event." />);
    } finally {
      setLoading(false);
    }
  };

  const eraseProduct = async (pId) => {
    setLoading(true);
    try {
      // call the canister
      const _delete = await deleteProduct(pId);
      // if (_delete.Err) {
      //   toast(<NotificationError text={`${_delete.Err.NotFound}`} />);
      //   return;
      // }
      getAllSurveys();
      toast(<NotificationSuccess text="Event Delete successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Delete Event." />);
    } finally {
      setLoading(false);
    }
  };


  const eraseAccount = async (pId) => {
    setLoading(true);
    try {
      // call the canister
      const _delete = await deleteAccount();
      // if (_delete.Err) {
      //   toast(<NotificationError text={`${_delete.Err.NotFound}`} />);
      //   return;
      // }
      toast(<NotificationSuccess text="Event Delete successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to Delete Event." />);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Button
        onClick={() => {
          getAllSurveys()
          handleShow()
        }}
        className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
      >
        ManagedProducts
      </Button>
      <Modal show={show} onHide={handleClose} size="lg" centered scrollable={true} backdrop={true} >
        <Modal.Header closeButton={!loading}>
          <Stack direction="horizontal" gap={3}>
            <Modal.Title>Users Products</Modal.Title>
          </Stack>
        </Modal.Header>
        <Modal.Body className="rounded-2 border-info shadow-lg bg-dark" >
          {!loading ? (
            <>
              <Container>
                <Carousel slide variant="dark" pause interval={null} indicators={false}
                 wrap={false}
                  prevIcon={<Button variant="primary"><i className="bi bi-arrow-left me-2 fs-2" /></Button>}
                  nextIcon={<Button variant="primary"><i className="bi bi-arrow-right me-2 fs-2" /></Button>}
                >
                  {_surveys.map((_sur, idx) => (
                    <Carousel.Item key={idx}>
                      <Row >
                        <Col xs={6} md={2} bg="info">
                        </Col>
                        <Col xs={12} md={8}>
                          <SurveyProduct
                            product={_sur}
                            addquestion={addQuestion}
                            deleteproduct={eraseProduct}
                            deletequestion={deleteQuestion}
                            updateproduct={patchProduct}
                            loading={loading}
                          />
                        </Col>
                        <Col xs={6} md={2}>
                        </Col>
                      </Row>
                    </Carousel.Item>
                  ))}
                </Carousel>

              </Container>
            </>
          ) : (
            <Loading />
          )}
        </Modal.Body>
        <Modal.Footer>
          {!loading && (
            <>
          <AddProduct  addproduct={createProduct}/>
          <Button
            onClick={() => {
              getAllSurveys()
              _handleShow()
            }}
            className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
          >
            Examples
          </Button>
          <Button 
            className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            onClick={() => eraseAccount()}
            >
              Close Account
            </Button>
          <Button 
          className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
          onClick={() => {
            handleClose();
            getsurveys();
          }
          }>
            Close
          </Button> 
          </>
        )}
        </Modal.Footer>
      </Modal>

      <Modal show={_show} onHide={_handleClose} size="md" centered scrollable={true} backdrop={true}>
          <Modal.Header closeButton={!loading}>
            <Modal.Title>Examples</Modal.Title>
          </Modal.Header>
          <Modal.Body className="rounded-2 border-info bg-dark shadow-lg">
            <Col xs={1} sm={1} lg={3} className="g-3 flex flex-nowrap mb-5 g-xl-4 g-xxl-5 w-100">
              {_examples.map((ex, idx) => (

                <Row key={idx} className="g-3 mb-5 ">
                  <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
                    <Card.Header>
                      <Stack direction="horizontal" gap={2}>
                        <Badge bg="secondary" className="ms-auto">

                          {/* Ticket Price {(Number(tic.cost) / 10 ** 8).toString()} ICP */}
                        </Badge>
                      </Stack>
                    </Card.Header>
                    <Card.Body className="d-flex  flex-column text-center">
                      {/* <Card.Title className="text-white">{tic.title}</Card.Title> */}
                      <Card.Text className="text-white"><i className="bi bi-info-circle-fill"></i>{ex.label}</Card.Text>
                      <Card.Text className="text-white"><i className="bi bi-info-circle-fill"></i>{ex.text}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <Button 
                      onClick={() => deleteExample(idx)}
                      variant="danger"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </Button>

                    </Card.Footer>
                  </Card>
                </Row>

              ))}
            </Col>
          </Modal.Body>
          <Modal.Footer>
            {!loading && (<Button variant="outline-secondary" onClick={_handleClose}>
              Close
            </Button>)}
          </Modal.Footer>
        </Modal>
    </>
  );
};

UserSurveys.propTypes = {
  getsuserssurveys: PropTypes.func.isRequired
};



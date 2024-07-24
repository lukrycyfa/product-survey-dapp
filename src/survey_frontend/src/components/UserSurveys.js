// imported dependencies
import React, { useState } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import Loader from "./utils/Loader";
import SurveyProduct from "./Surveyproduct";
import { Principal } from "@dfinity/principal";
import AddProduct from "./Addproduct";
import { Button, Modal, Stack, Carousel, Container, Col, Row, Card, Badge } from "react-bootstrap";
import {
  getUsersSurveys, addSurveyQuestion, addProduct, updateProduct, addClassifier,
  deleteAccount, deleteProduct, deleteClassifierExample, deleteSurveyQuestion, getClassifierExamples
} from "../utils/survey";

// The UserSurveys construct taking the getsurveys  function as --prop
export default function UserSurveys({ getsurveys }) {
  // the _survey, _examples, user and loading state variable's
  const [_surveys, setSurveys] = useState([]);
  const [_examples, setExamples] = useState([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  // User's Products And Classification example  modal state's 
  const [show, setShow] = useState(false);
  const [_show, _setShow] = useState(false);
  // User's Products And Classification example modal state toggler
  const handleClose = () => { setShow(false); getsurveys(); }
  const handleShow = () => setShow(true);

  const _handleClose = () => {
    if(loading) return;
    _setShow(false)};
  const _handleShow = () => _setShow(true);

  // get all users surveys
  const getAllSurveys = async () => {
    try {
      setLoading(true);
      // call the canister
      const _mgmsurveys = await getUsersSurveys();
      if (_mgmsurveys.message != undefined) { toast.error(`${_mgmsurveys.message}`); return; }
      setSurveys(_mgmsurveys.products)
      setExamples(_mgmsurveys.classifierExamples)
      setUser(Principal.from(JSON.stringify(_mgmsurveys.user)).toString())
    } catch (error) {
      console.log(error);
      toast.error(error.message != undefined ? error.message : JSON.stringify(error))
    } finally {
      setLoading(false);
    }
  };

  // create a new product
  const createProduct = async (data) => {
    try {
      setLoading(true);
      // call the canister
      const _create = await addProduct(data)
      getAllSurveys();
      toast(`${_create.message}`, { duration: 10000 })
    } catch (error) {
      console.log(error);
      toast.error(error.message != undefined ? error.message : JSON.stringify(error))
    } finally {
      setLoading(false);
    }
  };

  // update a product
  const patchProduct = async (id, data) => {
    try {
      setLoading(true);
      // call the canister
      const _update = await updateProduct(id, data)
      getAllSurveys();
      toast(`${_update.message}`, { duration: 10000 })
    } catch (error) {
      console.log(error);
      toast.error(error.message != undefined ? error.message : JSON.stringify(error))
    } finally {
      setLoading(false);
    }
  };

  //  add a survey question
  const addQuestion = async (pId, qst, ans, classexamples) => {
    try {
      setLoading(true);
      // call the canister
      const exes = await getClassifierExamples(user);
      // ommit existing example from been added
      for (let ele of classexamples) {
        if (exes.findIndex((el) => el.text == ele.text) < 0) {
          await addClassifier(ele)
        }
      }
      const _add = await addSurveyQuestion(pId, { "question": qst, "possibleoptions": ans });
      getAllSurveys();
      toast(`${_add.message}`, { duration: 10000 })
    } catch (error) {
      console.log(error);
      toast.error(error.message != undefined ? error.message : JSON.stringify(error))
    } finally {
      setLoading(false);
    }
  };

  // delete a survey question
  const deleteQuestion = async (pId, qId) => {
    setLoading(true);
    try {
      // call the canister
      const _delete = await deleteSurveyQuestion(pId, qId);
      getAllSurveys();
      toast(`${_delete.message}`, { duration: 10000 })
    } catch (error) {
      console.log(error);
      toast.error(error.message != undefined ? error.message : JSON.stringify(error))
    } finally {
      setLoading(false);
    }
  };

  // delete an example
  const deleteExample = async (iDx) => {
    setLoading(true);
    try {
      // call the canister
      const _delete = await deleteClassifierExample(iDx);
      getAllSurveys();
      toast(`${_delete.message}`, { duration: 10000 })
    } catch (error) {
      console.log(error);
      toast.error(error.message != undefined ? error.message : JSON.stringify(error))
    } finally {
      setLoading(false);
    }
  };

  // delete a product
  const eraseProduct = async (pId) => {
    setLoading(true);
    try {
      // call the canister
      const _delete = await deleteProduct(pId);
      getAllSurveys();
      toast(`${_delete.message}`, { duration: 10000 })
    } catch (error) {
      console.log(error);
      toast.error(error.message != undefined ? error.message : JSON.stringify(error))
    } finally {
      setLoading(false);
    }
  };

  // delete a user's account
  const eraseAccount = async (pId) => {
    setLoading(true);
    try {
      // call the canister
      const _delete = await deleteAccount();
      handleClose()
      toast(`${_delete.message}`, { duration: 10000 })
    } catch (error) {
      console.log(error);
      toast.error(error.message != undefined ? error.message : JSON.stringify(error))
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
        {!loading ? (<Modal.Header >
          <Modal.Title>Users Products</Modal.Title>
          <Button
            className="btn  btn-sm rounded-3 border border-warning shadow-lg display-4 fw-bold text-body-emphasis"
            disabled={loading}
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </Button>
        </Modal.Header>) : (<Loader />)}
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
            <Loader />
          )}
        </Modal.Body>
        <Modal.Footer>
          {!loading && !!user && (
            <>
              <AddProduct addproduct={createProduct} />
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
                }
                }>
                Close
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal show={_show} onHide={_handleClose} size="md" centered scrollable={true} backdrop={true}>
        {!loading ? (<Modal.Header closeButton={!loading}>
          <Modal.Title>Classification Examples</Modal.Title>
        </Modal.Header>) : (<Loader />)}
        <Modal.Body className="rounded-2 border-info bg-dark shadow-lg">
          <Col xs={1} sm={1} lg={3} className="g-3 flex flex-nowrap mb-5 g-xl-4 g-xxl-5 w-100">
            {_examples.map((ex, idx) => (

              <Row key={idx} className="g-3 mb-5 ">
                <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
                  <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                      <Badge bg="secondary" className="ms-auto">

                      </Badge>
                    </Stack>
                  </Card.Header>
                  <Card.Body className="d-flex  flex-column text-center">
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
  getsurveys: PropTypes.func.isRequired
};



// imported dependencies
import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import toast from "react-hot-toast";
import Loader from "./utils/Loader";
import SurveyTab from "./Surveytab";
import PropTypes from "prop-types";
import { Principal } from "@dfinity/principal";
import { Button, Modal, Stack, Carousel, Container, Col, Row, Card, Badge } from "react-bootstrap";
import { takeSurvey } from "../utils/survey";

// The Product construct taking a product instance and a _loading variable as --props
export default function Product({ product, _loading }) {
  // the product instance
  const { id, owner, name, imageUrl, description, survey } = product;

  // the surveyQuestion, _currentResponse and _currentQuestion state variable
  const [surveyQuestion, setSurveyQuestion] = useState([]);
  const [_currentResponse, setCurrentResponse] = useState("");
  const [_currentQuestion, setCurrentQuestion] = useState("");
  const _owner = Principal.from(JSON.stringify(owner)).toString();

  // an instance of the useApi hook
  const { loading, setLoading, getEvaluation, userFeedBack } = useApi(_owner);

  // Product and Default Question modal state 
  const [show, setShow] = useState(false);
  const [_show, _setShow] = useState(false);

  // Product and Default Question modal state toggler's
  const handleClose = () => {
    if (loading) return;
    setShow(false)
  };

  const handleShow = () => {
    setShow(true)
    userFeedBack.splice(0, userFeedBack.length)
    setCurrentResponse("")
  };

  const _handleShow = () => _setShow(true);
  const _handleClose = () => _setShow(false);


  // submit a survey to the canister
  const submitSurvey = async () => {
    try {
      setLoading(true);
      const _take = await takeSurvey(_owner, id, userFeedBack);
      toast(`${_take.message}`, { duration: 7000 })
      userFeedBack.splice(0, userFeedBack.length)
      handleClose()
    } catch (error) {
      console.log(error);
      toast.error(JSON.stringify(error), { duration: 8000 })
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    try {
      setSurveyQuestion(survey.questions)
    } catch (error) {
      console.log(error)
    }
  }, [survey])

  return (
    <Col key={id}>
      <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-white">{_owner.slice(0, 15)}...</span>
            <Badge bg="secondary" className="ms-auto">
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={imageUrl} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title className="text-white">{name}</Card.Title>
          <Card.Text className="flex-grow-1 text-white "><i className="bi bi-info-circle-fill"></i>{description}</Card.Text>
          <Card.Text className="flex-grow-2">
            <Button
              disabled={_loading || loading}
              onClick={() => _handleShow()}
              variant="dark"
              className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            >
              Take Survey
            </Button>
            <Modal show={show} onHide={handleClose} size="lg" centered scrollable={true} backdrop={true} >
              {!loading ? (<Modal.Header closeButton={!loading}>
                <Modal.Title>Survey In Progress</Modal.Title>
              </Modal.Header>) : (<Loader />)}
              <Modal.Body className="rounded-2 border-info bg-dark shadow-lg" >
                <Container>
                  <Carousel slide variant="dark" pause indicators={false} interval={null}
                    controls={!loading}
                    wrap={false}

                    prevIcon={<Button onClick={() => { setCurrentResponse("") }} variant="primary"><i className="bi bi-arrow-left me-2 fs-2" /></Button>}
                    nextIcon={loading || !_currentResponse ? null : <Button
                      onClick={() => {
                        setCurrentResponse("")
                      }} variant="primary"><i className="bi bi-arrow-right me-2 fs-2" /></Button>} >
                    {surveyQuestion.map((que, idx) => (
                      <Carousel.Item key={idx}>
                        <Row >
                          <Col xs={6} md={2} bg="info">
                          </Col>
                          <Col xs={12} md={8}>
                            <SurveyTab
                              _question={que}
                              setcurrentresponse={setCurrentResponse}
                              setcurrentquestion={setCurrentQuestion}
                              getevaluation={getEvaluation}
                            />
                          </Col>
                          <Col xs={6} md={2}>
                          </Col>
                        </Row>

                      </Carousel.Item>
                    ))}
                  </Carousel>

                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-secondary"
                  disabled={loading}
                  onClick={() => {
                    handleClose()
                  }}>
                  Close
                </Button>
                <Button variant="outline-secondary"
                  disabled={surveyQuestion.length > 1 ? userFeedBack.length != surveyQuestion.length :
                    _currentResponse.length <= 0 || loading}
                  onClick={async () => {
                    surveyQuestion.length == 1 ? await getEvaluation(_currentQuestion, _currentResponse) : null;
                    submitSurvey();
                  }}>
                  Submit Survey
                </Button>
              </Modal.Footer>
              <Modal.Footer>
              <span className="text-white">
                After the evaluation of the last question 
                the submit button will be available.
              </span>
              </Modal.Footer>
            </Modal>
          </Card.Text>
          <Modal show={_show} onHide={_handleClose} size="md" centered scrollable={true} backdrop={true} >
            {!loading ? (<Modal.Header closeButton={!loading}>
              <Modal.Title>Have You Used This Product Before ?</Modal.Title>
            </Modal.Header>) : (<Loader />)}
            <Modal.Body className="rounded-2 border-info bg-dark shadow-lg" >
              <Card.Title className="text-white text-center">
                <Button variant="outline-secondary"
                  disabled={loading}
                  onClick={() => {
                    handleShow()
                    _handleClose()
                  }}>
                  YES
                </Button>
                <span>
                  {'---'}
                </span>
                <Button variant="outline-secondary"
                  disabled={loading}
                  onClick={() => _handleClose()}>
                  NO
                </Button>
              </Card.Title>

            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Col>
  );
};

Product.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
  _loading: PropTypes.bool.isRequired
};

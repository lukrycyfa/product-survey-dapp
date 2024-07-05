import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import toast from "react-hot-toast";
import Loading from "./Loading";
import SurveyTab from "./Surveytab";



import PropTypes from "prop-types";
// import { Card, Button, Col, Badge, Stack, Modal, Row } from "react-bootstrap";
import { Button, Modal, Stack, Carousel, Container, Col, Row, Card, Badge } from "react-bootstrap";

// import { Principal } from "@dfinity/principal";


import { takeSurvey } from "../utils/survey";

// The Event construct taking an event instance and a buyticket function as --props
export default function Product({ product, _loading }) {


  // an event instance
  const { id, owner, name, imageUrl, description, survey } = product;

  // an event ticketclasses state variable
  const [surveyQuestion, setSurveyQuestion] = useState([]);
  const [_currentResponse, setCurrentResponse] = useState("")
  const [_currentQuestion, setCurrentQuestion] = useState("")
  
  const {getEvaluation, setUserFeedBack, setLoading, userFeedBack, loading, error} = useApi()


  // event tickets modal state 
  const [show, setShow] = useState(false);
  // event tickets modal state toggler
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const submitSurvey = async () => {
    try {
      setLoading(true);
      const _take = await takeSurvey(owner, id, userFeedBack);
      console.log(_take)
      // const _tickets = await getAttendeeTickets();
      // if (_tickets.Err) return;
      // setTickets(_tickets.Ok.tickets);

    } catch (error) {
      console.log({ error });
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
            {/* <span className="font-monospace text-white">{Principal.from(manager).toText().slice(0, 17)}...</span> */}
            <span className="font-monospace text-white">{owner.slice(0, 17)}...</span>
            <Badge bg="secondary" className="ms-auto">
              {/* {soldOut.toString()} SoldOut Tickets */}
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
              onClick={ () => {handleShow()
                setUserFeedBack([])
              }}
              variant="dark"
              className="btn btn-primary btn-md rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            >
              Take Survey
            </Button>
            <Modal show={show} onHide={handleClose} size="lg" centered scrollable={true} backdrop={true} >
            <Modal.Header closeButton={!loading}>
              <Stack direction="horizontal" gap={3}>
                <Modal.Title>Survey In Progress </Modal.Title>
              </Stack>
            </Modal.Header>
            <Modal.Body className="rounded-2 border-info bg-dark shadow-lg" >
              {!loading ? (
                <>
                  <Container>
                    <Carousel slide variant="dark" pause indicators={false} interval={null}
                      controls={!!_currentResponse}
                      wrap={false}
                      
                      prevIcon={<Button onClick={()=>{ setCurrentResponse("")}} variant="primary"><i className="bi bi-arrow-left me-2 fs-2" /></Button>}
                      nextIcon={ !_currentResponse ?  null : <Button 
                        onClick={()=> { 
                          // getEvaluation(_currentQuestion, _currentResponse)
                        setCurrentResponse("")  
                      }} variant="primary"><i className="bi bi-arrow-right me-2 fs-2" /></Button>}
                    >
                    { surveyQuestion.map((que, idx) => (
                      <Carousel.Item key={idx}>
                        <Row >
                        <Col xs={6} md={2} bg="info">
                        </Col>
                        <Col xs={12} md={8}>
                        <SurveyTab
                        _question={que}
                        setcurrentresponse={setCurrentResponse}
                        setcurrentquestion={setCurrentQuestion}
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
            <Button variant="outline-secondary"
              disabled={loading} 
                  onClick={ () => {
                    handleClose()
                    setUserFeedBack([])
                  }}>
                  Close
            </Button>
            <Button variant="outline-secondary" 
                disabled={userFeedBack.length != surveyQuestion.length || loading} 
                onClick={ () => {
                  submitSurvey()
                }}>
                Submit Survey
            </Button>
            </Modal.Footer>
          </Modal>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

Product.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
  _loading: PropTypes.bool.isRequired
};

// export default Event;

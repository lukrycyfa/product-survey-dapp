// imported dependencies
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack, Modal, Row, CardHeader } from "react-bootstrap";
import Loading from "./Loading";
import { Principal } from "@dfinity/principal";
import AddQuestion from "./Addquestion";
import UpdateProduct from "./UpdateProduct";

// The ManageEvent construct taking an event instance, addticket, updateticket, publishevent, deleteticket, updateevent and deleteevent functions as --props



export default function SurveyProduct({ product, addquestion, deletequestion, deleteproduct, updateproduct, loading}) {

  // an event instance
  const { id, owner, name, imageUrl, description, survey } = product;

  // an event ticketclasses and purchased tickets state variable's
  const [surveyQuestion, setSurveyQuestion] = useState([]);
  const [surveyFeedBack, setSurveyFeedBack] = useState([]);


  // an event purchased tickets and ticketclasses modal state 
  const [show, setShow] = useState(false);
  const [_show, _setShow] = useState(false);

  // an event purchased tickets and ticketclasses modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const _handleClose = () => _setShow(false);
  const _handleShow = () => _setShow(true);

  useEffect(() => {
    try {
      setSurveyQuestion(survey.questions)
      setSurveyFeedBack(survey.feedbacks)
    } catch (error) {
      console.log(error)
    }
  }, [survey])

  return (
    <Col key={id}>
      <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            {/* <span className="font-monospace text-white">{Principal.from(manager).toText().slice(0, 25)}...</span> */}
            <span className="font-monospace text-white">{owner.slice(0, 25)}...</span>
           {!loading ? ( 
            <>
          <UpdateProduct product={product} updateproduct={updateproduct} />
           <Badge bg="secondary" className="ms-auto">
            {name}
            </Badge>
            </>):(<Loading/>)}
          </Stack>
        </Card.Header>
        <Card.Img src={imageUrl} alt={name} width="80%" height="260px" style={{ objectFit: "strech" }} />

        {/* <div className=" ratio ratio-4x3">
          <img src={imageUrl} alt={name}  style={{ objectFit: "cover" }} />
        </div> */}
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title className="text-white">{name}</Card.Title>
          <Card.Text className="flex-grow-1 text-white"><i className="bi bi-info-circle-fill"></i>{description}</Card.Text>
        </Card.Body>
        <Card.Footer >
          <Stack direction="horizontal" gap={3}>
            {!loading && (
             <> 
            <Button
              onClick={() => deleteproduct(id)}
              variant="danger"
              className="rounded-pill px-0"
              style={{ width: "38px" }}
            >
              <i className="bi bi-trash-fill"></i>
            </Button>
            <Button
              onClick={handleShow}
              variant="dark"
              className="btn btn-primary btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            >
              Questions
            </Button>
            <Button
              onClick={_handleShow}
              variant="dark"
              className="btn btn-primary btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            >
              FeedBacks
            </Button>
            <AddQuestion addquestion={addquestion} />
            </>
            )}
          </Stack>
        </Card.Footer>
        <Modal show={show} onHide={handleClose} size="xl" centered scrollable={true} backdrop={true} >
          <Modal.Header closeButton={!loading}>
            <Modal.Title>Survey Question</Modal.Title>
          </Modal.Header>
          <Modal.Body className="rounded-2 border-info bg-dark shadow-lg">

            <Row xs={1} sm={1} lg={3} className="g-3 flex flex-nowrap mb-5 g-xl-4 g-xxl-5">
              {surveyQuestion.map((que, idx) => (
                <Col key={idx}>
                  <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
                    <Card.Header>
                      <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary"></span>
                        <Badge bg="secondary" className="ms-auto">
                          {/* Ticket Price {(Number(tic.cost) / 10 ** 8).toString()} ICP */}
                        </Badge>
                      </Stack>
                    </Card.Header>
                    <Card.Body className="d-flex  flex-column text-center">
                      <Card.Title className="text-white">{que.question}</Card.Title>                                          
                      {que.possibleoptions.map((ans, idx) => (
                      <Card.Text className="flex-grow-2 text-white" key={idx}>
                        <i className="bi bi-info-square-fill"></i><span>{ans}</span>
                      </Card.Text> 
                      ))}
                    </Card.Body>
                    <Card.Footer>
                      <Stack direction="horizontal" gap={5}>
                        <Button
                          disabled={loading}
                          onClick={() => deletequestion(id, que.id)}
                          variant="danger"
                          className="rounded-pill px-0"
                          style={{ width: "38px" }}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </Button>
                        <i></i>
                      </Stack>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" 
            disabled={loading}
            onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={_show} onHide={_handleClose} size="lg" centered scrollable={true} backdrop={true} >
          <Modal.Header closeButton>
            <Modal.Title>Survey Feedbacks</Modal.Title>
          </Modal.Header>
          <Modal.Body className="rounded-2 bg-dark border-info shadow-lg" >
          <Col xs={1} sm={1} lg={3} className="g-3 flex flex-nowrap mb-5 px-3 g-xl-4 g-xxl-5 w-100">
              {surveyFeedBack.map((fed, idx) => (
                <Row key={idx} className="g-3 mb-4 ">
                  <Card className="rounded-2 border-info shadow-lg p-0 h-100 bg-dark" >
                    <Card.Header>
                      <Stack direction="horizontal" gap={2}>
                        <Badge bg="secondary" className="ms-auto">
                          {fed.visitor}
                        </Badge>
                      </Stack>
                    </Card.Header>
                    <Card.Body className="d-flex  flex-column text-center">
                      {fed.feedbacks.map((fd, idx) => (
                        <Row key={idx} className="g-3 mb-1 ">
                        <Card className="rounded-2 border-info shadow-lg  h-100" style={{ backgroundColor: "#021278" }}>
                        <Card.Body className="d-flex  flex-column text-center">
                        <Card.Title className="text-white">question:{fd.question}</Card.Title> 
                        <Card.Text className="text-white"><i className="bi bi-info-circle-fill"></i>feedback: {fd.feedback}</Card.Text>
                        <Card.Text className="text-white"><i className="bi bi-info-circle-fill"></i>evaluation: {fd.evaluation}</Card.Text>
                        <Card.Text className="text-white"><i className="bi bi-info-circle-fill"></i>confidence: {fd.confidence}</Card.Text>
                        </Card.Body>
                        </Card> 
                        </Row> 
                      ))}
                    </Card.Body>
                    <Card.Footer>
                    </Card.Footer>
                  </Card>
               </Row>
              ))}
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" 
            disabled={loading}
            onClick={_handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </Col>
  );
};

SurveyProduct.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
  addquestion: PropTypes.func.isRequired,
  deletequestion: PropTypes.func.isRequired,
  deleteproduct: PropTypes.func.isRequired,
  updateproduct: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

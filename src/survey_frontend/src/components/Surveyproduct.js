// imported dependencies
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack, Modal, Row } from "react-bootstrap";
import Loader from "./utils/Loader";
import { Principal } from "@dfinity/principal";
import AddQuestion from "./Addquestion";
import UpdateProduct from "./UpdateProduct";

// The SurveyProduct construct taking a product instance, addquestion, deletequestion, deleteproduct and updateproduct functions 
// plus a loading variable as --props
export default function SurveyProduct({ product, addquestion, deletequestion, deleteproduct, updateproduct, loading }) {

  // a product instance
  const { id, owner, name, imageUrl, description, survey } = product;

  // the positivefeeds, negativefeeds, surveyQuestion and surveyFeedBack state variable's
  const [positivefeeds, setPositiveFeeds] = useState(0);
  const [negativefeeds, setNegativeFeeds] = useState(0);
  const [surveyQuestion, setSurveyQuestion] = useState([]);
  const [surveyFeedBack, setSurveyFeedBack] = useState([]);


  // the surveyQuestion and surveyFeedBack modal state 
  const [show, setShow] = useState(false);
  const [_show, _setShow] = useState(false);

  // the surveyQuestion and surveyFeedBack modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const _handleClose = () => _setShow(false);
  const _handleShow = () => _setShow(true);


  useEffect(() => {
    try {
      setSurveyQuestion(survey.questions)
      var _p = 0; var _pc = 0; var _n = 0; var _nc = 0;
      survey.feedbacks.forEach((ele) => {
        ele.feedbacks.forEach((el) => {
          if (el.evaluation == 'positive') { _pc++; _p += el.confidence; }
          if (el.evaluation == 'negative') { _nc++; _n += el.confidence; }
        })
      })
      setPositiveFeeds(Math.ceil((_p * 100) / _pc))
      setNegativeFeeds(Math.ceil((_n * 100) / _nc))
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
            <span className="font-monospace text-white">{Principal.from(JSON.stringify(owner)).toString().slice(0, 17)}</span>
            {!loading ? (
              <>
                <UpdateProduct product={product} updateproduct={updateproduct} />
                <Badge bg="secondary" className="ms-auto">
                  {name}
                </Badge>
              </>) : (<Loader />)}
          </Stack>
        </Card.Header>
        <Card.Img src={imageUrl} alt={name} width="80%" height="260px" style={{ objectFit: "strech" }} />

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title className="text-white">{name}</Card.Title>
          <Card.Text className="flex-grow-1 text-white"><i className="bi bi-info-circle-fill"></i>{description}</Card.Text>
          <Card.Text className="flex-grow-1 text-white">
            <i className="bi bi-info-circle-fill">
            </i>Positive FeedBack {positivefeeds}%
          </Card.Text>
          <Card.Text className="flex-grow-1 text-white">
            <i className="bi bi-info-circle-fill">
            </i>Negative FeedBack {negativefeeds}%
          </Card.Text>
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
                <AddQuestion id={id} addquestion={addquestion} />
              </>
            )}
          </Stack>
        </Card.Footer>
        <Modal show={show} onHide={handleClose} size="xl" centered scrollable={true} backdrop={true} >
          <Modal.Header closeButton={!loading}>
            <Modal.Title>Survey Questions</Modal.Title>
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
                          {Principal.from(JSON.stringify(fed.visitor)).toString().slice(0, 17)`....`}
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

// imported dependencies
import React, { useState} from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Form, FloatingLabel } from "react-bootstrap";


export default function SurveyTab({ _question, setcurrentresponse, setcurrentquestion })  {  


  const { id, question, possibleoptions } = _question;
  const [_possibleoptions, setPossibleOptions] = useState(possibleoptions)

  const isFormFilled = () => _response;

  return (
    <Col key={id}>
      <Card className="rounded-2 border-info shadow-lg h-100" style={{ backgroundColor: "#021278" }}>
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Badge bg="secondary" className="ms-auto">
              {id}
            </Badge>
          </Stack>
        </Card.Header>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title className="text-white">{question}</Card.Title>
          <Form>
            {_possibleoptions.map((ans, idx) => (
              <FloatingLabel
              key={idx}
              label={ans}
              className="mb-3"
              >
              <Form.Control
                  type="checkbox"
                  value={ans}
                  onChange={(e) => {
                    setcurrentresponse(e.target.value);
                    setcurrentquestion(question);
                    // console.log(e.target.value);
                  }}
                  placeholder={ans}
              />
              </FloatingLabel>           
            ))}
          </Form>  
        </Card.Body>
      </Card>
    </Col>
  );
};

SurveyTab.propTypes = {
  _question: PropTypes.instanceOf(Object).isRequired,
  setcurrentresponse: PropTypes.func.isRequired, 
  setcurrentquestion: PropTypes.func.isRequired
};


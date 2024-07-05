// imported dependencies
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import Loading from "./Loading";
import toast from "react-hot-toast";
import useClassify from "../hooks/useClassify";

export default function AddQuestion({ addquestion }) {

  const { error, loading, getEvaluation, feedBack } = useClassify();

  // An event attributes state variable's
  const [question, setQuestion] = useState("");
  const [count, setCount] = useState(0);
  const _anslst = useRef(new FormData)

  
  const isFormFilled = () => question 

  // Add event modal state 
  const [show, setShow] = useState(false);
  // Add event modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const addQuestion = (question) => {
    const _ans = []
    _anslst.current.forEach((an) => {
      if(_ans.length <= 0) return false;
      _ans.push(an)})
    console.log(_ans)
    addquestion(question, _ans, feedBack)
  };

  const evaluateOptions = () => {
    const _ans = []
    _anslst.current.forEach((an) => {
      if(an.length <= 0){
        toast.error("You are not authenticated");
        return;
      } 
      _ans.push(an)})
      if (_ans.length <= 0) {toast.error("You are not authenticated"); return;}  
    // console.log(_ans)
    getEvaluation(_ans)
    console.log(feedBack)
  };


  const addOptionInput = (iid) => {
    var _form = document.querySelector("#formbody")
    _anslst.current.set(iid, "")
    var _input = document.createElement('input')
    
    _input.onchange = (e) => {
      _anslst.current.set(iid, e.target.value)
    }
    _input.id = iid
    _input.className = "mb-3 form-control"
    _input.type = "text"
    _input.placeholder ="Option"
    _form.appendChild(_input)
  }

  const removeOptionInput = (iid) => {
    var _input = document.querySelector("#formbody")
    var _sub = _input.querySelectorAll('input')
    _anslst.current.delete(iid)
    _input.removeChild(_sub[_sub.length - 1])
  }


  return (
    <>
      <Button
        onClick={() => {
          setQuestion("");
          _anslst.current = new FormData;
          handleShow();
        }}
        variant="dark"
        className="btn btn-primary btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
      >
        Add Question
      </Button>
      <Modal show={show} onHide={handleClose} centered className="text-center rounded-2 border-info shadow-lg">
        {!loading ? (<Modal.Header closeButton>
          <Modal.Title>New Survey Question</Modal.Title>
        </Modal.Header>):(<Loading />)}
        <Form>
          <Modal.Body className="rounded-2 border-info bg-dark shadow-lg" id="formbody">
            <FloatingLabel
              controlId="inputQuestion"
              label="Question"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
                placeholder="Question"
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          {!loading && (
            <>
          <Button className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
          onClick={() => {
            addOptionInput(`${count + 1}`)
            setCount(count + 1)
            }}
            disabled={!isFormFilled() || count >= 5} 
            >
            + Option
          </Button>  
          <Button 
          className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis" 
          onClick={() => {
            removeOptionInput(`${count - 1}`)
            setCount(count - 1)
            }}
            disabled={count <= 0}
            >
            - Option
          </Button> 
          <Button
            className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            disabled={feedBack.length <= 0 || loading}
            onClick={() => {
              addQuestion(question);
              handleClose();
            }}
          >
            Submit Question
          </Button>
          <Button
            className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
            disabled={!isFormFilled() || loading}
            onClick={() => {
              evaluateOptions();
            }}
          >
            Evaluate Options
          </Button>
          </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddQuestion.propTypes = {
  addquestion: PropTypes.func.isRequired,
};

// export default AddEvent;

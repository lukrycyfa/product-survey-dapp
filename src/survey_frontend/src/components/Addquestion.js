// imported dependencies
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import Loader from "./utils/Loader";
import toast from "react-hot-toast";
import useClassify from "../hooks/useClassify";

// The AddQuestion construct taking an id, and the addquestion function as prop
export default function AddQuestion({ id, addquestion }) {

  // creating an instance of the useClassify Hook
  const { loading, getEvaluation, feedBack } = useClassify();

  // the question, count and submit state variable's
  const [question, setQuestion] = useState("");
  const [count, setCount] = useState(0);
  const [submit, setSubmit] = useState(false);

  // a formData to created options
  const _anslst = useRef(new FormData)

  // input validation
  const isFormFilled = () => question

  // The AddQuestion modal state 
  const [show, setShow] = useState(false);
  // The AddQuestion modal state togglers
  const handleClose = () => {
    if (loading) return;
    if (count > 0) {
      for (let i = 1; i <= count; i++) {
        removeOptionInput(`${i}`)
      }
    }
    setCount(0)
    toast.dismiss()
    setShow(false)
  };

  const handleShow = () => setShow(true);


  // add survey question after evaluation
  const addQuestion = async (question) => {
    toast.dismiss()
    setSubmit(false);
    const _ans = []
    _anslst.current.forEach((an) => {
      if (an.length <= 0) { toast.error("invalid inputs provided"); return; }
      _ans.push(an)
    })
    await addquestion(id, question, _ans, feedBack)
  };

  // evaluate survey options
  const evaluateOptions = async () => {
    toast.dismiss()

    const _ans = []
    _anslst.current.forEach((an) => {
      if (an.length <= 0) {
        toast.error("invalid input provided");
        return;
      }
      _ans.push(an)
    })
    if (_ans.length <= 0) { toast.error("invalid inputs provided"); return; }
    await getEvaluation(_ans)

    feedBack.forEach((fd, idx) => {
      toast.loading(fd.text + " # " + fd.label + " = " + fd.confidence + " ", { position: 'bottom-right' })
    })

    setSubmit(true)
  };

  // add an option input to the form
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
    _input.placeholder = "Option"
    _form.appendChild(_input)
    setSubmit(false);
  }

  // remove an option input from the form
  const removeOptionInput = (iid) => {
    var _input = document.querySelector("#formbody")
    var _sub = _input.querySelectorAll('input')
    _anslst.current.delete(iid)
    _input.removeChild(_sub[_sub.length - 1])
    setSubmit(false);
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
        {!loading ? (<Modal.Header>
          <Modal.Title>New Survey Question</Modal.Title>
          <Button
            className="btn  btn-sm rounded-3 border border-warning shadow-lg display-4 fw-bold text-body-emphasis"
            disabled={loading}
            onClick={() => {
              handleClose()
            }}
          >
            Close
          </Button>
        </Modal.Header>

        ) : (<Loader />)}
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
                - Options
              </Button>
              <Button
                className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
                disabled={feedBack.length <= 0 || loading || !submit}
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
  id: PropTypes.string.isRequired,
  addquestion: PropTypes.func.isRequired
};


// imported dependencies
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";


// The UpdateProduct construct taking a product instance and an updateproduct function as prop

export default function UpdateProduct({ product, updateproduct }) {

  const { id, name, imageUrl, description } = product; 

  // A products attributes state variable's
  const [_name, setName] = useState(name);
  const [_imageUrl, setImageUrl] = useState(imageUrl);
  const [_description, setDescription] = useState(description);

  // form input vlidation
  const isFormFilled = () => _name && _imageUrl && _description ;

  // UpdateProduct modal state 
  const [show, setShow] = useState(false);
  // UpdateProduct modal state togglers
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        className="btn  btn-sm rounded-3 border border-info shadow-lg display-4 fw-bold text-body-emphasis"
      >
        Update
      </Button>
      <Modal show={show} onHide={handleClose} centered className="text-center rounded-2 border-info shadow-lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body className="rounded-2 bg-dark border-info shadow-lg">
            <FloatingLabel
              controlId="inputName"
              label="product name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                value={_name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Product Name"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="image url"
              className="mb-3"
            >
              <Form.Control
                type="text"
                value={_imageUrl}
                placeholder="Image URL"
                onChange={(e) => {
                  setImageUrl(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                value={_description}
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              updateproduct(id, {
                name:_name,
                imageUrl:_imageUrl,
                description:_description
              });
              handleClose();
            }}
          >
            Update...
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateProduct.propTypes = {
    product: PropTypes.instanceOf(Object).isRequired,
    updateproduct: PropTypes.func.isRequired,
};


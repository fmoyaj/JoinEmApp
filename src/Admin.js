// Admin.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Container, Alert, Accordion, InputGroup, FormControl, Row, Col} from 'react-bootstrap';
import {Dropdown} from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import editing from './icons/editing.png';
import coinem from './icons/coinem_icon.png'
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import MaterialButton from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {RadioGroup, Radio, FormLabel, FormControlLabel} from '@material-ui/core';
import MUFormControl from '@material-ui/core/FormControl';

export function EditGlobals(props) {
    const [show, setShow] = useState(false);
    const [currentValue, setCurrentValue] = useState("");
  
    function handleClose() {
      setShow(false);
      setCurrentValue("");
    }
    function handleSubmit() {
      if(currentValue > props.maxValue){
        setShow(false);
        setCurrentValue("");
      }
    }
    const handleOpen = () => setShow(true);
    const updateValue = (e) => setCurrentValue(e.target.value);
  
    return (
      <>
        <Button variant="light" onClick={handleOpen}>
              <img src={editing} width="16" height="16"/>
              </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>{"Edit " + props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">{props.title}</InputGroup.Text>
                <FormControl
                  aria-label="username"
                  aria-describedby="basic-addon1"
                  value ={currentValue}
                  onChange={updateValue}
                />
              </InputGroup>
            {(currentValue < props.maxValue && currentValue !== "") &&
                <Alert key="alert" variant="danger">
                Invalid value for {props.title.toLowerCase()}. Submit a minimum value of {props.maxValue}.
              </Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => {props.handleSaveChanges(currentValue, props.title, props.maxValue); handleSubmit()}}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  
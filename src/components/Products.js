import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AiFillPlusCircle, AiOutlineEdit, AiFillDelete, AiFillCheckCircle, } from 'react-icons/ai'
import { GiCancel } from 'react-icons/gi'
import {
  Table,
  Button,
  Badge,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";

//Retrive and initialize data
var data = []

if (JSON.parse(localStorage.getItem("invData")) != null) {
  var data = JSON.parse(localStorage.getItem("invData"))

} else {
  var data = [];
}

//Search and identify errors in the forms
const validate = values => {
  const errors = {}
  if (!values.nombre) {
    errors.nombre = "Este campo es obligatorio y contener un max de 30 caracteres"
  }
  if (!values.costo) {
    errors.costo = "Este campo es obligatorio "
  }
  if (!values.precio) {
    errors.precio = "Este campo es obligatorio "
  }
  //if some case is true is stablished to show it
  return errors
}

class Products extends React.Component {
  state = {
    data: data,
    modalActualizar: false,
    modalInsertar: false,
    hasNoC: false,
    hasNoP: false,
    form: {
      id: "",
      nombre: "",
      costo: "",
      iva: "",
      precio: "",
    },
    errors: {},

  };
  //Management methods for modal update
  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      modalActualizar: true,
    });
  };

  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false, hasNoC: false, hasNoP: false });
  };

  //Management methods for modal insert
  mostrarModalInsertar = () => {

    this.setState({
      modalInsertar: true,
    });
  };

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false, hasNoC: false, hasNoP: false });
  };

  //Recieves form data to update
  editar = (dato) => {
    //utilities for searching and further update
    var contador = 0;
    var arreglo = this.state.data;

    arreglo.map((registro) => {

      if (dato.id === registro.id) {
        //Validates fields
        var result = validate(dato);
        this.setState({ errors: result })
        if (!Object.keys(result).length) {
          arreglo[contador].nombre = dato.nombre;
          arreglo[contador].costo = dato.costo;
          arreglo[contador].iva = parseFloat(dato.costo) * 0.16 + parseFloat(dato.costo);
          arreglo[contador].precio = dato.precio;

        }
      }
      contador++;

    });
    //Validates fields
    var result = validate(dato);
    if (!Object.keys(result).length) {
      this.setState({ data: arreglo, modalActualizar: false });
      //Adds to localstorage
      localStorage.setItem("invData", JSON.stringify(this.state.data))
    } else {
      //prevents to close modal
      this.setState({ modalActualizar: true });
    }
  };

  eliminar = (dato) => {
    var opcion = window.confirm("¿Estás Seguro que deseas Eliminar " + dato.nombre + "?");
    if (opcion === true) {
      var contador = 0;
      var arreglo = this.state.data;
      arreglo.map((registro) => {
        if (dato.id === registro.id) {
          arreglo.splice(contador, 1);
        }
        contador++;
      });
      this.setState({ data: arreglo, modalActualizar: false });
      localStorage.setItem("invData", JSON.stringify(this.state.data))
    }
  };

  insertar = () => {
    //Retrieves data from form and calculates IVA 
    this.state.form.iva = parseFloat(this.state.form.costo) * 0.16 + parseFloat(this.state.form.costo)
    var valorNuevo = { ...this.state.form };
    valorNuevo.id = this.state.data.length + 1;
    //Validates fields
    const result = validate(valorNuevo)
    this.setState({ errors: result })
    if (!Object.keys(result).length) {
      var lista = this.state.data;
      lista.push(valorNuevo);
      this.setState({ modalInsertar: false, hasNoC: false, hasNoP: false, data: lista });
      this.setState({
        form: {
          id: "",
          nombre: "",
          costo: "",
          iva: "",
          precio: "",
        }
      })
      //Insert new data to localstorage
      localStorage.setItem("invData", JSON.stringify(this.state.data))
    } else {
      //prevents to close modal
      this.setState({ modalInsertar: true })
    }

  }
  //Handle changes section
  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleCheckP = (e) => {
    //Manges check evennts for prices 'no visible' condition and adds a default value
    if (e.target.checked) {
      this.setState({
        hasNoP: e.target.checked,
        form: {
          ...this.state.form,
          precio: "Pendiente",
        },

      })
    } else {
      this.setState({
        hasNoP: e.target.checked,
        form: {
          ...this.state.form,
          precio: "",
        },
      })
    }
  }

  handleCheckC = (e) => {
    //Manges check evennts for costs 'no visible' condition and adds a default value
    if (e.target.checked) {
      this.setState({
        hasNoC: e.target.checked,
        form: {
          ...this.state.form,
          costo: "1",
        },
      })
    } else {
      this.setState({
        hasNoC: e.target.checked,
        form: {
          ...this.state.form,
          costo: "",
        },
      })
    }



  }
  render() {


    return (
      <>
        <Container>
          <br />

          <Button id="addB" data-testid="addB" color="success" onClick={() => this.mostrarModalInsertar()}> <AiFillPlusCircle /></Button>
          <br />
          <br />
          <Table striped bordered hover id="tabla">
            <thead data-testid="tableH">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Costo</th>
                <th>Costo+IVA</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.id}</td>
                  <td>{dato.nombre}</td>
                  <td>${dato.costo}</td>
                  <td>${dato.iva}</td>
                  <td>${dato.precio}</td>
                  <td id="actions">
                    <Button
                      color="primary"
                      className="buttons"
                      onClick={() => this.mostrarModalActualizar(dato)}
                    >
                      <AiOutlineEdit />
                    </Button>{" "}
                    <Button color="danger" className="buttons" onClick={() => this.eliminar(dato)}> <AiFillDelete /> </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalActualizar} >
          <ModalHeader>
            <div><h3>Editar Producto</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                Id:
              </label>

              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.data.length}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Nombre:
              </label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                required="true"
                maxLength="30"
                value={this.state.form.nombre}
                onChange={this.handleChange}
              />
            </FormGroup>
            < Badge bg="danger"> {this.state.errors.nombre}</Badge>
            <FormGroup>
              <label>
                Costo:
              </label>
              <input
                className="form-control"
                name="costo"
                type="number"
                required="true"
                value={this.state.form.costo}
                onChange={this.handleChange}
              />
            </FormGroup>
            < Badge bg="danger"> {this.state.errors.costo}</Badge>
            <FormGroup
              check
              inline
            >
              <Input type="checkbox" onChange={this.handleCheckC} />
              <Label check>
                No visible
              </Label>
            </FormGroup>

            <FormGroup>
              <label>
                Costo+IVA:
              </label>
              <input
                className="form-control"
                name="iva"
                readOnly
                type="number"
                value={parseFloat(this.state.form.costo) * 0.16 + parseFloat(this.state.form.costo)}
                required="true"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Precio:
              </label>
              {this.state.hasNoP ? null :
                <input
                  className="form-control"
                  name="precio"
                  type="number"
                  required="true"
                  value={this.state.form.precio}
                  onChange={this.handleChange}
                />}
            </FormGroup>
            < Badge bg="danger"> {this.state.errors.precio}</Badge>
            <FormGroup
              check
              inline>
              <Input type="checkbox" onChange={this.handleCheckP} />
              <Label check>
                No visible
              </Label>
            </FormGroup>

          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              className="buttons"
              onClick={() => this.editar(this.state.form)}
            >
              <AiFillCheckCircle />
            </Button>
            <Button
              color="danger"
              className="buttons"
              onClick={() => this.cerrarModalActualizar()}
            >
              <GiCancel />
            </Button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.modalInsertar} data-testid="modal">
          <ModalHeader>
            <div><h3>Insertar Producto</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                Id:
              </label>

              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.data.length + 1}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Nombre:
              </label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                required="true"
                data-testid="nombreC"
                maxLength="30"
                onChange={this.handleChange}
              />
            </FormGroup>
            < Badge bg="danger"> {this.state.errors.nombre}</Badge>

            <FormGroup>
              <label>
                Costo:
              </label>
              {this.state.hasNoC ? null :
                <input
                  className="form-control"
                  name="costo"
                  type="number"
                  data-testid="costo"
                  required="true"
                  onChange={this.handleChange}
                />}
              < Badge bg="danger"> {this.state.errors.costo}</Badge>
            </FormGroup>

            <FormGroup
              check
              inline>
              <Input type="checkbox" onChange={this.handleCheckC} />
              <Label check>
                No visible
              </Label>
            </FormGroup>
            <FormGroup>
              <label>
                Costo+IVA:
              </label>
              <input
                className="form-control"
                value={parseFloat(this.state.form.costo) * 0.16 + parseFloat(this.state.form.costo)}
                name="iva"

                readOnly
                type="number"
                required="true"
                onChange={this.handleChange}

              />
            </FormGroup>
            <FormGroup>
              <label>
                Precio:
              </label>

              {this.state.hasNoP ? null :
                <input
                  className="form-control"
                  name="precio"
                  type="number"
                  data-testid="precio"
                  required="true"
                  onChange={this.handleChange}
                />}

              < Badge bg="danger"> {this.state.errors.precio}</Badge>
            </FormGroup>
            <FormGroup
              check
              inline>
              <Input type="checkbox" onChange={this.handleCheckP} />
              <Label check>
                No visible
              </Label>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              data-testid="insertarB"
              className="buttons"
              onClick={() => this.insertar()}
            >
              <AiFillCheckCircle />
            </Button>
            <Button
              className="btn btn-danger"
              id="closeM"
              onClick={() => this.cerrarModalInsertar()}
            >
              <GiCancel />
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}


export default Products;
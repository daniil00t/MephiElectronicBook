import React from 'react';
import {Nav, Navbar, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';

export class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Navbar bg="light" expand="lg">
			  <Navbar.Brand href="/"><span className="mark-span">EL</span>Book</Navbar.Brand>
			  <Navbar.Toggle aria-controls="basic-navbar-nav" />
			  <Navbar.Collapse id="basic-navbar-nav">
			    <Nav className="ml-auto" style={{marginRight: "40px"}}>
			      <Nav.Link href="/">Главная</Nav.Link>
			      <Nav.Link href="#link">Мои группы</Nav.Link>
			      <NavDropdown title="Мои ведомости" id="basic-nav-dropdown">
			        <NavDropdown.Item href="#action/3.1">Ведомость оценок</NavDropdown.Item>
			        <NavDropdown.Item href="#action/3.2">Ведомость посещаемости</NavDropdown.Item>
			        <NavDropdown.Divider />
			        <NavDropdown.Item href="#action/3.4">Общая ведомость</NavDropdown.Item>
			      </NavDropdown>
			      <Nav.Link href="#home">Помощь</Nav.Link>
			    </Nav>
			    <Form inline>
			      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
			      <Button variant="outline-success">Найти</Button>
			    </Form>
			  </Navbar.Collapse>
			</Navbar>
			);
		}
	}

import React from 'react';
import {Nav, Navbar, NavDropdown, Form, FormControl, Button} from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

export class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Navbar bg="light" expand="lg">
				<Link to="/personalPage" className="navbar-brand"><span className="mark-span">EL</span>Book</Link>
			  <Navbar.Toggle aria-controls="basic-navbar-nav" />

			  <Navbar.Collapse id="basic-navbar-nav">
			    <Nav className="ml-auto" style={{marginRight: "40px"}}>
			      <Nav.Link href="/">Главная</Nav.Link>

			      <Nav.Link href="#link">Мои группы</Nav.Link>
			      <NavDropdown title="Мои ведомости" id="basic-nav-dropdown">
			        <Link to="/personalPage/tables/score" className="dropdown-item">Ведомость оценок</Link>
			        <Link to="/personalPage/tables/att" className="dropdown-item">Ведомость посещаемости</Link>
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

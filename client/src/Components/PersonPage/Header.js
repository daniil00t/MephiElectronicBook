import React from 'react';
import { Nav, Navbar, NavDropdown, Form, FormControl, Button, DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";

// Redux is used
import { useDispatch, useSelector, connect } from "react-redux"
import { changeTypeReport, changeTypeSubject, changeGroup, changeSubject, changePriority } from "../../redux/actions"

const ItemDropdownSubjects = (props) => {
	const click = (subject, group) => {
		props.changeSubject(subject)
		props.changeGroup(group)
		props.changePriority("subjects")
		props.typeSubject.length == 1 ? 
			props.changeTypeSubject(props.typeSubject[0]):
			props.changeTypeSubject("undefined")
	}
	return (
		<DropdownButton
			// as={ButtonGroup}
			key={"left"}
			id={`dropdown-button-drop-${"left"}`}
			drop={"left"}
			variant="secondary"
			title={props.subject}
		>
			{
				props.groups.map((group, index) => (
					<Dropdown.Item eventKey={index} onClick={e => click(props.subject, group)}>
						<Link to="/personalPage/tables/att" style={{color: "#000"}}>{group}</Link>
					</Dropdown.Item>
				))
			}
		</DropdownButton>
	)
}

const ItemDropdownGroups = (props) => {
	const click = (subject, group) => {
		props.changeSubject(subject)
		props.changeGroup(group)
		props.changePriority("groups")
		props.typeSubject.length == 1 ? 
			props.changeTypeSubject(props.typeSubject[0]):
			props.changeTypeSubject("undefined")
	}
	return (
		<DropdownButton
			// as={ButtonGroup}
			key={"right"}
			id={`dropdown-button-drop-${"right"}`}
			drop={"right"}
			variant="secondary"
			title={props.group}
		>
			{
				props.subjects.map((subject, index) => (
					<Dropdown.Item eventKey={index} onClick={e => click(subject, props.group)}>
						<Link to="/personalPage/tables/att" style={{color: "#000"}}>{subject}</Link>
					</Dropdown.Item>
					
				))
			}
		</DropdownButton>
	)
}


const Header = (props) => {
	const dispatch = useDispatch()
	const schedule = useSelector(state => state.schedule)


	const changeTypeTable = (type) => {
		dispatch(changeTypeReport(type))
		// console.log(props);
	}
	return (
		<Navbar bg="light" expand="lg">
			<Link to="/" className="navbar-brand"><span className="mark-span">EL</span>Book</Link>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />

			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="ml-auto" style={{marginRight: "40px"}}>
				<Link to="/personalPage" className="nav-link">Главная</Link>
				{/* <Link to="/personalPage/groups" className="nav-link">Мои группы</Link> */}
				<NavDropdown title="Мои группы" id="basic-nav-dropdown">
					{
						schedule.groupToSubject.map((item, index) => index < 12 ? (
							<ItemDropdownGroups 
								group={item.group} 
								subjects={item.subjects}
								typeSubject={item.types}
								changeSubject={subject => dispatch(changeSubject(subject))} 
								changeGroup={group => dispatch(changeGroup(group))}
								changeTypeSubject={group => dispatch(changeTypeSubject(group))}
								changePriority={subOrGr => dispatch(changePriority(subOrGr))}
							/>
						):
						(<></>)
						)
					}
				</NavDropdown>
				{/* <Link to="/personalPage/subjects" className="nav-link">Мои предметы</Link> */}
				<NavDropdown title="Мои предметы" id="basic-nav-dropdown">
					{
						schedule.subjectToGroup.map((subject, index) => (
							<ItemDropdownSubjects 
								subject={subject.name} 
								groups={subject.groups}
								typeSubject={subject.types} 
								changeSubject={subjectName => dispatch(changeSubject(subjectName, subject.durations[0]))} 
								changeGroup={group => dispatch(changeGroup(group))}
								changeTypeSubject={group => dispatch(changeTypeSubject(group))}
								changePriority={subOrGr => dispatch(changePriority(subOrGr))}
							/>
						))
					}
				</NavDropdown>
				<NavDropdown title="Мои ведомости" id="basic-nav-dropdown">
					<Link onClick={e => changeTypeTable("att")} to="/personalPage/tables/att" className="dropdown-item">Ведомость посещаемости</Link>
					<Link onClick={e => changeTypeTable("score")} to="/personalPage/tables/score" className="dropdown-item">Ведомость оценок</Link>
					<Link onClick={e => changeTypeTable("ch")} to="/personalPage/tables/score" className="dropdown-item">Итоговая ведомость</Link>
					<NavDropdown.Divider />
					<Link to="/personalPage/constructor" className="dropdown-item">Конструктор</Link>
				</NavDropdown>
				
				<Nav.Link href="#home">Помощь</Nav.Link>
				</Nav>
				<Form inline>
				<FormControl type="text" placeholder="Search" className="mr-sm-2" />
				<Button variant="outline-success">Найти</Button>
				</Form>
			</Navbar.Collapse>
		</Navbar>
	)
}

export default connect()(Header)
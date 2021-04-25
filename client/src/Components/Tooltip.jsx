import React, { useState, useRef } from 'react';
import {Overlay, Popover, Button} from 'react-bootstrap'

const Tooltip = ({children}) => {
   const [show, setShow] = useState(false);
   const [target, setTarget] = useState(null);
   const ref = useRef(null);

   const handleClick = (event) => {
      setShow(!show);
      setTarget(event.target);
   };
   return (
      <div ref={ref}>
      <div onMouseEnter={handleClick} onMouseLeave={handleClick}>{children}</div>


      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
      >
        <Popover id="popover-contained" onMouseLeave={handleClick}>
          <Popover.Title as="h3">Изменение границы оценок</Popover.Title>
          <Popover.Content>
				<input type="range" class="form-control-range" id="formControlRange" />
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
   )
}

export default Tooltip
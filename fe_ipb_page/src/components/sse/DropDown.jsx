import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { HiOutlineBell } from 'react-icons/hi';
import { logInState } from '../state/loginState';
import { useRecoilState } from 'recoil';
import { alarmState } from '../state/alarmState';
import styles from './DropDown.module.css'
import { Navigate, useNavigate } from 'react-router-dom';
import { FiAlertCircle } from "react-icons/fi";
import { Modal } from 'antd';

function DropDown({ direction, ...args }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginData, setLoginData] = useRecoilState(logInState);
  const [messages, setMessages] = useState([]);
  const [alarmData, setAlarmData] = useRecoilState(alarmState);
  const [messagesLowItem, setMessagesLowItem] = useState([]);
  const [cartListData, setCartListData] = useState([]);
  const [cartListLowProductData, setCartListLowProductData] = useState([]);
  const [readMessageEXP, setReadMessageEXP] = useState(false);
  const [readMessageLOW, setReadMessageLOW] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  const navigate = useNavigate();

  const combinedMessages = [...messages, ...messagesLowItem];

  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
    if (!dropdownOpen) {
      setAlarmData(0);
    }
  };

  const url = `${process.env.REACT_APP_BE_API}/notifications/expiration/${loginData.store_id}`;

  useEffect(() => {
    fetchSSE();
    fetchLowItemSSE();
  }, []);

  const fetchSSE = () => {
    const eventSource = new EventSource(url, {
      headers: {
        Accept: 'text/event-stream',
      },
    });

    eventSource.onopen = function (event) {
      if (eventSource.readyState === EventSource.OPEN) {
        console.log('연결 성공');
      } else {
        console.log('연결 실패');
      }
    };

    eventSource.onmessage = (e) => {
      console.log(JSON.parse(e.data)[1].data);
      const onmessageData = JSON.parse(e.data)[1].data;
      setMessages((prev) => [...prev, onmessageData]);
      setAlarmData(onmessageData.length);
    };

    eventSource.onerror = (e) => {
      eventSource.close();

      if (e.error) {
        console.log('에러가 발생했습니다.');
        console.log(e);
      }

      if (e.target.readyState === EventSource.CLOSED) {
        // 종료 시 할 일
      }
      return () => {
        eventSource.close(); // SSE 연결 종료
      };
    };
  };

  // const fetchLowItemSSE = () => {
  //   const LowItem_url = `${process.env.REACT_APP_BE_API}/notifications/low-inventory/${loginData.store_id}`;
  //   const eventSource = new EventSource(LowItem_url, {
  //     headers: {
  //       Accept: 'text/event-stream',
  //     },
  //   });

  //   eventSource.onopen = function (event) {
  //     if (eventSource.readyState === EventSource.OPEN) {
  //       console.log('연결 성공');
  //     } else {
  //       console.log('연결 실패');
  //     }
  //   };

  //   eventSource.onmessage = (e) => {
  //     const firstData = JSON.parse(e.data)[1].data;
  //     const secondData = JSON.parse(firstData);
  //     const messageLow = secondData.message;
  //     const productsLow = secondData.products;

  //     setCartListData(messageLow);
  //     setMessagesLowItem((prev) => [...prev, messageLow]);
  //   };

  //   eventSource.onerror = (e) => {
  //     eventSource.close();

  //     if (e.error) {
  //       console.log('에러가 발생했습니다.');
  //       console.log(e);
  //     }
  //     if (e.target.readyState === EventSource.CLOSED) {
  //       // 종료 시 할 일
  //     }
  //     return () => {
  //       eventSource.close(); // SSE 연결 종료
  //     };
  //   };
  // };

  const fetchLowItemSSE = () => {
    const LowItem_url = `${process.env.REACT_APP_BE_API}/notifications/low-inventory/${loginData.store_id}`;
    const eventSource = new EventSource(LowItem_url, {
      headers: {
        Accept: 'text/event-stream',
      },
    });

    eventSource.onopen = function (event) {
      if (eventSource.readyState === EventSource.OPEN) {
        console.log('연결 성공');
      } else {
        console.log('연결 실패');
      }
    };

    eventSource.onmessage = (e) => {
      const firstData = JSON.parse(e.data)[1].data;
      const secondData = JSON.parse(firstData);
      const messageLow = secondData.message;
      const productsLow = secondData.products;

      setCartListData(messageLow);
      setMessagesLowItem((prev) => [...prev, messageLow]);
      setCartListLowProductData(productsLow)



      console.log("productsLow", productsLow)
    };

    eventSource.onerror = (e) => {
      eventSource.close();

      if (e.error) {
        console.log('에러가 발생했습니다.');
        console.log(e);
      }
      if (e.target.readyState === EventSource.CLOSED) {
        // 종료 시 할 일
      }
      return () => {
        eventSource.close(); // SSE 연결 종료
      };
    };
  };


  const handleNavigateEXP = () => {
    navigate('/storeexp');
    setReadMessageEXP(true);
  };


  const handleNavigateLOW = () => {
    setIsConfirmationVisible(true);
  };

  const handleConfirmationOk = () => {
    setIsConfirmationVisible(false);
    navigate('/order');
    setReadMessageLOW(true);
    for (let i = 0; i < cartListLowProductData.length; i++) {
      console.log("handleConfirmationOk>>안",cartListLowProductData[i].product_name);
    }
  };

 
    console.log("acartListLowProductDataa>>handleConfirmationOk>>안",cartListLowProductData);

  for (let i = 0; i < cartListLowProductData.length; i++) {
    <div>
    {cartListLowProductData[i].Product_name}
    </div>
  }

  const handleConfirmationCancel = () => {
    setIsConfirmationVisible(false);
  };
  

  return (
    <>
      <div>
        <div id='top-myDrop'>
          <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggle} direction={direction} id='top-myDrop--i'>
            <DropdownToggle id='top-myDrop--ii' style={{ border: 'none', backgroundColor: '#262627', color: 'grey' }}>
              <div className={styles.BellRed}>
                <HiOutlineBell />
                <div>{alarmData > 0 && <p className={styles.alarmRed}></p>}</div>
                <div>{alarmData === 0 && <p className={styles.alarmBackground}></p>}</div>
              </div>
            </DropdownToggle>
            <div>
              <DropdownMenu
                style={{
                  width: '410px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  position: 'absolute',
                  zIndex: 99999999,
                  opacity: 1,
                }}
              >
                <div className={styles.dropList}>
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={styles.dropItemExpMessage}
                      onClick={() => {
                        handleNavigateEXP();
                        setDropdownOpen(!dropdownOpen);
                      }}
                    >
                      {readMessageEXP ? (
                        <td style={{ textDecoration: 'line-through', opacity: '0.5' }}>
                          {' '}
                          <FiAlertCircle /> {message}
                        </td>
                      ) : (
                        <td style={{ color: '244, 216, 59' }}>
                          {' '}
                          <FiAlertCircle /> {message}
                        </td>
                      )}
                    </div>
                  ))}
                  {messagesLowItem.map((message, index) => (
                    <div key={index}>
                      <div
                        className={styles.dropItemLowMessage}
                        onClick={() => {
                          handleNavigateLOW();
                          setDropdownOpen(!dropdownOpen);
                        }}
                      >
                        {readMessageLOW ? (
                          <td style={{ textDecoration: 'line-through', opacity: '0.5' }}>
                            {' '}
                            <FiAlertCircle /> {message}
                          </td>
                        ) : (
                          <td style={{ color: '80, 206, 80' }}>
                            {' '}
                            <FiAlertCircle /> {message}
                          </td>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenu>
            </div>
          </UncontrolledDropdown>
        </div>
        <Modal
          title="재고 미만인 상품을 담으시겠습니까?"
          visible={isConfirmationVisible}
          onOk={handleConfirmationOk}
          onCancel={handleConfirmationCancel}
          okText="예"
          cancelText="아니오"
        >
          <p>"예"를 누르면 재고 미만 상품이 담기고 발주 페이지로 이동합니다!</p>
          
          <div className={styles.lowProductNames}>
            {cartListLowProductData.map((item, index) => (
              <div key={item.id} className={styles.lowProductName}>
                {item.Product_name}
                {index !== cartListLowProductData.length - 1 && ','}
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </>
  );
}

DropDown.propTypes = {
  direction: PropTypes.string,
};

export default DropDown;


// import React, { useState } from "react";
// import {
//   Navbar,
//   Collapse,
//   Nav,
//   NavbarBrand,
//   UncontrolledDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
//   Button,
//   Container,
// } from "reactstrap";
// import 'bootstrap/dist/css/bootstrap.css';
// import { Link } from "react-router-dom";

// const DropDown = () => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const [isHovered, setIsHovered] = React.useState(false);
//   const [isOrderClicked, setIsOrderClicked] = useState(false);

//   const handleOrderClick = () => {
//     setIsOrderClicked(true);
//     console.log("isOrderClicked", isOrderClicked)
//   };


//   const toggle = () => setIsOpen(!isOpen);

//   const handleMouseEnter = () => setIsHovered(true);

//   const handleMouseLeave = () => setIsHovered(false);

//   return (
//     <div>
//       <Navbar dark expand="md">
//         <div className="d-flex align-items-center">
//           <NavbarBrand href="/" className="d-lg-none">
//             {/* <LogoWhite /> */}
//           </NavbarBrand>
//         </div>

//         <Collapse navbar isOpen={isOpen || isHovered}>
//           <Nav className="me-auto" navbar>
//             <Collapse navbar isOpen={isOpen}>
//               <Nav className="mx-auto" navbar>
//                 <UncontrolledDropdown inNavbar nav >
//                   <DropdownToggle caret nav style={{ color: 'grey'}}>
//                     상품 관리
//                   </DropdownToggle>
//                   <DropdownMenu end>
//                     <DropdownItem>
//                       <Link to="/storeproductlist" style={{ textDecoration: 'none', color: 'grey' }}>재고 관리</Link>
//                     </DropdownItem>
//                     <DropdownItem>
//                       <Link to="/storeexp" style={{ textDecoration: 'none', color: 'grey' }}>유통기한 관리</Link>
//                     </DropdownItem>
//                   </DropdownMenu>
//                 </UncontrolledDropdown>
//               </Nav>
//             </Collapse>
//           </Nav>
//         </Collapse>
//       </Navbar>
//     </div>
//   );
// };

// export default DropDown;
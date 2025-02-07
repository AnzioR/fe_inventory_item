import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const { confirm } = Modal;

// 보드 수정 
const BoardUpdate = () => {
  const { id } = useParams(); // useparams -> staffList에서 줬던 params을 넘겨줌 
  const [stateId, setStateId] = useState(id);

  const handleChange = (e) => {
    console.log(">>>>>>boardid", e.target.value)
    console.log(">>>>>>boardid", id)
    // e.target.value = id;
    setStateId(id);
  };

  const initialValues = {
    id: stateId,
  };

  console.log("BoardUpdate안에 id: ", id);


  const onFinish = async (values) => {

    try {
      // await fetch(`http://localhost:8080/staff/update`, {
        await fetch(`http://43.202.9.215:8080/staff/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      console.log('업데이트 성공!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    confirm({
      title: '삭제 확인',
      content: '정말로 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: deleteBoard,
      onCancel() {
        console.log('삭제 작업 취소');
      },
    });
  };
  
  const deleteBoard = async () => {
    try {
        // await fetch(`http://localhost:8080/board/delete?id=${id}`, {
      await fetch(`http://43.202.9.215:8080/board/delete?id=${id}`, {
        method: 'DELETE',
      });
      message.success('게시판이 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      message.error('게시판이 삭제에 실패하였습니다.');
    }
  };

  return (
    <>
      <Form 
        initialValues={initialValues}
        onFinish={onFinish}>
      <Form.Item label="아이디" name="title">
        <Input value={id} onChange={handleChange} readOnly/>
      </Form.Item>
      <Form.Item label="비밀번호" name="body_text">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="staff_id">
          수정하기
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="dashed" htmlType="submit" >
        <Link to="/board">뒤로가기</Link> 
        </Button>
      </Form.Item>
    </Form>

    <Button type="primary" htmlType="submit" danger onClick={handleDelete}>
  삭제하기
</Button>
    </>

  );
};

export default BoardUpdate;
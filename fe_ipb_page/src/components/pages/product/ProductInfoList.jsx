import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom';

function ProductInfoList() {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // const response = await fetch('http://localhost:8080/productInfo/list');
      const response = await fetch('http://43.202.9.215:8080/productInfo/list');
      const data = await response.json();
      setProductData(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await fetch(`http://localhost:8080/product/delete/${id}`, {
  //       method: 'DELETE',
  //     });
  //     message.success('상품이 삭제되었습니다.');
  //     fetchData();
  //   } catch (error) {
  //     console.error(error);
  //     message.error('상품 삭제에 실패하였습니다.');
  //   }
  // };

  const columns = [
    {
      title: 'SKU',
      dataIndex: 'product_code',
      key: 'product_code',
    },
    {
      title: '상품이름',
      dataIndex: 'name',
      render: (text, record) => (
        <Link to={`/productinfo/detail/${record.product_code}`} key={record.product_code}>{text}</Link>
      ),
      // Ant Design의 Table 컴포넌트의 columns 속성에 사용되는 객체
      // render는 특정 열(column)의 셀(cell)을 렌더링하는 함수
      // text(=이름)와 record(=id) 두 개의 인자를 전달받는 함수
      // text 값을 Link 컴포넌트로 감싸서 반환
      // `/product/detail/${record.id}` 경로로 이동하는 링크를 생성하고, 이를 text 값으로 감싸서 반환
    },
    {
      title: '제조사',
      dataIndex: 'brand',
    },
    {
      title: '보관방법',
      dataIndex: 'storage',
    },
    {
      title: '입수',
      dataIndex: 'box_qnt',
    },
  ];

  return (
    <>
      <Table dataSource={productData.map((item) => ({ ...item, key: item.id }))} columns={columns} />
      {/* // productData 배열의 각 요소를 매핑하여 key 속성을 추가한 새로운 객체를 생성
      // 객체 배열을 dataSource 속성에 전달하고
      // columns는 테이블의 컬럼을 정의하는 객체 배열
      // key 속성은 Table 컴포넌트에서 각 행을 식별하는 데 사용 */}
    </>
  );
}

export default ProductInfoList;
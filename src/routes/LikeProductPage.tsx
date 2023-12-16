import styled from "styled-components";
import HookingButton from "../components/HookingButton";
import ScreenContainer from "../components/ScreenContainer";
import PageHeader from "../components/mypage/PageHeader";
import ProductCardSmall from "../components/ProductCardSmall";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import BottomSheet from "../components/BottomSheet";
import { useEffect, useState } from "react";

const HookingButtons = styled.section`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ProductsContainer = styled.section`
  margin-top: 8px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
`;

const ResultNumber = styled.span`
  display: flex;
  justify-content: flex-start;

  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px; /* 183.333% */
  letter-spacing: -0.408px;
`;

const Options = styled.div`
  margin-top: 16px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SortingButton = styled.button`
  border: none;
  background-color: inherit;

  display: flex;
  align-items: center;
  gap: 4px;
`;

const SortingOption = styled.span`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 183.333% */
  letter-spacing: -0.408px;
`;

interface ProductProps {
  productNumber: number;
  productTitle: string;
  productPrice: number;
  productStock: number;
  productImageUrl: string;
  category: string;
  isDiscountedProduct: boolean;
  isNewProduct: boolean;
  isPopularProduct: boolean;
  productDiscountPrice: number;
  productTimeAdded: string;
  isHeart: boolean;
}

function LikeProductPage() {
  // Sort 버튼 클릭 Logic
  const [count, setCount] = useState(0); // 관심상품 개수 Count
  const [onSort, setOnSort] = useState(false);
  const [sortInitialized, setSortInitialized] = useState(false);
  const [sortCriterion, setSortCriterion] = useState("인기순");
  const onSortBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOnSort(true);
    setSortInitialized(true);
  };

  const [products, setProducts] = useState<ProductProps[]>([]);

  useEffect(() => {
    // Fetch hearts from the backend when the component mounts
    const fetchHearts = async () => {
      // async 왜 씀? .then.then.catch 대신 await로 코드 깔끔하게 가능
      try {
        // Send a request to your backend API to get all hearts for the current user
        const token = localStorage.getItem("accessToken");

        const response = await fetch(
          `${process.env.REACT_APP_DONG10_BASEURL}/hearts/products`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the request was successful (status code 200)
        if (response.ok) {
          // Parse the response JSON and set it to the state
          const pageData = await response.json();
          // Ensure data is an array before setting it to state
          const products = pageData.content;
          if (Array.isArray(products)) {
            setProducts(products);
            setCount(pageData.totalElements);
          } else {
            console.error("Data is not an array:", products);
          }
        } else {
          // Handle error cases
          console.error(
            "Failed to fetch hearts:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    // Call the fetchHearts function
    fetchHearts();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  const handleCartClick = async (item: any) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.REACT_APP_DONG10_BASEURL}/carts/productNumber/${item.productNumber}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert(`${item.productTitle}이 카트에 추가됐습니다!`);
      } else {
        // Handle error response
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      // Handle network error
      console.error("Error:", error);
    }
  };

  // 하트 삭제
  const handleHeartDelete = async (item: any) => {
    try {
      console.log("isHeart==true");
      const token = localStorage.getItem("accessToken");
      // 백엔드에서 하트 삭제
      const response = await fetch(
        `${process.env.REACT_APP_DONG10_BASEURL}/hearts/product/${item.productNumber}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // 삭제된 하트 제외하기
        setProducts((prevProducts: any[]) =>
          prevProducts.filter(
            (prevProduct: { productNumber: any }) =>
              prevProduct.productNumber !== item.productNumber
          )
        );
      } else {
        // Handle error response
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      // Handle network error
      console.error("Error:", error);
    }
  };

  return (
    <>
      <ScreenContainer>
        <PageHeader pageTitle="관심상품" />
        <HookingButtons>
          <HookingButton
            desc="요즘 인기 있는"
            pageName="인기상품"
            link="/allitems/hotitems"
          />
          <HookingButton
            desc="현명한 소비를 위한"
            pageName="할인상품"
            link="/allitems/discountitems"
          />
          <HookingButton
            desc="혹시 이건 어때요?"
            pageName="신상품"
            link="/allitems/newitems"
          />
        </HookingButtons>
        <Options>
          <ResultNumber>{`검색결과 ${count}`}</ResultNumber>
          <SortingButton onClick={onSortBtnClick}>
            <FontAwesomeIcon icon={faRightLeft as IconProp} rotation={90} />
            <SortingOption>
              {sortInitialized ? sortCriterion : "인기순"}
            </SortingOption>
          </SortingButton>
        </Options>
        <ProductsContainer>
          {/* API로부터 데이터 받아왔을 때는 map함수를 통해 ProductCardSamll 컴포넌트를 그리면 OK */}
          {products.map((product) => (
            // Use the properties of the heart.product object in the ProductCardSmall component
            <ProductCardSmall
              key={product.productNumber}
              name={product.productTitle}
              price={product.productPrice}
              stocks={product.productStock}
              imageUrl={product.productImageUrl}
              isHeart={true}
              onCartClick={() => handleCartClick(product)}
              onHeartClick={() => handleHeartDelete(product)}
            />
          ))}
        </ProductsContainer>
      </ScreenContainer>
      {sortInitialized && (
        <BottomSheet
          url={"hearts/products"}
          onSort={onSort}
          setOnSort={setOnSort}
          setResults={setProducts}
          setSortCriterion={setSortCriterion}
        />
      )}
    </>
  );
}

export default LikeProductPage;

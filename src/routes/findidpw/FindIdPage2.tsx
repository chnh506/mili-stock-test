import styled from "styled-components";
import ScreenContainer from "../../components/ScreenContainer";
import Logo from "../../components/Logo";
import TitleBox from "../../components/Title";
import BtnList from "../../components/BtnList";
import { Link, useLocation } from "react-router-dom";

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  margin: 32px 0;
`;

const Content = styled.h2`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px; /* 91.667% */
  letter-spacing: -0.408px;
`;

const StyledLink = styled(Link)`
  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  border-radius: 16px;

  background-color: #ff8200;
  color: white;
`;

function FindIdPage2() {
  const { state } = useLocation();
  return (
    <ScreenContainer>
      <Logo />
      <TitleBox TitleText="아이디 찾기" />
      <ContentBox>
        <Content>회원님의 아이디는</Content>
        <Content>{state.userId}</Content>
        <Content>입니다.</Content>
        <BtnList>
          <StyledLink to={"/"}>로그인하러 가기</StyledLink>
        </BtnList>
      </ContentBox>
    </ScreenContainer>
  );
}

export default FindIdPage2;

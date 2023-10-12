import Logo from "../../components/Logo";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import Button from "../../components/Button";
import BtnList from "../../components/BtnList";
import ScreenContainer from "../../components/ScreenContainer";
import TitleBox from "../../components/Title";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import GoBackButton from "../../components/GoBackButton";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;

  margin-top: 16px;
  padding: 10px 0;
  width: 100%;
`;

const PopupBackground = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.75);
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Popup = styled.div`
  width: 320px;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 53px 20px 97px 20px;
  border-radius: 16px;
  opacity: 0.95;
  background: #fff;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
`;

function FindPWPage3() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log(data);
    navigate("/findpw/success");
  };

  return (
    <ScreenContainer>
      <PopupBackground>
        <Popup>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input
              control={control}
              name="newPassword"
              rules={{ required: true }}
              placeholder="새 비밀번호"
            />
            <Input
              control={control}
              name="newPasswordConfirmation"
              rules={{ required: true }}
              placeholder="새 비밀번호 확인"
            />
            <BtnList>
              <GoBackButton />
              {/* <Button opacity={true} text="취소" /> */}
              <Button opacity={false} text="변경" />
            </BtnList>
          </Form>
        </Popup>
      </PopupBackground>
      {/* <Logo />
      <TitleBox
        TitleText="비밀번호 찾기"
        CaptionText="비밀번호를 찾기 위해 본인인증을 진행합니다."
      />
      <Form>
        <Dropdown
          control={control}
          name="job"
          disabled={false}
          rules={{ required: true }}
          placeholder="신분구분"
          options={["장교", "부사관", "병사", "군무원"]}
        />
        <Input
          control={control}
          name="name"
          disabled={false}
          rules={{ required: true }}
          placeholder="이름"
        />
        <Dropdown
          control={control}
          name="affiliation"
          disabled={false}
          rules={{ required: true }}
          placeholder="군구분"
          options={["육군", "해군", "공군", "해병대"]}
        />
        <Input
          control={control}
          name="serviceNumber"
          disabled={false}
          rules={{ required: true }}
          placeholder="군번"
        />
        <BtnList>
          <Button opacity={true} text="이전" />
          <Button opacity={false} text="본인인증" />
        </BtnList>
      </Form> */}
    </ScreenContainer>
  );
}

export default FindPWPage3;

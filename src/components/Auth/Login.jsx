import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from '@apollo/client';
import CircularProgress from "@material-ui/core/CircularProgress";
import { login } from "../../service";
import {
  StyledButtonContainer,
  StyledContainer,
  StyledExtraActionContainer,
  StyledFormContainer,
  StyledGuestButton,
  StyledInput,
  StyledInputContainer,
  StyledLinkContainer,
  StyledSection,
  StyledSubmit,
} from "./Styles";
import { routes } from "../../constants/routes";
import { USER_INFO_TEXT } from "../../constants";
import { saveInfo } from "../../utils/storage";
import { handleAuthError } from "../../utils/auth";

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  
  const [
    loginUser,
    { data, loading, error, reset },
  ] = useMutation(login);

  if (error) {
    handleAuthError(error);
    reset()
  }

  const { email, password } = formData;

  React.useEffect(() => {
    if (data) {
      const token = data?.login?.token;
      const userId = data?.login?.id;
      if(token) {
        saveInfo(USER_INFO_TEXT, { token, userId, email, name: email.split("@")[0] });
        navigate(routes.tracker)
      }
    }
  }, [data, email, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({
      variables: {
        email,
        password
      }
    })
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuestLogin = () => {
    setFormData({
      email: process.env.REACT_APP_GUEST_EMAIL,
      password: process.env.REACT_APP_GUEST_PASSWORD,
    });
  }


  const isEmpty = !email || !password;

  return (
    <StyledSection>
      <StyledContainer>
        <StyledFormContainer onSubmit={handleSubmit}>
          <StyledInputContainer>
            <StyledInput
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
          </StyledInputContainer>
          <StyledInputContainer>
            <StyledInput
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />
          </StyledInputContainer>
          <StyledInputContainer>
            {!loading ?
              <StyledSubmit disabled={isEmpty} type="submit" value="Sign In" />
            :
            <StyledButtonContainer>
              <CircularProgress />
            </StyledButtonContainer>
            }
          </StyledInputContainer>
          <StyledInputContainer>
            <StyledGuestButton onClick={handleGuestLogin} disabled={loading}>Guest login</StyledGuestButton>
          </StyledInputContainer>
        </StyledFormContainer>
        <StyledExtraActionContainer>
          <StyledLinkContainer>
              Not a member yet?  
              <Link to="/register">
                Sign Up
              </Link>
          </StyledLinkContainer>
        </StyledExtraActionContainer>
      </StyledContainer>
    </StyledSection>
  );
};

export default Login;

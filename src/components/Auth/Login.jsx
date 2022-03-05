import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { login } from "../../service";
import {
  StyledContainer,
  StyledExtraActionContainer,
  StyledFormContainer,
  StyledInput,
  StyledInputContainer,
  StyledLinkContainer,
  StyledSection,
  StyledSubmit,
} from "./Styles";
import { routes } from "../../constants/routes";
import { USER_INFO_TEXT, ERROR_TEXT } from "../../constants";
import { saveInfo } from "../../utils/storage";
import tost from "../../utils/toast";

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  
  const [
    loginUser,
    { data, error },
  ] = useMutation(login);

  if (error) {
    tost(ERROR_TEXT, "Something is wrong, please try again!");
  }

  React.useEffect(() => {
    if (data) {
      const token = data?.login?.token;
      const userId = data?.login?.id;
      if(token) {
        saveInfo(USER_INFO_TEXT, {token, userId});
        navigate(routes.tracker)
      }
    }
  }, [data, navigate]);

  const { email, password } = formData;

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
            <StyledSubmit disabled={isEmpty} type="submit" value="Sign In" />
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

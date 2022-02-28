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

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  
  const [
    loginUser,
    { data, loading, error },
  ] = useMutation(login);
  
  React.useEffect(() => {
    if (data) {
      const token = data?.login?.token;
      if(token) {
        localStorage.setItem("userInfo", JSON.stringify({token}));
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

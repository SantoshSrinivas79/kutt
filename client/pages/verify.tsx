import React, { useEffect } from "react";
import Router from "next/router";
import styled from "styled-components";
import cookie from "js-cookie";
import { Flex } from "reflexbox/styled-components";
import decode from "jwt-decode";

import BodyWrapper from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { NextPage } from "next";
import { TokenPayload } from "../types";
import { useStoreActions } from "../store";

interface Props {
  token?: string;
}

const MessageWrapper = styled(Flex).attrs({
  justifyContent: "center",
  alignItems: "center",
  my: 32
})``;

const Message = styled.p`
  font-size: 24px;
  font-weight: 300;

  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 16px;

  @media only screen and (max-width: 768px) {
    width: 26px;
    height: 26px;
    margin-right: 8px;
  }
`;

const Verify: NextPage<Props> = ({ token }) => {
  const addAuth = useStoreActions(s => s.auth.add);

  useEffect(() => {
    if (token) {
      cookie.set("token", token, { expires: 7 });
      const payload: TokenPayload = decode(token);
      addAuth(payload);
    }
  }, []);

  const goToHomepage = e => {
    e.preventDefault();
    Router.push("/");
  };

  const message = token ? (
    <Flex flexDirection="column" alignItems="center">
      <MessageWrapper>
        <Icon src="/images/check.svg" />
        <Message>Your account has been verified successfully!</Message>
      </MessageWrapper>
      <Button icon="arrow-left" onClick={goToHomepage}>
        Back to homepage
      </Button>
    </Flex>
  ) : (
    <MessageWrapper>
      <Icon src="/images/x.svg" />
      <Message>Invalid verification.</Message>
    </MessageWrapper>
  );
  return <BodyWrapper norenew>{message}</BodyWrapper>;
};

Verify.getInitialProps = async ({ req }) => {
  return { token: req && (req as any).token }; // TODO: types bro
};

export default Verify;
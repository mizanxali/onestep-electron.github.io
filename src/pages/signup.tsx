import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { SubmitHandler, useForm } from "react-hook-form";

import axios from "../../utils/api";
import { setCookie } from "../../utils/cookie";

import "../css/components.css";

interface IFormInput {
  email: string;
  username: string;
  password: string;
}

function Signup() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const { register, errors, handleSubmit } = useForm<IFormInput>({
    mode: "all",
  });

  const history = useHistory();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setLoading(true);
    axios
      .post("signup", {
        email: data.email,
        password: data.password,
        username: data.email,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.data) {
          setCookie("token", data.data.token);
          history.replace("/me");
        } else {
          setError(data.message || data[0].msg);
          setLoading(false);
        }
      })
      .catch(({ response }) => {
        setError(response.data.error);
        setLoading(false);
      });
  };

  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <main className="main">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div>
              <div className="text">Username</div>
              <input name="username" ref={register} className="input" />
            </div>
            <div>
              <div className="text">Email</div>
              <input
                name="email"
                type="email"
                ref={register({
                  required: { value: true, message: "Email required." },
                  pattern: {
                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email address.",
                  },
                })}
                className="input"
              />
            </div>
            <div>
              <div className="text">Password</div>
              <input
                name="password"
                type="password"
                ref={register({
                  required: { value: true, message: "Password required." },
                  minLength: {
                    value: 5,
                    message: "Min length is 5.",
                  },
                  maxLength: {
                    value: 30,
                    message: "Max length is 30.",
                  },
                })}
                className="input"
              />
            </div>
            <div>
              <div className="text">
                {(errors.email && errors.email.message) ||
                  (errors.password && errors.password.message)}
              </div>
              <button type="submit" className="input button">
                Sign Up
              </button>
            </div>
            <Link to="/login" className="text">
              Already have an account?
            </Link>
          </form>
        )}
      </main>
    </Layout>
  );
}

export default Signup;
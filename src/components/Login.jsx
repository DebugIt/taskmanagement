import React, { useContext, useEffect, useState } from 'react'
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { useNavigate } from 'react-router-dom'
import { CiDark, CiLight } from "react-icons/ci";
import toast from 'react-hot-toast';
import axios from 'axios';
import UserContext from '../context/UserContext';
import Cookies from "js-cookie"
import { ClipLoader } from 'react-spinners';

const Login = () => {

  const URL = process.env.REACT_APP_BASE_URL
  const { theme, setTheme } = useContext(UserContext)
  
  const navigate = useNavigate()
  const [formtype, setFormType] = useState("login")

  const [loading, setLoading] = useState(false)
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid Email").required("Email is required"),
    password: Yup.string().required(),
  })

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${URL}user/login`, values);
      toast.success(response?.data?.message);
      localStorage.setItem("isLoggedIn", true); 
      Cookies.set("token", response?.data?.data, {expires: 1,}); 
      navigate("/dashboard")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${URL}user/create`, values);
      toast.success(response?.data?.message);
      setFormType("login")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const cookie = Cookies.get("token");
    if (cookie) {
      navigate("/dashboard");
    }
  }, [])
  

  return (
    <div className='h-screen flex justify-center items-center'>
      <div id="container" className={` select-none space-y-2 border shadow-sm p-2 rounded-lg w-full max-w-[90%] md:max-w-[50%] xl:max-w-[30%] ${theme === "light" ? "" : "bg-dark_secondary border-none p-3 border-2 text-gray-50"} `}>
        <div id="heading-toggle" className='flex justify-between items-center'>
          <h1 className='text-2xl'>{formtype === "login" ? "Login" : "SignUp  "}</h1>
          <div id="button" onClick={() => {theme === "light" ? setTheme("dark") : setTheme("light")}} className={` border rounded-lg p-1 border-gray-200 cursor-pointer hover:scale-110 transition-all `}>
            {
              theme === "light" ? <CiDark className='text-lg' /> : <CiLight className='text-lg'/>
            }
          </div>
        </div>
        <div id="form">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={formtype === "login" ? handleLogin : handleSignup}
          >
            <Form className='space-y-2'>
              <div id="email">
                <Field 
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className={` ${theme === "dark" ? "form-field-dark" : "form-fields"} `}
                />
                <ErrorMessage 
                  name='email'
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <div id="password">
                <Field 
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className={` ${theme === "dark" ? "form-field-dark" : "form-fields"} `}
                />
                <ErrorMessage 
                  name='password'
                  component="div"
                  className="text-red-500 text-xs"
                />
              </div>

              <button className={` ${theme === "dark" ? "bg-dark_secondary text-gray-50" : ""} bg-secondary text-white p-2 rounded-lg w-full hover:bg-black transition-all `}>
                {
                  loading ? <ClipLoader color={theme === "dark" ? "white" : "white"}/> : formtype === "login" ? "Login" : "SignUp"
                }
              </button>
              <p className={` text-gray-400 text-sm md:text-xs hover:underline transition-all `} onClick={() => {formtype === "login" ? setFormType("signup") : setFormType("login")}}>{formtype === "login" ? "Don't" : "Already"} have an account ? {formtype === "login" ? "SignUp" : "Login"}</p>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Login
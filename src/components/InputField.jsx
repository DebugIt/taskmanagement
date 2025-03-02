import React, { useContext } from 'react'
import UserContext from '../context/UserContext'

const InputField = ({ type, placeholder, label, value, textfunc, }) => {

    const { theme, setTheme } = useContext(UserContext)

  return (
    <>
        <div id="container">
            {
                label && (
                    <div id="label">{label}</div>
                )
            }
            <div id="input">
                <input 
                    type={type} 
                    placeholder={placeholder}
                    value={value}
                    onChange={textfunc} 
                    className={` outline-none w-full border p-3 rounded-lg placeholder:text-gray-300 text-sm ${theme === "dark" ? "bg-dark border-none text-gray-50" : ""} `}
                />
            </div>
        </div>
    </>
  )
}

export default InputField
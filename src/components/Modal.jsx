import React, { useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import InputField from './InputField'
import { MdClose } from "react-icons/md"
import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from "js-cookie"

const Modal = ({ task, fetchTasks, setEdit }) => {

    const URL = process.env.REACT_APP_BASE_URL
    const { theme, setTheme } = useContext(UserContext)
    const [taskname, setTaskname] = useState(task.taskname || "")
    const [taskdescription, setTaskdescription] = useState(task.taskdescription || "")
    const [taskstatus, setTaskStatus] = useState(task.taskstatus || "Pending")
    const [duedate, setDuedate] = useState(
        task.duedate ? task.duedate.split('T')[0] : new Date().toISOString().split('T')[0]
      );
          

    const [loading, setLoading] = useState(false)

    const updateTask = async (id) => {
        setLoading(true);
        try {
            const body = {
                taskname: taskname,
                taskdescription: taskdescription,
                taskstatus: taskstatus,
                duedate: duedate
            }
            const response = await axios.put(`${URL}tasks/task/${id}`, body, {
                headers: {
                    "Content-Type": "application/json",
                    "token": Cookies.get("token")
                }
            });
            toast.success(response?.data?.message);
            setEdit(false)
            fetchTasks();
        } catch (error) {
          console.log(error)
          toast.error(error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
    }

  return (
    <>
        <div id="container" className={` bg-black bg-opacity-50 flex justify-center items-center absolute h-full w-full top-0 left-0`}>
            <div id="inner-container" className={` ${theme === "dark" ? "bg-dark_secondary" : "bg-white"} p-3 rounded-lg w-[95%] md:max-w-[40%] z-10 `}>
                <div className='flex justify-between items-center'>
                    <p>Update Details:</p>
                    <MdClose size={20} onClick={() => setEdit(false)}/>
                </div>
                <div id="othermenu" className={` mt-4 space-y-2 ${theme === "dark" ? "bg-dark_secondary" : ""} rounded-lg max-h-[50%] overflow-auto scrollbar-hide w-full`}>
                    <input type="text" placeholder='Enter Task Name' value={taskname} onChange={(e) => setTaskname(e.target.value)}  className={` outline-none p-3 rounded-lg border w-full md:text-sm ${theme === "dark" ? "bg-dark_secondary border-none text-gray-50" : ""} `}/>
                    <InputField 
                        type={"text"} 
                        placeholder={"Enter Task Description"} 
                        value={taskdescription}
                        textfunc={(e) => setTaskdescription(e.target.value)}
                    />
                    <select value={taskstatus} className={` outline-none w-full p-3 rounded-lg ${theme === "dark" ? "bg-dark text-gray-50 text-sm" : ""} `} onChange={(e) => setTaskStatus(e.target.value)}>
                        {/* <option value="">Select Task Status</option> */}
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <InputField 
                        type={"date"} 
                        placeholder={"Set due date"} 
                        value={duedate}
                        textfunc={(e) => setDuedate(e.target.value)}
                    />
                    <button onClick={() => updateTask(task._id)} className={` border p-3 w-full rounded-lg bg-black text-gray-50 ${theme === "dark" ? "border-none " : ""} `}>Update Task</button>
                </div>
            </div>
        </div>
    </>
  )
}

export default Modal
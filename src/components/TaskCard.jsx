import React, { useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import { CiCalendar, CiEdit, CiTrash } from 'react-icons/ci'
import { RiProgress5Line } from 'react-icons/ri'
import { FaCircleCheck } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import axios from 'axios'
import Modal from './Modal'
import Cookies from "js-cookie"


const TaskCard = ({ task, fetchTasks }) => {

  const URL = process.env.REACT_APP_BASE_URL

  const { theme, setTheme } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-GB"); // "DD/MM/YYYY"
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${URL}tasks/task/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "token": Cookies.get("token")
        }
      });
      toast.success(response?.data?.message);
      fetchTasks();
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={` border p-2 rounded-lg shadow-sm hover:shadow-md transition-all ${theme === "dark" ? "border-none bg-dark_secondary text-gray-400" : ""}`}>
      <div id="schedule-icon" className='flex justify-between items-center'>
        <CiCalendar className='text-lg'/>
        <div className='flex items-center gap-1'>
          <CiTrash onClick={() => deleteTask(task._id)} title='Delete' className='text-lg cursor-pointer hover:text-red-600 hover:scale-110 transition-all'/>
          <CiEdit onClick={() => setEdit(!edit)} title='Update' className='text-lg cursor-pointer hover:text-blue-600 hover:scale-110 transition-all'/>
        </div>
      </div>
      <div id="description" className='space-y-2'>
        <div id="title" className={` text-lg `}>{task.taskname}</div>
        <div id="description" className={` text-xs `}>{!task.taskdescription && "No description available"} {task.taskdescription.length > 100 ? task.taskdescription.slice(0, 100) + "Read more" : task.taskdescription}</div>
        <div className='flex gap-1 items-center'>
          <div id="status" className={` text-xs p-1 px-3 rounded-full font-semibold border-2 ${task.taskstatus === "Pending" ? "bg-red-200 text-red-600 border-red-600" : task.taskstatus === "In Progress" ? "bg-yellow-200 text-yellow-600 border-yellow-600" : "bg-green-200 text-green-600 border-green-600"} `}>
            {task.taskstatus} 
          </div>
        </div>
        <div id="date" className='text-xs font-semibold'>Due: {task.duedate ? formatDate(task.duedate) : "No due date"}</div>
      </div>
      {
        edit && (
          <Modal task={task} fetchTasks={fetchTasks} setEdit={setEdit}/>
        )
      }
    </div>
  )
}

export default TaskCard
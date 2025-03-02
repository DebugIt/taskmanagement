import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../context/UserContext'
import { CiDark, CiLight, CiLogout } from 'react-icons/ci'
import InputField from './InputField'
import TaskCard from "./TaskCard"
import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from "js-cookie"
import { ClipLoader } from "react-spinners"
import { useNavigate } from 'react-router-dom'


const Dashboard = () => {

  const URL = process.env.REACT_APP_BASE_URL
  const { theme, setTheme } = useContext(UserContext)

  const [openOthermenu, setOpenOthermenu] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [taskname, setTaskname] = useState("")
  const [taskdescription, setTaskdescription] = useState("")
  const [taskstatus, setTaskStatus] = useState("Pending")
  const [duedate, setDuedate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState([])
  const [status, setstatus] = useState("")

  const [noTaskToastShown, setNoTaskToastShown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  const navigate = useNavigate()

  const fetchTasks = async () => {
    setLoading(true);
    try {
        const response = await axios.get(`${URL}tasks/task?status=${status}&page=${currentPage}&limit=${limit}`, {
            headers: {
                "Content-Type": "application/json",
                "token": Cookies.get("token")
            }
        });

        setTasks(response?.data?.data?.tasks || []);
        setTotalPages(response?.data?.data?.totalPages || 1)
        setOpenOthermenu(false)
        setNoTaskToastShown(false)
    } catch (error) {
        if(error?.response?.data?.status === 403 || error?.response?.data?.status === 401){
            Cookies.remove("token")
            toast.error("Kindly Login")
            window.location.href = "/"
        }
        else if (error.response?.data?.status === 404){
            // toast.error("No tasks found")
            setNoTaskToastShown(true)
        }
        else{
            toast.error(error?.response?.data?.message)
        }
        setTasks([]);
    } finally {
        setLoading(false);
    }
  }


  const createTask = async () => {
    setLoading(true);
    try {
        if(taskname === ""){
            toast.error("Task name is required");
            return
        }
        const body = {
            taskname: taskname,
            taskdescription: taskdescription,
            taskstatus: taskstatus,
            duedate: duedate
        }
        const response = await axios.post(`${URL}tasks/task`, body, {
            headers: {
                "Content-Type": "application/json",
                "token": Cookies.get("token")
            }
        });
        toast.success(response?.data?.message);
        setTaskname("");
        setTaskdescription("");
        setTaskStatus("Pending");
        setDuedate("");
        fetchTasks()
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])
  
  useEffect(() => {
    fetchTasks()
  }, [status, currentPage])
  

  return (
    <>
        <div id="container" className={` h-screen overflow-auto scrollbar-hide `}>
            <div id="heading" className={` m-4 flex justify-between items-center text-2xl ${theme === "dark" ? "text-gray-50" : ""} `}>
                <h1>Sprintly</h1>
                <div className='flex justify-center items-center gap-1'>
                    <div id="button" onClick={() => {theme === "light" ? setTheme("dark") : setTheme("light")}} className={` border rounded-lg p-1 border-gray-200 cursor-pointer hover:scale-110 transition-all `}>
                    {
                        theme === "light" ? <CiDark className='text-lg' /> : <CiLight className='text-lg'/>
                    }
                    </div>
                    <div id="button" onClick={() => {Cookies.remove("token"); navigate("/")}} className={` border rounded-lg p-1 border-gray-200 cursor-pointer hover:scale-110 transition-all `}>
                        <CiLogout className='text-lg'/>
                    </div>
                </div>
            </div>
            <div id="creation" onClick={() => setOpenOthermenu(!openOthermenu)} className={` flex justify-center items-center m-4`}>
                <input type="text" placeholder='Enter Task Name' value={taskname} onChange={(e) => setTaskname(e.target.value)}  className={` outline-none p-3 rounded-lg border w-full md:w-[50%] md:text-sm ${theme === "dark" ? "bg-dark_secondary border-none text-gray-50" : ""} `}/>
            </div>
            <div id="filters" className={` ${openOthermenu ? "hidden" : ""} flex gap-3 justify-center items-center `}>
                <div onClick={() => {status === "Pending" ? setstatus("") : setstatus("Pending")}} id="pending" className={` select-none cursor-pointer border-2 border-red-600 p-1 px-2 rounded-full text-sm md:text-xs font-semibold  ${status === "Pending" ? "bg-red-600 text-white" : "bg-red-200 text-red-600"} `}>Pending</div>
                <div onClick={() => {status === "InProgress" ? setstatus("") : setstatus("InProgress")}} id="in-progress" className={` select-none cursor-pointer border-2 border-yellow-600 p-1 px-2 rounded-full text-sm md:text-xs font-semibold ${status === "InProgress" ? "bg-yellow-600 text-white" : "bg-yellow-200 text-yellow-600"} `}>In Progress</div>
                <div onClick={() => {status === "Completed" ? setstatus("") : setstatus("Completed")}} id="completed" className={` select-none cursor-pointer border-2 border-green-600 p-1 px-2 rounded-full text-sm md:text-xs font-semibold ${status === "Completed" ? "bg-green-600 text-white" : "bg-green-200 text-green-600"} `}>Completed</div>
            </div>
            <div className='flex justify-center items-center mt-2 mx-4 mb-4 transition-all'>
                {
                    openOthermenu && (
                        <div id="othermenu" className={` space-y-2 p-2 ${theme === "dark" ? "bg-dark_secondary" : "border"} rounded-lg max-h-[50%] overflow-auto scrollbar-hide w-full md:w-[50%] `}>
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
                            <button onClick={createTask} className={` border p-3 w-full rounded-lg bg-black text-gray-50 ${theme === "dark" ? "border-none " : ""} `}>
                                {
                                    loading ? <ClipLoader /> : <span>Add Task</span>
                                }
                            </button>
                        </div>
                    )
                }
            </div>

            <div className='flex justify-center items-center'>
                {
                    loading && <ClipLoader color={` ${theme === "dark" ? "white" : "black"} `}/>
                }
            </div>
            <div id="taskcards" className='m-4 md:mx-[5%] xl:mx-[10%] grid gap-2 grid-cols-1 md:grid-cols-3 xl:grid-cols-4'>
                {
                    tasks.length > 0 ? (
                        <>
                            {
                                tasks.map((task, index) => (
                                    <div key={index}>
                                        <TaskCard task={task} fetchTasks={fetchTasks}/>
                                    </div>
                                ))
                            }
                        </>
                    ) : (
                        !loading && <p className={` ${theme === "dark" ? "text-gray-200" : ""} `}>No Tasks found, add a new one :)</p>
                    )
                }
            </div>

            <div className={`flex justify-center items-center gap-4 my-4 ${theme === "dark" ? "text-white" : ""}`}>
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-1 px-4 border text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-1 px-4 border text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>
    </>
  )
}

export default Dashboard
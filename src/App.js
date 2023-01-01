import { useState,useEffect } from "react"
import AddTask from "./components/AddTask";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from "./components/Tasks";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import About from "./components/About";

const App=()=> {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() =>{
    const getTasks = async()=>{
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  },[])
  //fetch tasks
  const fetchTasks = async ()=>{
    const res = await fetch('https://my-json-server.typicode.com/517shivani/json-server/tasks')
    const data = await res.json()
      return data
  }
   //fetch tasks
   const fetchTask = async (id)=>{
    const res = await fetch(`https://my-json-server.typicode.com/517shivani/json-server/tasks${id}`)
    const data = await res.json()
      return data
  }
//Delete Task
const deleteTask = async(id)=>{
  await fetch(`https://my-json-server.typicode.com/517shivani/json-server/tasks/${id}`,
  {
    method : 'DELETE',
  })
  setTasks(tasks.filter((task)=> task.id !== id))
}
//toggle reminder
const toggleReminder = async(id) =>{
  const taskToToggle = await fetchTask(id)
  const updatedTask = {...taskToToggle,
  reminder: !taskToToggle.reminder}

  const res = await fetch(`https://my-json-server.typicode.com/517shivani/json-server/tasks/${id}`,{
    method:'PUT',
    headers : {
      'Content-type':'application/json'
    },
    body : JSON.stringify(updatedTask)
  })
  const data = await res.json()
  setTasks(tasks.map((task)=> task.id === id  ? {...task, reminder: !data.reminder}:task ))
}
//add task
const addTask= async(task)=>{
  const res = await fetch('https://my-json-server.typicode.com/517shivani/json-server/tasks',{
    method : 'POST',
    headers : {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(task),
  })
  const data = await res.json()
  setTasks([...tasks, data]);
  // const id = Math.floor(Math.random()* 10000) +1
  // const newTask = {id, ...task}
  // setTasks([...tasks, newTask])
}
  return (
    <Router>
    <div className="container">
     <Header 
      onAdd={()=>setShowAddTask(!showAddTask )} 
      showAdd={showAddTask} /> 
     
     <Routes>
      <Route path="/" element = {
        <>
        {showAddTask && <AddTask onAdd={addTask}/>}
        {tasks.length>0 ? (
        <Tasks tasks = {tasks} onDelete={deleteTask} onToggle = {toggleReminder}/>
        ) :
        ( 'No Task to show' )}
        </>
        }
     />        
     <Route path = "/about" element={<About />} />
     </Routes>
     <Footer />
    </div>
    </Router>
  );
}

export default App;

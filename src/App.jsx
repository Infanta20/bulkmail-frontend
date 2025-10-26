import { useState } from 'react'
import './App.css'
import axios from 'axios'

import * as XLSX from 'xlsx'

function App() {

  const [msg, setmsg] = useState('')
  const [status, setstatus] = useState('')
  const [emailList, setEmailList] = useState([

  ])

  function handlemsg(event){
    setmsg(event.target.value)
  }

  function handlefile(event){
    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader()
    reader.onload = function (e){
    const data = e.target.result;
    const workbook = XLSX.read(data,{type:'binary'})
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const emailList = XLSX.utils.sheet_to_json(worksheet,{header:"A"})
    const totalmail = emailList.map(function(item){return item.A})
    console.log(totalmail)
    setEmailList(totalmail)
  } 

  reader.readAsBinaryString(file)
}

function send() {
  setstatus(true);
  axios
    .post("https://bulkmail-backend-git-main-infantas-projects.vercel.app/sendMail", { msg: msg, emailList: emailList })
    .then(function (response) {
      if (response.data.success === true) {
        alert(
          `Sent: ${response.data.sent}\n` +
            `Failed: ${response.data.failed}\n` +
            (response.data.failedEmails.length > 0
              ? "Failed emails:\n" + response.data.failedEmails.join('\n')
              : "All emails sent successfully!")
        );
      } else {
        alert("Failed");
      }
      setstatus(false); // always reset after send
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("Failed to send email");
      setstatus(false);
    });
}




  return (
    <div>
      <div className='bg-green-900 justify-center flex p-4'>
        <h1 className=' text-white text-2xl'>Bulk Mail</h1>
      </div>
        <div className='bg-green-800 justify-center flex p-4'>
        <h1 className=' text-white font-medium'>We can help your business with sending multiple emails at once</h1>
      </div>
       <div className='bg-green-700 justify-center flex p-4'>
        <p className=' text-white'> Drag and Drop</p>
      </div>
     <div className='bg-green-600 p-4 text-white'>
        <div className='flex justify-center mb-4'>
          <textarea onChange={handlemsg} value={msg}
            className="w-[80%] h-32 outline-double border-black rounded py-2 px-2 text-black"  
            placeholder='Enter your email body here....'
          />
        </div>
        
        <div className='flex justify-center p-2'>
          <input 
            type='file'
            onChange={handlefile}
            className='border-2 border-dashed border-white rounded py-5 px-4 hover:cursor-pointer bg-green-500' 
          />
        </div>
        
<p className='text-center mt-4'> Total emails in the file : {emailList.length}</p>
<div className='text-center'>
  <button
    onClick={send}
    className='mt-4 bg-gray-800 p-4 hover:bg-gray-500'
    disabled={status}
  >
    {status ? "Sending..." : "Send"}
  </button>
</div>
</div>

      <div>
       
      </div>
    </div> 
  )
}

export default App

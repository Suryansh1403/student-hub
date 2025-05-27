import { useOneVOne } from '@/context/1v1Context'
import { QuestionWithExamples } from '@/lib/types'
import React from 'react'
type Data = {
  status:boolean,
     testcase: string|null,
        expected: string|null,
        got: string|null,
        message: string,
}
const CodeSubmit = ({question,localKey}:{question:QuestionWithExamples,localKey:string}) => {

  const {socket,userId,roomId} = useOneVOne()

const runCode = async () => {

  const code = localStorage.getItem(localKey);

  const res = await fetch("/api/code/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
    question
    }),
  });

  const data:Data = await res.json();
  
  // if(data.status){
  console.log(data)
socket.emit("leaderboard-update",{
userId,
score:100,
roomId:roomId,
questionId:question.id,
correct:data.status
      })

       socket.on("leaderboard-update", ({leaderboard})=>{
console.log("leaderboard-update",leaderboard);
      })
  
}
return <button onClick={()=>runCode()}>
    submit
</button>

}
export default CodeSubmit
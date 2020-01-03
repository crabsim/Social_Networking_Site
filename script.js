//client side of socket
const socket=io('http://localhost:3001')
socket.on('chat-message',data=>{
    console.log(data)
})
const messageform=document.getElementById('send-container ')
messageform.addEventListener('submit',e=>{
    //stops page from refreshing
    e.preventDefault()
})
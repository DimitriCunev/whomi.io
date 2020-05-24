var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let rooms = {}
let clients = {}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  


io.on('connection',(socket)=>{
    

    socket.on('requestConnection',(data)=>{    
        let accepted = true;
        if (!rooms[data.room]){
            rooms[data.room] = {clients:[{alias:data.alias,sid:socket.id,style:{color:1,eyes:1,mouth:1,hat:1}}]}
        } else {
            if(!rooms[data.room].locked){
                rooms[data.room].clients.forEach(e=>{
                    socket.emit('peerJoin',{alias:e.alias,sid:e.sid,style:{color:1,eyes:1,mouth:1,hat:1}})
                })
                
                rooms[data.room].clients.push({alias:data.alias,sid:socket.id,style:{color:1,eyes:1,mouth:1,hat:1}})
            } else {
                accepted = false;
            }
            
        }
        if(accepted){
            socket.emit('hello','Welcome!')
            clients[socket.id] = {room:undefined,alias:undefined,status:false,secret:''}
            clients[socket.id].room = data.room;
            clients[socket.id].alias = data.alias;
            clients[socket.id].status = false;;
            socket.join(data.room)
            console.log(`Client joined ${data.room}`)
            io.to(data.room).emit('peerJoin',{alias:data.alias,sid:socket.id,style:{color:1,eyes:1,mouth:1,hat:1}})
        }
        
    })
    socket.on('changeStatus',(data)=>{
        try {
            let sendroom = clients[data.sid].room
            clients[data.sid].status = data.status;
            io.to(sendroom).emit('changeStatus',{sid:data.sid,status:data.status})
            let start = true;
            let ots = rooms[clients[data.sid].room].clients.map(e=>e.sid)
            ots.forEach((e)=>{
                if(!clients[e].status){start = false;}
            })

            if(start){
                if(rooms[sendroom].clients.length>1){
                    io.to(sendroom).emit('startGame',`Let's go!`)
                } else {
                    socket.emit('error','You seem to be alone in the room...')
                }
                
                rooms[sendroom]['locked']=true
                shuffle(ots)
                ots = ots.map((e,i)=>{if(i%2==0){return [ots[i],ots[i+1]]} else {return 0}}).filter(e=>e?1:0)
                io.to(sendroom).emit('pairName',ots)
                
            }
        } catch (error) {
            
        }
        
    })

    socket.on('sendName',(data)=>{
        clients[data.sid].secret = data.name
        let sendroom = clients[data.sid].room
        io.to(sendroom).emit('playerName',{sid:data.sid,name:data.name})
    })

    socket.on('disconnect',()=>{
        try {
            console.log(`Client gone from ${clients[socket.id].room}`)   
            io.to(clients[socket.id].room).emit('peerLeave',socket.id)
            if(rooms[clients[socket.id].room]){
                for (let i = 0; i < rooms[clients[socket.id].room].clients.length; i++) {
                    let current = rooms[clients[socket.id].room].clients[i]
                    if(current.sid==socket.id){rooms[clients[socket.id].room].clients.splice(i,1);break;}
                }
            }
        } catch (error) {
            
        }
        
        
        //console.log('Clients: '+rooms[clients[socket.id].room].clients.map(e=>e.sid))
        delete clients[socket.id]  
    })
})


http.listen(8080, function(){
    console.log('Server is running on port 8080');
});
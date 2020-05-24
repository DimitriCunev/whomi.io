//connectToLobby()


function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function createRoom(){
    room = makeid(7)
    window.location.href = `/?room=${room}`;
    //document.querySelector("body > div.container").innerHTML = ''
    //connectToLobby();
}


function joinRoom(data){
    room = data
    document.querySelector("body > div.container").innerHTML = `
    <br>
    <img style="height:190px;text-align:center;" class="center" src = "images/logos.gif"></img>
    <br>
    <div class="row row justify-content-md-center text-center">
    <div class="col-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">You have joined a room</h5>
          <p class="card-text">Choose a nickname, not game-related , just for your friends to know it's really you! 🤠 </p>
          <input class="form-control mb-3" type="text" placeholder="Enter your name">
          <!-- <a href="#" class="btn btn-success btn-lg btn-block">Enter room</a> -->
          <a href="#" onclick="connectToLobby()" class="btn btn-success btn-block">Join</a><br>
        </div>
        
      </div>
    </div>
    </div>`
        //connectToLobby()
}

connected = false;
let nickname = 'tester'
let room = 'ABCDE'

let others = {}

function connectToLobby(){
    nickname = document.querySelector("body > div.container > div > div > div > div > input").value
    if(nickname!=''){
        client = io.connect('http://192.168.0.31:8080')

        client.on('connect',()=>{
            client.emit('requestConnection',{alias:nickname,room:room})
        })
        
        client.on('hello',(data)=>{
            onConnection()
        })
        
        client.on('changeStatus',(data)=>{
            for (let i = 0; i < players.length; i++) {
                if(players[i].sid==data.sid){
                    players[i].updateStatus(data.status)
                    break;
                }
                
            }
            //others[data.sid]
        })
        
        client.on('peerJoin',(data)=>{
            if(data.sid!=client.id){
                others[data.sid] = data
                //console.log(others)
            }
            updateRoom()
            
        })
        
        client.on('startGame',(data)=>{
            startGame()
        })


        client.on('playerName',(data)=>{
            setName(data)
        })

        client.on('peerLeave',(data)=>{
            delete others[data]
            updateRoom()
        })

        client.on('pairName',(data)=>{
            for (let i = 0; i < data.length; i++) {
                if(data[i][1]&&data[i][0]){
                    if(data[i][0]==client.id){
                        invokePair(data[i][1])
                        break;
                    }
                    if(data[i][1]==client.id){
                        invokePair(data[i][0])
                        break;
                    }
                }
                
            }
        })

        client.on('error',(data)=>{
            
        })
        document.querySelector("body > div.container").innerHTML = ``
        //document.querySelector("#menu").innerHTML = ``
        document.querySelector("#menu").innerHTML = `
        <br>
        <div class="row row justify-content-md-center text-center">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Wait for the others..</h5>
              <p class="card-text">When everyone is ready , press the button and the game will start 🤠</p>
              <a href="#" onclick="setReady(true)" class="btn btn-success btn-block">Ready!</a><br>
              <p class="card-text">Share this link with your friends , in order for them to join <h5>${window.location}</h5></p>
            </div>
            
          </div>
        </div>
        </div>`
    } else {
        document.querySelector("#menu > div > div > div > div > p:nth-child(2)").innerHTML = 'Wait.. are you a ghost ? 👻'
    }
    
    
    
   

}

let ready = false;

function setReady(){
    ready = !ready
    players.forEach(e=>{
        if(e.sid=='you'){
            e.updateStatus(ready)
        }
    })
    
    if (!ready){
        document.querySelector("#menu > div > div > div > div > a").innerHTML = 'Ready!'
        document.querySelector("#menu > div > div > div > div > a").className = `btn btn-success btn-block`
        client.emit('changeStatus',{sid:client.id,status:ready})
    } else {
        document.querySelector("#menu > div > div > div > div > a").innerHTML = 'Unready!'
        document.querySelector("#menu > div > div > div > div > a").className = `btn btn-danger btn-block`
        client.emit('changeStatus',{sid:client.id,status:ready})
    }
}
let sentTo = ''
function invokePair(data){
    document.querySelector("#exampleModal > div > div > div.modal-body > h6").innerHTML= 
    `You should give a name to ${others[data].alias} 🙄`
    sendTo = data
    $('#exampleModal').modal()
}
let gameStarted = false;
function startGame(){
    gameStarted = true;
    document.querySelector("#menu").innerHTML = `
    <div class="row row text-center">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Game Panel</h5>
              <p class="card-text">Ask a question if it's your turn ! 👀</p>
              
              <div class="input-group mb-3">
                <input class="form-control" type="text" placeholder="Enter question">
                <div class="input-group-append">
                  <button class="btn btn-success" type="button">Ask!</button>
                </div>
              </div>
              <div class="btn-group btn-group-lg mt-3" role="group" aria-label="Basic example">
                <button type="button" class="btn btn btn-outline-secondary"><img src="images/yesbutton.gif" alt="" srcset=""></button> 
                <button type="button" class="btn btn btn-outline-secondary"><img src="images/nobutton.gif" alt="" srcset=""></button>
              </div>
              
            </div>
            
          </div>
        </div>
        </div>
    `
    for (let i = 0; i < players.length; i++) {
            players[i].updateStatus('nani')

        
    }
}
function setName(data){
    if(others[data.sid]){
        others[data.sid]['secret'] = data.name
        for (let i = 0; i < players.length; i++) {
            if(players[i].sid==data.sid){
                players[i].setSecret(data.name)
                break;
            }
            
        }
    }
    
}
function sendName(){
    let queueName = document.querySelector("#exampleModal > div > div > div.modal-body > input").value
    client.emit('sendName',{sid:sendTo,name:queueName})
}


function onConnection(){
    updateRoom()
    connected = true;

}
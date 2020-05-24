
const currentRoom = new URLSearchParams(window.location.search).get('room');




if (currentRoom!==null){
    joinRoom(currentRoom)
} else {
    document.querySelector("body > div.container").innerHTML = `<br>
    <img style="height:190px;text-align:center;" class="center" src = "images/logos.gif"></img>
    <br>
    <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Welcome to Namml</h5>
          <p class="card-text">A game where you have to guess your name!</p>
          <!-- <input class="form-control mb-3" type="text" placeholder="Enter your name"> -->
          <!-- <a href="#" class="btn btn-success btn-lg btn-block">Enter room</a> -->
          <a href="#" onclick="createRoom()" class="btn btn-primary btn-block">Create private room</a>
        </div>
        
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">News</h5>
          
          <p class="card-text">No news for today i guess...</p>
        </div>
        
      </div>
    </div>
  </div>
    
    `
}
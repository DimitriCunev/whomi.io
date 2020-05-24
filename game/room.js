let players = []
let playerCount = 0
function updateRoom(){
    players = []
    document.querySelector("#game>#players").innerHTML = ""
    players.push(new Player({sid:'you',type:1,name:`You (${nickname})`,style:{color:1,eyes:1,mouth:1,hat:1},secret:''}))
    Object.keys(others).forEach(e=>{
        players.push(new Player({sid:others[e].sid,type:1,name:others[e].alias,style:others[e].style,secret:others[e].secret}))
    })
}



class Player {
    constructor(data){
        this.sid = data.sid
        console.log(this.sid)
        this.id = playerCount;
        playerCount+=1;
        this.type = data.type
        this.name = data.name
        this.style = data.style
        this.secret = data.secret
        this.ready = false;
        document.querySelector("#game>#players").innerHTML+=`
        <div id = "player${this.id}" class = "player">
            <h3 class = "outlined">${this.name}</h3>
            <h3 style="position:absolute;margin-top:-190px;" id = "tag${this.id}">${this.secret?(this.secret.split('').length<7)?this.secret:this.secret.split('').map((e,i)=>i!=7?e:e+':').join(''):''}</h3>
        </div>`
        
        
        this.body = new betterAnim([`images/body.gif`],130,this.id,'z-index:3')
        this.color = new betterAnim([`images/color/color${this.style.color}.gif`],130,this.id,`position:absolute;margin-left:-1px;margin-top:-36px;z-index:1`)
        this.eyes = new Anim([`images/eyes/eyes${this.style.eyes}-1.png`,`images/eyes/eyes${this.style.eyes}-2.png`],this.id,130,`position:absolute;margin-top:-36px;z-index:2`)
        this.mouth = new Anim([`images/mouth/mouth${this.style.mouth} (1).png`,`images/mouth/mouth${this.style.mouth} (2).png`],this.id,130,`position:absolute;margin-top:-36px;z-index:2`)  
        let tempvar1 = Math.ceil(Math.random()*7)
        if(!gameStarted){
            this.emote = new betterAnim(`images/no.gif`,80,this.id,`position:absolute;margin-top:-162px;z-index:2`)
        
        }
        
        this.foie = new Anim([`images/paper${tempvar1}.png`,`images/paper${tempvar1}.png`],this.id,180,`margin-bottom:-50px`)
    } 
    updateStatus(status){
        if(status =='nani'){
            this.emote.rip()
        } else {
            this.ready = status;
            if (status){
                this.emote.gif = `images/ye.gif`
            } else {
                this.emote.gif = `images/no.gif`
            }
            this.emote.update()
        }
        
        
    }
    setSecret(secret){
        document.querySelector(`#tag${this.id}`).innerHTML = secret
    }

}
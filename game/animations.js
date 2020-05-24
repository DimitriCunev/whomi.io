let animId = 1;
class Anim{
    constructor(data,block,size,style){
        this.size = size
        this.style = ''+style
        this.animId = animId
        animId+=1;
        this.frames = [data[0],data[1]]
        //console.log(this.frames)
        this.currentFrame = 0
        this.block = block
        let interv = setInterval(()=>{
            if(this.currentFrame==0){
                this.currentFrame = 1
            } else {
                this.currentFrame = 0
            }
            try {
                document.querySelector("#anim"+this.animId).src = this.frames[this.currentFrame]
            } catch (error) {
                clearInterval(interv)
            }
            
        },250)
    

        //Pushing the object
        document.querySelector(`#game>#players>#player${this.block}`).innerHTML+=`
            <img style = "${this.style}" id="anim${this.animId}" src = "${this.frames[this.currentFrame]}" width = ${this.size} height = ${this.size}></img>
        `
    }
    
}

class betterAnim {
    constructor(gif,size,block,style){
        this.gif = gif
        this.size = size
        this.style =''+style
        this.animId = animId
        this.block = block
        animId+=1;
        
        document.querySelector(`#game>#players>#player${this.block}`).innerHTML+=`
            <img style = "${this.style}" id="anim${this.animId}" src = "${this.gif}" width = ${this.size} height = ${this.size}></img>
        `
        try {
            document.querySelector("#anim"+this.animId).src = this.gif
        } catch (error) {
            
        }
    }
    update(){
        try {
            document.querySelector("#anim"+this.animId).src = this.gif
        } catch (error) {
            
        }
    }
    rip(){
        try {
            document.querySelector("#anim"+this.animId).remove()
        } catch (error) {
            
        }
    }
}
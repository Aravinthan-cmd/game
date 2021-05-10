class AudioController{
    constructor(){
        this.bgMusic=new Audio('Assets/Audio/creepy.mp3');
        this.flipSound=new Audio('Assets/Audio/flip.wav');
        this.gameOverSound=new Audio('Assets/Audio/gameOver.wav');
        this.matchSound=new Audio('Assets/Audio/match.wav');
        this.victorySound=new Audio('Assets/Audio/victory.wav');
        this.bgMusic.volume=0.5;
        this.bgMusic.loop=true;
    }
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime=0;
    }
    flipMusic(){
        this.flipSound.play();
    }
    matchMusic(){
        this.matchSound.play();
    }
    gameOverMusic(){
        this.stopMusic();
        this.gameOverSound.play();
    }
    victoryMusic(){
        this.stopMusic();
        this.victorySound.play();
    }
}

class MixorMach{
    constructor(totalTime,cards){
        this.cardArray=cards;
        this.totalTime=totalTime;
        this.timeRemaining=totalTime;
        this.timer=document.getElementById('reming-time');
        this.ticker=document.getElementById('flips');
        this.audioController=new AudioController();
    }
    startGame(){
        this.cardToCheck=null;
        this.totalCliks=0;
        this.timeRemaining=this.totalTime;
        this.matchCard=[];
        this.busy=true;

        setTimeout(()=>{
            this.audioController.startMusic();
            this.shuffleCards();
            this.countdown=this.startCountdown();
            this.busy=false;
        },500);
        this.hideCards();
        this.timer.innerText=this.timeRemaining;
        this.ticker.innerText=this.totalCliks;
    }
    hideCards(){
        this.cardArray.forEach(card=>{
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCards(cards){
        if(this.cardFlipCard(cards)){
            this.audioController.flipMusic();
            this.totalCliks++;
            this.ticker.innerText=this.totalCliks;
            cards.classList.add("visible");

            if(this.cardToCheck){
                this.checkforcardMatch(cards);
            }else{
                this.cardToCheck=cards;
            }
        }
    }
    checkforcardMatch(cards){
        if(this.getcardType(cards)===this.getcardType(this.cardToCheck)){
            this.cardMatch(cards,this.cardToCheck);
        }else{
            this.misMatch(cards,this.cardToCheck);
        }
        this.cardToCheck=null;
    }
    cardMatch(card1,card2){
        this.matchCard.push(card1);
        this.matchCard.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.matchMusic();
        console.log(this.matchCard);
        if(this.matchCard.length===this.cardArray.length){
            this.victory();
        }
    }
    misMatch(card1,card2){
        this.busy=true;
        setTimeout(()=>{
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy=false;
        },1000);
    }
    getcardType(cards){
        return cards.getElementsByClassName('card-value')[0].src;
    }
    startCountdown(){
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText=this.timeRemaining;
            if(this.timeRemaining===0){
                this.gameOver();
            }
        }, 1000);
    }
    gameOver(){
        clearInterval(this.countdown);
        this.audioController.gameOverMusic();
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory(){
        clearInterval(this.countdown);
        this.audioController.victoryMusic();
        document.getElementById('victory-text').classList.add('visible');
    }
    shuffleCards(){
        console.log(this.cardArray);
        for(var i=this.cardArray.length-1;i>0;i--){
            var random=Math.floor(Math.random()*(i+1));
            this.cardArray[random].style.order=i;
            this.cardArray[i].style.order=random;
        }
        
    }
    cardFlipCard(cards){
        return (!this.busy && !this.matchCard.includes(cards) && cards!==this.cardToCheck)
    }
}

function ready(){
    var overlay=Array.from(document.getElementsByClassName('overlay-text'));
    var cards=Array.from(document.getElementsByClassName("card"));
    var game=new MixorMach(100,cards);

    overlay.forEach(overlay=>{
        overlay.addEventListener('click',()=>{
            overlay.classList.remove('visible');

            var audio =new AudioController();
            audio.startMusic();
            game.startGame();
        });
    });

    
    cards.forEach(cards=>{
        cards.addEventListener('click',()=>{
            game.flipCards(cards);
        });
    });
}

if(document.readyState==='loading'){
    document.addEventListener('DoMcontentLoaded',ready());
}else{
    ready();
}

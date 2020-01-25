
let corps = document.querySelector(".corps"),
    main = document.querySelector("main"),
    headleft = document.querySelector(".head .left"),
    content = document.querySelector(".scroll-content"),
    section = document.querySelectorAll("section"),
    dots = document.querySelector("ul.section-dot"),
    outside = document.querySelector(".clickoutside"),
    enlarge = document.querySelector(".enlarge > use"),
    infofls = document.querySelector(".infofullscreen"),
    infoswp = document.querySelector(".infoscrollleft"),
    topPosition,
    setPosition,
    wheelTimeout,
    wheelCount = 0,
    ts;

    // CRT ANIM

let anim1, anim2, anim3;

    console.log("sections = " + section.length);


// ---------------------------------------------------------

// ON ETABLIT LA POSITION DES SECTIONS

for (i = 0; i < section.length; ++i) {

    section[i].style.top = i * 100 + "%";

    // On ajoute les points correspondants
    let li = document.createElement("li");
    let divli = document.createElement("div");

    divli.textContent = section[i].getAttribute("data-name");

    dots.appendChild(li);
    li.appendChild(divli);

}

// ---------------------------------------------------------

// Circles animation function

    // ProgressCircle(<element svg cible>, <taille du cercle>, <taille bordure>, <angle de rotation du cercle>, <pourcent de remplissage>)

function ProgressCircle(svgT, radiusC, strokeW, rotateA, percent, timeout, durationT){

    setTimeout(() => {

        target = svgT.querySelector(".Pcircle");
        
        target.style.transitionProperty = "stroke-dashoffset";

        target.setAttribute("r", radiusC);

        let globalW = radiusC + strokeW;

        svgT.style.width = globalW * 2 + "px";
        svgT.style.height = globalW * 2 + "px";

        target.setAttribute("cx", globalW);
        target.setAttribute("cy", globalW);

        target.style.strokeWidth = strokeW + "px";
        target.setAttribute("transform", "rotate(" + rotateA + ", " + globalW + "," + globalW + ")");

        let perimeter = 2 * Math.PI * radiusC;

        target.style.strokeDasharray = perimeter;
        target.style.strokeDashoffset = perimeter;

        let lineW = (perimeter * percent) / 100;

        target.style.display = "block";
        target.style.transitionDuration = durationT + "s";

        let negativeInc;
        let positiveInc;

        if(!target.getAttribute("data-percent")){
            target.setAttribute("data-percent", percent);
        }else if(target.getAttribute("data-percent") > percent){
            negativeInc = true;
        }else if(target.getAttribute("data-percent") < percent){
            positiveInc = true;
        }

        let incD;
        let incN;

    if(target.getAttribute("data-percent") === percent){
        // Do nothing
    }else{

        if(negativeInc === true){
            incN = target.getAttribute("data-percent");
            incD = (durationT / (target.getAttribute("data-percent") - percent)) * 1000;
            target.setAttribute("data-percent", percent);
        }else if(positiveInc === true){
            incN = target.getAttribute("data-percent");
            incD = (durationT / (percent - target.getAttribute("data-percent"))) * 1000;
            target.setAttribute("data-percent", percent);
        }else{
            incD = (durationT / percent) * 1000;
            incN = 0;
        }

        // setTimeout(() => {

            if(negativeInc === true){
                let incP = setInterval(() => {
                    if(incN <= (percent + 1)){clearInterval(incP);}  
                        incN--;
                    svgT.querySelector(".Ptext").textContent = incN + "%";
                }, incD);
            }else{
                let incP = setInterval(() => {
                    if(incN >= (percent - 1)){clearInterval(incP);}  
                        incN++;
                    svgT.querySelector(".Ptext").textContent = incN + "%";
                }, incD);
            }

            target.style.strokeDashoffset = perimeter - lineW;

        } // Do something

    }, timeout);

}

// ---------------------------------------------------------

// ON RECUPERE LES LI

li = document.querySelectorAll(".section-dot > li");

    for (i = 1; i < li.length; ++i) {
        li[i].className = "unselected-dot";
    }

    // On ajoute la classe selected au point de la section par defaut

    li[0].className = "selected-dot";


// ---------------------------------------------------------

// FONCTION POUR L'EVENT POSCHANGE

function PosChange(number){

    let currentSection;

    if(number === 1){ 
        currentSection = (section[0].offsetTop / content.offsetHeight) * 100;
    }else if(number === 0){
        currentSection = (section[section.length - 1].offsetTop / content.offsetHeight) * 100;
    }
       
    wheelTimeout = setTimeout(() => {wheelCount = 0;}, 800);

    if((number === 0 && currentSection > 0) || (number === 1 && currentSection < 0)){

        for (i = 0; i < section.length; ++i) {

            topPosition = Math.round(section[i].offsetTop / content.offsetHeight) * 100;
            
            if(number === 0){setPosition = topPosition - 100;}
            else if(number === 1){setPosition = topPosition + 100;}

            section[i].style.top = setPosition + "%";

            if(setPosition === 0){
                
                li[i].className = "selected-dot";
            
                // section[i].style.left = "0%";

                // for (u = 0; u < li.length; ++u) {
                //     li[u].style.marginRight = "7px";
                // }

                CrtAnim(i);

            }
            else{li[i].className = "unselected-dot";}

        }

    }else if((number === 0 && currentSection <= 0) || (number === 1 && currentSection >= 0)){

        for (i = 0; i < section.length; ++i) {

            topPosition = Math.round(section[i].offsetTop / content.offsetHeight) * 100;
            
            if(number === 0){setPosition = topPosition + ((section.length - 1) * 100);}
            else if(number === 1){setPosition = topPosition - ((section.length - 1) * 100);}

            section[i].style.top = setPosition + "%";

            if(setPosition === 0){
                
                li[i].className = "selected-dot";

                // section[i].style.left = "0%";

                // for (u = 0; u < li.length; ++u) {
                //     li[u].style.marginRight = "7px";
                // }

                CrtAnim(i);
            
            }
            else{li[i].className = "unselected-dot";}

        }

    }
  
}

// ---------------------------------------------------------

// FONCTION POSCHANGEX

function PosChangeX(number){

    wheelTimeout = setTimeout(() => {wheelCount = 0;}, 800);

    let undots = document.querySelectorAll(".section-dot > .unselected-dot");
    let divli = document.querySelectorAll(".section-dot > li > div");

    if(number === 0){

        for (let i = 0; i < section.length; ++i) {

            topPosition = Math.round(section[i].offsetTop / content.offsetHeight) * 100;
            
            if((section[i].offsetWidth < content.offsetWidth - 10 || section[i].offsetWidth > content.offsetWidth + 10)){

                section[i].style.left = "-100%";
                divli[i].textContent = section[i].getAttribute("data-second-name");

                for (u = 0; u < undots.length; ++u) {
                    undots[u].style.marginRight = "21px";
                }

                setTimeout(() => {

                    for (u = 0; u < undots.length; ++u) {
                        undots[u].style.marginRight = "7px";
                        dots.style.alignItems = "flex-start";
                    }
                    
                }, 400);

            }

        }

    }else if(number === 1){

        for (let i = 0; i < section.length; ++i) {

            topPosition = Math.round(section[i].offsetTop / content.offsetHeight) * 100;
            
            if((section[i].offsetWidth < content.offsetWidth - 10 || section[i].offsetWidth > content.offsetWidth + 10)){

                section[i].style.left = "0%";
                divli[i].textContent = section[i].getAttribute("data-name");

                for (u = 0; u < undots.length; ++u) {
                    undots[u].style.marginLeft = "21px";
                }

                setTimeout(() => {

                    for (u = 0; u < undots.length; ++u) {
                        dots.style.alignItems = "flex-end";
                        undots[u].style.marginLeft = "7px";
                    }
                    
                }, 400);
                
            }

        }

    }

}

// ---------------------------------------------------------

function CrtAnim(number){

    number = number + 1;

    if(number === 2 && anim2 != 1){
        let svgdisplays = document.querySelectorAll(".display-icons > img");
        anim2 = 1;
        let i = 0;
        setTimeout(() => {let interval = setInterval(() => {
            svgdisplays[i].style.transform = "scale(1.4)";
            setTimeout(() => {svgdisplays[i].style.transform = "scale(1)";++i;
            if(i >= svgdisplays.length){clearInterval(interval);}}, 300);
        }, 500);}, 800);
    }else if(number === 3 && anim3 != 1){
        let topdiv = document.querySelector("div.slide-trois .block-email > div"),
            bottomdiv = document.querySelector("div.slide-trois .send-email");
            anim3 = 1;

        setTimeout(() => {
            topdiv.style.width = "200px";
        }, 800);
        setTimeout(() => {
            bottomdiv.style.display = "block";topdiv.style.right = "0px";topdiv.style.left = "auto";topdiv.style.width = "0px";
        }, 1200);

    }

}

// EVENT POUR LE TEST FINAL

let testButton = document.querySelector("article.slide-trois button");
let svgT = document.querySelector("article.slide-trois svg");
let inprogress = false;

ProgressCircle(svgT, 70, 8, "-90", 50, 0, 0);

testButton.addEventListener("click", () => {

    if(inprogress === false){
        testButton.style.backgroundColor = "#aaaaaa";
        testButton.style.color = "#222222";
        ProgressCircle(svgT, 70, 8, "-90", 0, 0, 1);
        ProgressCircle(svgT, 70, 8, "-90", Math.floor(Math.random() * 100), 1200, 1);
        ProgressCircle(svgT, 70, 8, "-90", Math.floor(Math.random() * 100), 2200, 1);
        ProgressCircle(svgT, 70, 8, "-90", Math.floor(Math.random() * 100), 3200, 1);
        ProgressCircle(svgT, 70, 8, "-90", Math.floor(Math.random() * (100 - 50)) + 50, 4200, 1);
        inprogress = true;
        setTimeout(() => {
            inprogress = false;
            testButton.style.color = "#9adafc";
            testButton.style.backgroundColor = "#24478c";
        }, 5200);
    }

});

// EVENT POUR LES ICONES DE NAVIGATEURS

let slide2div = document.querySelector("div.slide-deux"),
    browserName = document.querySelector(".browser-name-visible");

function AnimationBrowser(name){

    let inc = 0;
    browserName.textContent = name;
    browserName.style.backgroundColor = "#b5cea8";
    setTimeout(() => {
        browserName.style.backgroundColor = "transparent";
    }, 400);

    let interval = setInterval(() =>{
        inc++;
        document.querySelector("div.slide-deux .browsers > div[data-name=" + name + "]").style.transitionTimingFunction = "cubic-bezier(0,1,.71,1)";
        document.querySelector("div.slide-deux .browsers > div[data-name=" + name + "]").style.transitionDuration = "0.6s";
        document.querySelector("div.slide-deux .browsers > div[data-name=" + name + "]").style.bottom = "5vh";
        setTimeout(() => {
            document.querySelector("div.slide-deux .browsers > div[data-name=" + name + "]").style.transitionTimingFunction = "ease-in";
            document.querySelector("div.slide-deux .browsers > div[data-name=" + name + "]").style.transitionDuration = "0.2s";
            document.querySelector("div.slide-deux .browsers > div[data-name=" + name + "]").style.bottom = "0px";
            if(inc > 2){clearInterval(interval);inc = 0;}
        }, 600);
    }, 800);

}

slide2div.addEventListener("click", (e) => {

    if(e.target.getAttribute("data-name") == "Firefox"){
        AnimationBrowser("Firefox");
    }else if(e.target.getAttribute("data-name") == "Chrome"){
        AnimationBrowser("Chrome");
    }else if(e.target.getAttribute("data-name") == "Safari"){
        AnimationBrowser("Safari");
    }else if(e.target.getAttribute("data-name") == "Edge"){
        AnimationBrowser("Edge");
    }else if(e.target.getAttribute("data-name") == "Opera"){
        AnimationBrowser("Opera");
    }

});

// ---------------------------------------------------------

// ON SCROLL WHEEL LISTENER

document.addEventListener("wheel", (e) => {

    wheelCount++;

    if(e.deltaY > 0 && wheelCount === 3){

        PosChange(0);

    }else if(e.deltaY < 0 && wheelCount === 3){

        PosChange(1);
        
    }

});

// ---------------------------------------------------------

// TOUCH SWIPE

content.addEventListener('touchstart', (e) => {
    ts = e.touches[0].clientY;
    tsx = e.touches[0].clientX;
});
 
content.addEventListener('touchend', (e) => {

    let te = e.changedTouches[0].clientY;
    let tex = e.changedTouches[0].clientX;

    if(ts > te+50 && wheelCount === 0){
        wheelCount++;
        PosChange(0);
    }else if(ts < te-50 && wheelCount === 0){
        wheelCount++;
        PosChange(1);
    }else if(tsx > tex+20){
        wheelCount++;
        PosChangeX(0);
    }else if(tsx < tex-20){
        wheelCount++;
        PosChangeX(1);
    }

 });

// Ajouter un evenement ondbclick pour les fleches de swipe
// Ajouter aussi pour fullscreen request

// ---------------------------------------------------------

// Test du device si mobile / tablette

window.mobileAndTabletcheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// Redimensionnement si mobile / tablette

let decoScroll = document.querySelector(".deco-scroll");

if(mobileAndTabletcheck() === true){

    decoScroll.textContent = "swipe";

    setInterval(function(){

        if(document.body.style.height !== window.innerHeight && window.orientation == 0){
            document.body.style.height = window.innerHeight + "px";
        }else if(document.body.style.height !== "100vh"){
            document.body.style.height = "100vh";
        }
    
    }, 200);

}

// ---------------------------------------------------------

// Masquage des icones et modif du message si can't fullscreen

// Detection du navigateur

let sBrowser, sUsrAg = navigator.userAgent;

if (sUsrAg.indexOf("Firefox") > -1) {
    sBrowser = "Mozilla Firefox";
    // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
  } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
    sBrowser = "Samsung Internet";
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
  } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
    sBrowser = "Opera";
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
  } else if (sUsrAg.indexOf("Trident") > -1) {
    sBrowser = "Internet Explorer";
    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
  } else if (sUsrAg.indexOf("Edge") > -1) {
    sBrowser = "Microsoft Edge";
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
  } else if (sUsrAg.indexOf("Chrome") > -1) {
    sBrowser = "Chrome";
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
  } else if (sUsrAg.indexOf("Safari") > -1) {
    sBrowser = "Safari";
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
  } else {
    sBrowser = "inconnu pour nous";
  }

let safari = "";

if(sBrowser === "Safari"){safari = " et il ne prend pas en charge (<span>Fullscreen API</span>)"}

if(!document.fullscreenEnabled || document.fullscreenEnabled === false || document.fullscreenEnabled == "undefined"){

    enlarge.setAttribute("xlink:href", "#icon-cancel-circle");
    infofls.innerHTML = "<span>&lt!--</span> Désolé mais le plein écran n'est pas disponible sur votre navigateur, votre navigateur est " +
    sBrowser + safari + " <span>--&gt;</span>";

}

// ---------------------------------------------------------

function CheckFullScreen(){

    if(document.fullscreenElement){
        document.exitFullscreen();
    }else{
        corps.requestFullscreen();
    }

}

// ---------------------------------------------------------

window.addEventListener("resize", () => {

    if(window.screen.width >= 980){
        for (i = 0; i < section.length; ++i) {
            section[i].style.left = "0%";
        }
    }
});

headleft.addEventListener("click", () => {
    CheckFullScreen();
});

corps.addEventListener("dblclick", () => {
    CheckFullScreen();
});


// ---------------------------------------------------------

// FONCTION POUR COOKIES

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function setCookie(cname, value, days){

    let d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires="+d.toUTCString();

    document.cookie = cname + '=' + value + '; expires=' + expires + '; path=/';

}

// ---------------------------------------------------------

//  ON GERE L'INFOBULE POUR LE FULLSCREEN

if(getCookie("fullscreenmode") === "1"){

    outside.style.display = "none";
    main.style.filter = "blur(0px)";

}else{

    outside.style.display = "flex";
    main.style.filter = "blur(1px)";
    setTimeout(() => {infofls.style.transform = "scale(1.2)";}, 800);
    setTimeout(() => {infofls.style.transform = "scale(1)";}, 1200);

    if(window.innerWidth <= 980){

        setTimeout(() => {infoswp.style.transform = "scale(1.2)";}, 1200);
        setTimeout(() => {infoswp.style.transform = "scale(1)";}, 1600);

    }

}

outside.addEventListener("click", () => {
    
    if(getCookie("fullscreenmode") === ""){

        setCookie("fullscreenmode", "1", 365);

    }
    
    infofls.style.transform = "scale(1.2)";
    setTimeout(() => {infofls.style.transform = "scale(0)";}, 400); 
    
    if(window.innerWidth <= 980){

        setTimeout(() => {infoswp.style.transform = "scale(1.2)";}, 1400);
        setTimeout(() => {infoswp.style.transform = "scale(0)";}, 1800);

    }
    
    setTimeout(() => {main.style.filter = "blur(0px)";outside.style.display = "none";}, 2000); 

});

// ---------------------------------------------------------
const frogefinity = ()=>
  `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 319.19 242.5">
    <ellipse cx="92.74" cy="121.25" rx="80.74" ry="109.25" fill="none" stroke="#212e3e" stroke-width="24px"/>
    <ellipse cx="244.18" cy="129.38" rx="63.01" ry="73.63" fill="none" stroke="#212e3e" stroke-width="24px"/>
  </svg>
`
const sup = (imgId, numFroges )=>
  `<!DOCTYPE html><html lang="en"><head><title>Title</title>
  <style>
    @font-face {  font-family: "Montserrat";  src: local("./Montserrat-SemiBold.ttf") ;  }
    @font-face {  font-family: "Raleway";  src: local("./raleway-heavy.ttf") ; font-weight: 500;  }
    body{font-family: 'Montserrat', sans-serif;    position: relative;margin:0;
      width:300px;height:100px;background-color: #0f3906;color: #00ffd5;border-radius: 9px;
      background-image: url("./frogs/${imgId}.jpg");
      background-size: cover;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
    }
    #box {font-family: "Raleway", sans-serif;font-weight: 900;color:#48ff00;}
    #txtype{
      position: absolute;
      top: 2%;
      left: 65%;
      white-space: nowrap;
      transform: translate(-50%, -50%);
      font-size:14px;
      font-weight: 500;
      letter-spacing:0.4em;
      -webkit-text-fill-color: #afff00;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #afff00;
      text-shadow:
        2px 2px #f327f0,
        4px 4px #000000;
    }
    #froges {margin:0 auto;text-align: center;}
    img {height:30px;width:30px;opacity:.2;margin:0 auto;}
  </style>
</head><body>
<img src="nature/001.jpg"/>
<div id='box'>
  <div id="txtype">FROGEX BUY!</div><br/>
  <div id="froges">
    ${'<img src="/froge-logo.svg"/>'.repeat(numFroges)}
  </div>
</div>
</body></html>
`


module.exports = {frogefinity, sup}

module.exports.html = `<!doctype html>
<html>
<head>
<title>Our Funky HTML Page</title>
<meta name="description" content="Our first page">
<meta name="keywords" content="html tutorial template">
<script type="text/javascript">
    
    let command = ""
    window.userHasScrolled = false;
    window.addEventListener("scroll",function(){
      window.userHasScrolled = true
    });
    function atBottom(ele) {
      var sh = ele.scrollHeight;
      var st = ele.scrollTop;
      var ht = ele.offsetHeight;
      if(ht==0) {
          return true;
      }
      if(st == sh - ht)
          {return true;} 
      else 
          {return false;}
     }
    let serverActive = setInterval(async () => {
      let output, cmd
        try{
          output = await fetch("http://localhost:3500/output")
        }catch(e){
          clearInterval(serverActive)
        }
        try{
          if (!command.length){
            cmd = await fetch("http://localhost:3500/command")
            command = "<h1>" + (await cmd.text()) + "</h1>"
          }
        }catch(e){
        }
        const container = document.getElementById("container")
        container.innerHTML = command + await output.text()
        if (!window.userHasScrolled) { container.scrollTop = container.scrollHeight; }
    }, 50)
</script>

<style>
    /* scrollbar starts on line 31 */

/* fonts and basic setup */
* {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.5;
    box-sizing: border-box;
    color: #44585d;
  }
  body {
    height: 100vh;
    background-color: #ecf0f1;
    padding: 1.5rem;
    margin: 0;
  }
  .container {
    background-color: #fdfdfd;
    height: 100%;
    width: 100%;
    border-radius: 6px;
    box-shadow: 0 4px 28px rgba(123,151,158,.25);
    border: 1px solid #d6dee1;
    padding: 1rem;
    overflow: scroll;
  }
  h1 {
    margin: 0;
    text-align: center;
  }
  
  /* custom scrollbar */
  ::-webkit-scrollbar {
    width: 20px;
  }
  
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background-color: #a8bbbf;
  }
</style>

</head>
<body>
    <div id="container" class="container custom-scrollbar">
    </div>
</body>
</html>`
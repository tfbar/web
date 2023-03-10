module.exports.html = `<!doctype html>
<html>
<head>
<title>Terraform Command View</title>
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

    function addToTree(ul, text){
      const resourceName = text.replace( /(<([^>]+)>)/ig, '');
      const path = resourceName.split(".")
      const type = path[0]
      let name = path[1] == "undefined" ? "" : path[1]
      if (type == "data") name += "." + path[2]
      const id = ul.id + "-" + type + "-" + name
      let node = document.getElementById(id)
      if (!node) {
        const li = document.createElement('li');
        node = document.createElement('ul');
        li.innerHTML = '<summary class="'+type+'">' + type + "." + name + "</summary>"
        li.appendChild(node)
        ul.appendChild(li)
        node.id = id
      }
      if (type == "module") {
        path.shift()
        path.shift()
        addToTree(node, path.join("."))
      }
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
            command = "<h1>Terraform " + (await cmd.text()) + "</h1>"
          }
        }catch(e){ }

        // Add Content
        const commandContainer = document.getElementById("command-container")
        commandContainer.innerHTML = command
        const container = document.getElementById("container")
        const text = await output.text()
        container.innerHTML = command + text
        const linesArray = text.split("<br>")
        document.getElementById("root").innerHTML = ""

        linesArray.forEach(line => {
          const lineArray = line.split(":")
          if (lineArray.length == 1 || line.indexOf("<span") > -1) return
          addToTree(document.getElementById("root"), lineArray[0])
        })
        if (!window.userHasScrolled) {
          container.scrollTop = container.scrollHeight;
        }
    }, 50)
</script>

<style>
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
    display:inline-block;
    background-color: #fdfdfd;
    height: 90vh;
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
  #tree-container{
    width: 35%;
  }
  #container{
    width: 60%;
    font-size:14px;
    text-align: left;
  }
  #content{
    text-align: center;
  }
  #command-container{
    text-transform: capitalize;
    height: 60px;
  }


  #tree-container{
    --spacing : 1.5rem;
    --radius  : 10px;
  }
  
  #tree-container li{
    display      : block;
    position     : relative;
    padding-left : calc(2 * var(--spacing) - var(--radius) - 2px);
  }
  
  #tree-container ul{
    margin-left  : calc(var(--radius) - var(--spacing));
    padding-left : 0;
  }
  
  #tree-container ul li{
    border-left : 2px solid #ddd;
  }
  
  #tree-container ul li:last-child{
    border-color : transparent;
  }
  
  #tree-container ul li::before{
    content      : '';
    display      : block;
    position     : absolute;
    top          : calc(var(--spacing) / -2);
    left         : -2px;
    width        : calc(var(--spacing) + 2px);
    height       : calc(var(--spacing) + 1px);
    border       : solid #ddd;
    border-width : 0 0 2px 2px;
  }
  
  #tree-container summary{
    display : block;
    cursor  : pointer;
  }
  
  #tree-container summary::marker,
  #tree-container summary::-webkit-details-marker{
    display : none;
  }
  
  #tree-container summary:focus{
    outline : none;
  }
  
  #tree-container summary:focus-visible{
    outline : 1px dotted #000;
  }
  
  #tree-container li::after,
  #tree-container summary::before{
    content       : '';
    display       : block;
    position      : absolute;
    top           : calc(var(--spacing) / 2 - var(--radius));
    left          : calc(var(--spacing) - var(--radius) - 1px);
    width         : calc(2 * var(--radius));
    height        : calc(2 * var(--radius));
    border-radius : 50%;
    background    : #ddd;
  }
  
  #tree-container summary::before{
    content     : 'R';
    z-index     : 1;
    font-size   : 12px;
    line-height : 20px !important;
    background  : #696;
    color       : #fff;
    line-height : calc(2 * var(--radius) - 2px);
    text-align  : center;
  }
  #tree-container summary.module::before{
    background  : orange;
    content     : 'M';
  }
  #tree-container summary.data::before{
    background  : grey;
    content     : 'D';
  }
  
  #tree-container details[open] > summary::before{
    content : '−';
  }
  #tree-container ul{
    text-align: left;
  }
</style>

</head>
<body>

  <div id="command-container">
  </div>
  <div id="content">
    <div id="tree-container" class="container custom-scrollbar resizeable">
        <ul id="root" >
        </ul>
    </div>
    <div id="container" class="container custom-scrollbar">
    </div>
  </div>

</body>
</html>`
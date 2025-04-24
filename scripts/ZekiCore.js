//Copyright
(function(){
  var crz = 'Copyright Zone';
  crz = crz.padStart(crz.length+15, "-").padEnd(crz.length+15*2,"-");
  console.log(
    `%c${crz}\n
    Author: Zeki
    Mail: zekixfly@hotmail.com
    
    版權聲明:
    一、本網站的版權屬原作者所有。
    二、盼望尊重知識產權，如要轉貼複製請註明出處來源。
    三、出處來源: https://zekixfly.github.io/zekistory/\n
    ${crz}`, 'font-size: small; color: brown;'
  );
  document.oncontextmenu = () => false; // disable contextmenu
  document.ondragstart= () => false; // disable drag
  document.onselectstart = () => false; // disable select
})();



// body append Child
Object.defineProperty(HTMLBodyElement.prototype, 'addKid', {
  value: function(element) {  
    this.appendChild(element);
    return element;

  },
  writable: false,
  enumerable: false,
})

// 函數綁定事件監聽，只要被綁定過的函示，就可以使用addEventListener監聽。
Object.defineProperty(Function.prototype, 'bindEvent', {
  value: function(){
    // 找尋原物件、原函式及函式名稱。
    const objsArr = [frames,location,console,history,document,navigator,screen,window];
    let functionName,origObject,origFunction;
    objsArr.forEach( obj => {
      for ( let property in obj ) {
        if(obj[property] === this) { //此this為指向目前使用bindEvent此方法的函式。
          functionName = property;
          origObject = obj;
          origFunction = obj[property];
        }
      }
    });

    // 動態命名function名稱，使得addEventLister可以使用該函式的name來監聽。
    // 解析：{[key]:value}為動態載入傳入的key名稱，
    // 最後的{[key]:value}[key]則為取出key的值，如obj.key可寫成obj[key]。
    origObject[functionName] = ({[functionName]:function(){
      origFunction.apply(origObject, arguments); // 原函數依然可以正常執行。
      const myEvent = new Event(
          functionName,  //此為監聽事件的關鍵字命名，
          {
              bubbles: true, // bubbles值代表可否使用冒泡機制
              cancelable: true // cancelable則是代表可否使用stopPropagation()方法
          }
      );
      myEvent.arguments = arguments;
      window.dispatchEvent(myEvent);
    }}[functionName]);
    // 備用方案：也可使用以下方式來動態命名function名稱。
    // Object.defineProperty(origObject[functionName], 'name', {value: functionName, writable: false});
  },
  writable: false,
  enumerable: false,
})

Object.defineProperties(Document.prototype,  {
  'getTags': {
    value: function(tags) {  
      return this.getElementsByTagName(tags);
    },
    writable: false,
    enumerable: false
  },
  //get one id element
  'getId': {
    value: function(id) {
      return this.getElementById(id);
    },
    writable: false,
    enumerable: false
  },
  //Finding elements of multiple IDs, Ex. var arr = ['ID1','ID2'];
  'getElementsById': {
    value: function(arr) {

      var a =[];
  
      for(var i=0; i<arr.length; i++) {
        a.push(document.getElementById(arr[i]));
      }
      return a;
  
    },
    writable: false,
    enumerable: false,
  },

})

Object.defineProperties(window, {
  //import JS file
  'importJS': {
    value: function(jsArray) {
      let scriptTag;
      for (var i = 0 ; i<jsArray.length; i++) {
        scriptTag = document.createElement('script')
        scriptTag.async = false;
        scriptTag.type = 'text/javascript';
        scriptTag.src = jsArray[i];
        document.head.appendChild(scriptTag);
      }
    },
    writable: false,
    enumerable: false
  },
  //Check all script tags to see if they have ZekiCore js, and if so, check if they have import attributes, if so, import them.
  'loadZekiImports': {
    value: function() {
      const scripts = document.querySelectorAll('script[src*="ZekiCore"][import]');
      for (const script of scripts) {
        const ImportSrc = script.getAttribute('import').trim();
        if (ImportSrc) {
          const importTag = document.createElement('script');
          importTag.async = false;
          importTag.type = 'text/javascript';
          importTag.src = `scripts/${ImportSrc}.js`;
          importTag.onerror = () => {
            console.error(`Failed to load script: ${importTag.src}`);
          };
          document.head.appendChild(importTag);
          script.removeAttribute('import');
        }
      }
    },
    writable: false,
    enumerable: false
  },
  //create element
  'makeTag': {
    value: function(tagName) {
      return document.createElement(tagName);
    },
    writable: false,
    enumerable: false
  },
  //create text node
  'makeText': {
    value: function(textNode) {
      return document.createTextNode(textNode);
    },
    writable: false,
    enumerable: false
  },
  //get multiple class element
  'getTags': {
    value: function(tags) {  
      return document.getElementsByTagName(tags);
    },
    writable: false,
    enumerable: false
  },
  //get multiple class element
  'getClasses': {
    value: function(styles) {  
      return document.getElementsByClassName(styles);
    },
    writable: false,
    enumerable: false
  },
  //get one id element
  'getId': {
    value: function(id) {
      return document.getElementById(id);
    },
    writable: false,
    enumerable: false
  },
  //get multiple id element's array
  'getIds': {
    value: function(ids) {
      return document.getElementsById(ids);
    },
    writable: false,
    enumerable: false
  },
  'ajax': {
    value: function ({type = 'get', url = undefined, ok = function(){console.log('Ok funtion not defiend.')}, postDataType='application/x-www-form-urlencoded; charset=UTF8' , postData = null} = {}) {
    var request = null;

    if(url!=undefined) {

      Object.defineProperty(window, 'ok', {
        value: ok,
        writable: false,
        enumerable: false,
        configurable: true //To be set to true, objects can be deleted.
      })
      

      //Chrome, FireFox
      if(window.XMLHttpRequest) {
        try {
          request = new XMLHttpRequest();
        }
        catch(err) {
          console.log(err);
          request = null;
        }
      }
      //IE
      else if(window.ActiveXObject) {
        try {
          request = new ActiveXObject("Msxml2.XMLHTTP.3.0");
        }
        //old IE
        catch(err) {
          console.log(err);
          try {
            request = new ActiveXObject("Microsoft.XMLHTTP");
          } catch(err) {      
            console.log(err);
            request = null;
          }
        }
      }


      if(request!= null) {
        // delete ths previous request.
        request.abort();

        url += "?dummy=" + new Date().getTime();

        try {       
          request.onreadystatechange = callback;
          request.open(type, url, true);// Third argument is asynchronous's boolean value.
          if(type.toLowerCase() == "get") {
            //if type as get that It don't need send data.
            request.send(null)
          }
          else {
            // if type as post that It need data to send.
            request.setRequestHeader("Content-type", postDataType);
            request.send(postData);
          }
        } catch(e) {            
          console.log("Ajax error communiction whith the server.\n"+ "Details: " + e);
        }
      } 
    }

    function callback(event) {
        if(event.target.readyState == 4 && event.target.status == 200) {
          
          console.log('readyState 4: request finished and response is ready.');
          // console.log(request.getResponseHeader("Content-Type"));
          // console.log(event);
          var response = JSON.parse(event.target.response);
          ok(response);
          delete window.ok;            
        }
        else {
          switch (event.target.status) {              
            case 200:
              // console.log("status 200: OK.");
              switch (event.target.readyState) {
                case 0:
                  // console.log("readyState 0: request not initialized.");
                  break;
                case 1:
                  // console.log("readyState 1: server connection established.");
                  break;
                case 2:
                  // console.log("readyState 2: request received.");
                  break;
                case 3:
                  // console.log("readyState 3: processing request.");
                  break;
                default:
                  // statements_def
                  break;
              }
              break;
            case 403:
              console.log("Error 403: Forbidden.");                
              break;
            case 404:
              console.log("Error 404: Page not found.");                
              break;
            default:
              // statements_def
              break;
          }
        }
      }
    },
    writable: false,
    enumerable: false
  }
});

Object.defineProperties(Element.prototype, {
  //get multiple class element
  'getTags': {
    value: function(tags) {  
      return this.getElementsByTagName(tags);
    },
    writable: false,
    enumerable: false
  },
  //get multiple class element
  'getClasses': {
    value: function(styles) {  
      return this.getElementsByClassName(styles);
    },
    writable: false,
    enumerable: false
  },
  //get attribute
  'getAttr': {
    value: function(attr) {
      return this.getAttribute(attr);
    },
    writable: false,
    enumerable: false
  },
  //set attribute
  'setAttr': {
    value: function(key,val) {
      this.setAttribute(key,val);
      return this
    },
    writable: false,
    enumerable: false
  },
  //set attributes
  'setAttrs': {
    value: function(objElement) {
      Object.entries(objElement).map(item=>this.setAttribute(item[0],item[1]))
      return this
    },
    writable: false,
    enumerable: false
  },
  //delete attribute
  'delAttr': {
    value: function(attr) {
      return this.removeAttribute(attr);
    },
    writable: false,
    enumerable: false
  },
  // append Child
  'addKid': {
    value: function(element) {
      this.appendChild(element);
      return element;
    },
    writable: false,
    enumerable: false
  },
  // batch append Child
  'addKids': {
    value: function(arrElement) {
      arrElement.forEach(kid=>this.appendChild(kid));
      return this;
    },
    writable: false,
    enumerable: false
  },
  // remove Child
  'delKid': {
    value: function(element) {
      this.removeChild(element);
      return this;
    },
    writable: false,
    enumerable: false
  },
  // batch remove Child
  'delKids': {
    value: function(arrElement) {
      arrElement.forEach(kid=>this.removeChild(kid));
      return this;
    },
    writable: false,
    enumerable: false
  },
  // add Class 
  'addClass': {
    value: function(style) {    
      this.classList.add(style);   
      return this; 
    },
    writable: false,
    enumerable: false
  },
  // remove Class 
  'delClass': {
    value: function(style) {
      this.classList.remove(style);
      return this;
    },
    writable: false,
    enumerable: false
  },
  //EX: getId('id').siblings().addClass('style');
  //EX: getId('id').siblings().delClass('style');
  'siblings': {
    value: function() {
      var a=[],//definede array to push this's siblings element.
          p,n;


      p=this.previousSibling;  
      while(p){//If it has finding p's previous old brother element, continued execute below code.
        if(p.nodeType===1){ 
        a.push(p); 
        } 
        p=p.previousSibling//Final, assign the p's previous node to p.
      }

      a.reverse()//Invert the order, so the order of the elements is in web's elements order.

      n=this.nextSibling;
      while(n){//If it has finding p's next younger brother element, continued execute below code.
        if(n.nodeType===1){ 
          a.push(n); 
        } 
      n=n.nextSibling; 
      }

      return a//Final, return in order's array.
    },
    writable: false,
    enumerable: false
  },
  'dataBind': {
    value: function({data=undefined}={}) {
      var allNodeList = this.querySelectorAll('*');
      var arr = Array.from(allNodeList);
      arr.map(  
        function(item,idx) {
          switch (true) {
            case (eval(item.getAttr('z-text'))!=undefined):         
              item.innerText = eval(item.getAttr('z-text'));          
              break;
            case (eval(item.getAttr('z-html'))!=undefined):
              console.log(eval(item.getAttr('z-html')));
              item.innerHTML = eval(item.getAttr('z-html'));
              break;
            default:
              // statements_def
              break;
          }
        }
      );
    },
    writable: false,
    enumerable: false
  }
});

Object.defineProperties(Array.prototype, {
  // batch remove class
  'addClass': {
    value: function(style) {
      this.forEach(function(v){v.classList.add(style)});
      return this;
    },
    writable: false,
    enumerable: false
  },
  // batch add class
  'delClass': {
    value: function(style) {
      this.forEach(function(v){v.classList.remove(style)});
      return this;
    },
    writable: false,
    enumerable: false
  },

  // NodeType - Named Constant
  // 1 ELEMENT_NODE
  // 2 ATTRIBUTE_NODE
  // 3 TEXT_NODE
  // 4 CDATA_SECTION_NODE
  // 5 ENTITY_REFERENCE_NODE
  // 6 ENTITY_NODE
  // 7 PROCESSING_INSTRUCTION_NODE
  // 8 COMMENT_NODE
  // 9 DOCUMENT_NODE
  // 10  DOCUMENT_TYPE_NODE
  // 11  DOCUMENT_FRAGMENT_NODE
  // 12  NOTATION_NODE

  //EX: getIds(['id1,id2']).siblings().addClass('style');
  //EX: getIds(['id1,id2']).siblings().delClass('style');
  'siblings': {
    value: function() {      
      var a=[],//definede array to push this's siblings element.
          p,n,
          oriArrLength;

          for(var i=0; i<this.length; i++) {
            p=this[i].previousSibling; //The "this" mean is Finding id、class or tagname multiple element's array.
            while(p) {
      
              if(this.indexOf(p)==-1) { //First check previous element not equal to this array's element.
                if(p.nodeType===1) {

                  if(a.length>0) {
                    if(a.indexOf(p)==-1) {//Second check previous element not equal to a's array elelment.
                      a.push(p);
                    }

                  }
                  else{
                    a.push(p); 
                  } 

                }
              }


            p=p.previousSibling;//Final, assign the p's previous node to p.
          }
        }

        a.reverse()//Invert the order, so the order of the elements is in web's elements order.

        for(var i=0; i<this.length; i++) {
          n=this[i].nextSibling;
          while(n) {

            if(this.indexOf(n)==-1) { 
              if(n.nodeType===1) {

                if(a.length>0) {
                  if(a.indexOf(n)==-1) {
                    a.push(n); 
                  }
                }
                else {
                  a.push(n); 
                }
              }
            }

            n=n.nextSibling; 
          }
        }
      return a//Final, return in order's array.
    },
    writable: false,
    enumerable: false
  }
  // etc. etc.
});

Object.defineProperties(HTMLCollection.prototype, {
  'map': {
    value: function(mapFn) {      
      return Array.from(this).map(mapFn);
    },
    writable: false,
    enumerable: false
  },
  'forEach': {
    value: function(forEachFn) {
      Array.from(this).forEach(forEachFn);//The forEach can not return value, so it's not need add return;
    },      
    writable: false,
    enumerable: false
  },
  'addClass': {
    value: function(style) {
      this.forEach(function(v){v.classList.add(style)});
      return this;
    },
    writable: false,
    enumerable: false
  },
  'delClass': {
    value: function(style) {
      this.forEach(function(v){v.classList.remove(style)});
      return this;
    },
    writable: false,
    enumerable: false
  }
});

loadZekiImports(); // load ZekiCore.js import scripts






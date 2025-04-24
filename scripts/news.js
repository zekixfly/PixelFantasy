async function getNews(){
    
    const res = await fetch(API_GET_DATA);
    const data =  await res.json();
    getId('newsInfo').innerHTML = '';
    let ulElement = makeTag("ul");
    ulElement.className = "newsInfo_Table";
    
    for(let idx in data){
        
        let liElement = makeTag("li");     
        let dateElement = makeTag("date");
        let spanElement = makeTag("span");

        dateElement.innerHTML = data[idx].date;
        spanElement.innerHTML = `「${data[idx].category}」新增：${data[idx].title}`;

        liElement.setAttrs({
            "category": data[idx].category,
            "src": data[idx].src
        });
        liElement.addKids([dateElement,spanElement]);
        ulElement.addKid(liElement);
        
        getId('newsInfo').addKid(ulElement);
        if(idx == 6) {
            let divElement = makeTag("div");
            divElement.id = "newsMore_Line"                    
            divElement.innerHTML = "<a href='javascript:void(0)' class='more'>More...▼</a>";
            getId('newsInfo').addKid(divElement);
            break;
        }
    }
    getId("newsMore_Line").getClasses("more")[0].addEventListener("click",()=>{

        //點擊more時判斷news數量是否只有7則，超過7則表示已點擊過more，將不在增加news數量。
        if( getClasses("newsInfo_Table")[0].getTags("li").length <= 7 ){
            for(let i = 7; i<data.length; i++){
                let liElement = makeTag("li");     
                let dateElement = makeTag("date");
                let spanElement = makeTag("span");

                dateElement.innerHTML = data[i].date;
                spanElement.innerHTML = `「${data[i].category}」新增：${data[i].title}`;

                liElement.setAttrs({
                    "category": data[i].category,
                    "src": data[i].src
                });
                liElement.addKids([dateElement,spanElement]);
                ulElement.addKid(liElement);                    
            }
            getId("newsMore_Line").getClasses("more")[0].innerText = "▲...Less";
        }
        else{
            for(let i = 7; i<data.length; i++){
                getClasses("newsInfo_Table")[0].getTags("li")[7].remove();
            }
            getId("newsMore_Line").getClasses("more")[0].innerText = "More...▼";
        }
    });
    // 點擊News列表，將會自動載入相對應作品頁面。
    getId('newsInfo').addEventListener('click',event=>{
        if(event.srcElement.parentElement.tagName.toLowerCase()==='li'){
            route.push(event.srcElement.parentElement.getAttr('category').toLowerCase());
            document.querySelector('[slot=content]').setAttr('src',event.srcElement.parentElement.getAttr('src'))     
        }
     })
}


async function getNews(){
    
    const res = await fetch(API_GET_DATA);
    const data =  await res.json();
    ZekiCore.getId('newsInfo').html = '';
    let ulElement = ZekiCore.makeTag("ul");
    ulElement.className = "newsInfo_Table";
    
    for(let idx in data){
        
        let liElement = ZekiCore.makeTag("li");     
        let dateElement = ZekiCore.makeTag("date");
        let spanElement = ZekiCore.makeTag("span");

        dateElement.html = data[idx].date;
        spanElement.html = `「${data[idx].category}」新增：${data[idx].title}`;

        liElement.setAttrs({
            "category": data[idx].category,
            "src": data[idx].src
        });
        
        liElement.addKids(dateElement, spanElement);
        ulElement.addKid(liElement);
        
        ZekiCore.getId('newsInfo').addKid(ulElement);
        if(idx == 6) {
            let divElement = ZekiCore.makeTag("div");
            divElement.id = "newsMore_Line"                    
            divElement.html = "<a href='javascript:void(0)' class='more'>More...▼</a>";
            ZekiCore.getId('newsInfo').addKid(divElement);
            break;
        }
    }
    ZekiCore.getId("newsMore_Line").getClass("more")[0].on("click",()=>{

        //點擊more時判斷news數量是否只有7則，超過7則表示已點擊過more，將不在增加news數量。
        if( ZekiCore.getClass("newsInfo_Table")[0].getTag("li").length <= 7 ){
            for(let i = 7; i<data.length; i++){
                let liElement = ZekiCore.makeTag("li");     
                let dateElement = ZekiCore.makeTag("date");
                let spanElement = ZekiCore.makeTag("span");

                dateElement.html = data[i].date;
                spanElement.html = `「${data[i].category}」新增：${data[i].title}`;

                liElement.setAttrs({
                    "category": data[i].category,
                    "src": data[i].src
                });
                liElement.addKids(dateElement, spanElement);
                ulElement.addKid(liElement);                    
            }
            ZekiCore.getId("newsMore_Line").getClass("more")[0].text = "▲...Less";
        }
        else{
            for(let i = 7; i<data.length; i++){
                ZekiCore.getClass("newsInfo_Table")[0].getTag("li")[7].remove();
            }
            ZekiCore.getId("newsMore_Line").getClass("more")[0].text = "More...▼";
        }
    });
    // 點擊News列表，將會自動載入相對應作品頁面。
    ZekiCore.getId('newsInfo').on('click',event=>{
        if(event.srcElement.parentElement.tagName.toLowerCase()==='li'){
            route.push(ZekiCore.toZeki(event.srcElement.parentElement).getAttr('category').toLowerCase());
            ZekiCore.one('[slot=content]').setAttr('src', ZekiCore.toZeki(event.srcElement.parentElement).getAttr('src')); 
        }
     })
}


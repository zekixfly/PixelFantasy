async function getNews(){
    
    const res = await fetch(API_GET_DATA);
    const data =  await res.json();
    const newsInfoEl = ZekiCore.getId('newsInfo');
    newsInfoEl.html = '';
    let ulEl = ZekiCore.makeTag("ul");
    ulEl.className = "newsInfo_Table";
    
    for(let idx in data){
        
        let liEl = ZekiCore.makeTag("li");     
        let dateEl = ZekiCore.makeTag("date");
        let spanEl = ZekiCore.makeTag("span");

        dateEl.html = data[idx].date;
        spanEl.html = `「${data[idx].category}」新增：${data[idx].title}`;

        liEl.setAttrs({
            "category": data[idx].category,
            "src": data[idx].src
        });
        
        liEl.addKids(dateEl, spanEl);
        ulEl.addKid(liEl);
        
        newsInfoEl.addKid(ulEl);
        if(idx == 6) {
            let divEl = ZekiCore.makeTag("div");
            divEl.id = "newsMore_Line"                    
            divEl.html = "<a href='javascript:void(0)' class='more'>More...▼</a>";
            newsInfoEl.addKid(divEl);
            break;
        }
    }

    const moreEl = ZekiCore.getId("newsMore_Line").getClass("more")[0];
    const newsInfoTableEl = ZekiCore.getClass("newsInfo_Table")[0];
    moreEl.on("click", () => {
        //點擊more時判斷news數量是否只有7則，超過7則表示已點擊過more，將不在增加news數量。
        if( newsInfoTableEl.getTag("li").length <= 7 ){
            for(let i = 7; i<data.length; i++){
                let liEl = ZekiCore.makeTag("li");     
                let dateEl = ZekiCore.makeTag("date");
                let spanEl = ZekiCore.makeTag("span");

                dateEl.html = data[i].date;
                spanEl.html = `「${data[i].category}」新增：${data[i].title}`;

                liEl.setAttrs({
                    "category": data[i].category,
                    "src": data[i].src
                });
                liEl.addKids(dateEl, spanEl);
                ulEl.addKid(liEl);                    
            }
            moreEl.text = "▲...Less";
        }
        else{
            for(let i = 7; i<data.length; i++){
                newsInfoTableEl.getTag("li")[7].remove();
            }
            moreEl.text = "More...▼";
        }
    });
    // 點擊News列表，將會自動載入相對應作品頁面。
    newsInfoEl.on('click', event => {
        if(event.srcElement.parentElement.tagName.toLowerCase() === 'li'){
            route.push(ZekiCore.toZekiEl(event.srcElement.parentElement).getAttr('category').toLowerCase());
            ZekiCore.one('[slot=content]').setAttr('src', ZekiCore.toZekiEl(event.srcElement.parentElement).getAttr('src')); 
        }
     })
}


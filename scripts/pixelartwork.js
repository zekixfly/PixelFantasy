async function pixelArtWork(id){
    const root = ZekiCore.getId(`${id}Work`);
    root.addClass('d-none');
    const res = await fetch(API_GET_DATA);
    const data =  await res.json();
    root.html = '';
    for(var idx in data){
        // console.log(`${id.replace(/^./, id[0].toUpperCase())} Fantasy`);
        // 替換id第一個小寫字母為大寫                
        if(`${id.replace(/^./, id[0].toUpperCase())}` === data[idx].category){
            var divElement = ZekiCore.makeTag("div");
            divElement.className = "pixelart_Thumbnail";
            var imgElement = ZekiCore.makeTag("img");
            imgElement.src = `img/pixelart/${id}/` + data[idx].src;
            imgElement.on("load", () => {
                ZekiCore.getClass("showBoxPreloader")[0].addClass("d-none");
            })
            divElement.addKid(imgElement);
            divElement.setAttrs({
                "title": data[idx].title,
                "date": data[idx].date,
                "category": data[idx].category,
                "description": data[idx].description,
                "src": data[idx].src
            });

            if(ZekiCore.getId("showBox") != null){
                divElement.on("click", event => {
                    ZekiCore.getClass("showBoxBackGround")[0].addClass("d-block");
                    ZekiCore.getId("showBox").addClass("d-block");
                    ZekiCore.getId("showBox").getTag("img")[0].src = `img/pixelart/${id}/`+ ZekiCore.toZeki(event.currentTarget).getAttr("src");
                    ZekiCore.getId("showBox").getClass("showBoxTitle")[0].html = event.currentTarget.title;
                    ZekiCore.getId("showBox").getClass("showBoxInfo")[0].html = ZekiCore.toZeki(event.currentTarget).getAttr("description");
                    ZekiCore.getTag('body')[0].addClass('overflow-hidden');
                    ZekiCore.getClass("showBoxClose")[0].on("click", event => {
                        showBoxClose()
                    });
                    ZekiCore.getClass("showBoxContainer")[0].on("click", event => {
                        showBoxClose()
                    });
                    ZekiCore.getId("showBox").getClass("showBoxCover")[0].on("click", event => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("event.preventDefault")
                    });
                    function showBoxClose(){
                        ZekiCore.getClass("showBoxContainer")[0].scrollTop = 0;
                        ZekiCore.getId("showBox").delClass("d-block");
                        ZekiCore.getTag('body')[0].delClass('overflow-hidden');
                        ZekiCore.getClass("showBoxBackGround")[0].delClass("d-block");
                        ZekiCore.one('[slot=content]').delAttr('src');
                    }
                });                        
            }

            root.addKid(divElement);
        }
    }

    /* 在CSS裡，因justify-content使用space-evenly空間平均分配，
    所以最後剩餘的元素因為數量不足又加上自動分配空間的關係，
    所以乍看之下像是跑版， 因此製造空白的元素來做填充防止跑版。 */
    for(let i=0; i<4; i++){
        var dummyElement = ZekiCore.makeTag("div");
        dummyElement.className = "filling-empty-space-childs";
        root.addKid(dummyElement);
    }

    // 延遲函式
    // function sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    //   }
    // await sleep(5000);
    let images = root.getTag('img');
    const promises = images.map(image => {
        return new Promise((resolve,reject)=>{
            image.onload = () => resolve(image);
            image.onerror = () => reject(image);
        });
    });

    // 利用Promise.all監聽所有圖片加載完成
    Promise.allSettled(promises)
    .then(results => {
        results.map(result=>{
            // 如果圖片載入錯誤，則刪除該元素節點不顯示出來!
            if(result.status === 'rejected') {
                root.delKid(result.reason.parentNode)
                console.debug(`The ${result.reason.src} url is Error!`);
            }
        });
        // 圖片載入完成時，關閉loading動畫，顯示所有圖片。
        ZekiCore.getClass('loading')[0].addClass('d-none');
        root.delClass('d-none');

        // 判斷是否從News點擊載入
        if(ZekiCore.one('[slot=content]').getAttr('src')){
            ZekiCore.all(`div[src="${ZekiCore.one('[slot=content]').getAttr('src')}"]`)[0].click()
        }
        
    })
}

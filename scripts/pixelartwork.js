async function pixelArtWork(id){
    const workEl = ZekiCore.getId(`${id}Work`);
    workEl.addClass('d-none');
    const res = await fetch(API_GET_DATA);
    const data =  await res.json();
    workEl.html = '';
    const slotContentEl = ZekiCore.one('[slot=content]');
    for(var idx in data){
        // console.log(`${id.replace(/^./, id[0].toUpperCase())} Fantasy`);
        // 替換id第一個小寫字母為大寫                
        if(`${id.replace(/^./, id[0].toUpperCase())}` === data[idx].category){
            var divEl = ZekiCore.makeTag("div");
            divEl.className = "pixelart_Thumbnail";
            var imgEl = ZekiCore.makeTag("img");
            imgEl.src = `img/pixelart/${id}/` + data[idx].src;
            imgEl.on("load", () => {
                ZekiCore.getClass("showBoxPreloader")[0].addClass("d-none");
            })
            divEl.addKid(imgEl);
            divEl.setAttrs({
                "title": data[idx].title,
                "date": data[idx].date,
                "category": data[idx].category,
                "description": data[idx].description,
                "src": data[idx].src
            });

            const showBoxEl = ZekiCore.getId("showBox");
            const showBoxBackGroundEl = ZekiCore.getClass("showBoxBackGround")[0];
            const bodyEl = ZekiCore.getTag('body')[0];
            const showBoxContainerEl = ZekiCore.getClass("showBoxContainer")[0];
            if(showBoxEl != null){
                divEl.on("click", event => {
                    showBoxBackGroundEl.addClass("d-block");
                    showBoxEl.addClass("d-block");
                    showBoxEl.getTag("img")[0].src = `img/pixelart/${id}/`+ ZekiCore.toZekiEl(event.currentTarget).getAttr("src");
                    showBoxEl.getClass("showBoxTitle")[0].html = event.currentTarget.title;
                    showBoxEl.getClass("showBoxInfo")[0].html = ZekiCore.toZekiEl(event.currentTarget).getAttr("description");
                    bodyEl.addClass('overflow-hidden');
                    ZekiCore.getClass("showBoxClose")[0].on("click", event => {
                        showBoxClose()
                    });
                    showBoxContainerEl.on("click", event => {
                        showBoxClose()
                    });
                    showBoxEl.getClass("showBoxCover")[0].on("click", event => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("event.preventDefault")
                    });
                    function showBoxClose(){
                        showBoxContainerEl.scrollTop = 0;
                        showBoxEl.delClass("d-block");
                        bodyEl.delClass('overflow-hidden');
                        showBoxBackGroundEl.delClass("d-block");
                        slotContentEl.delAttr('src');
                    }
                });                        
            }

            workEl.addKid(divEl);
        }
    }

    /* 在CSS裡，因justify-content使用space-evenly空間平均分配，
    所以最後剩餘的元素因為數量不足又加上自動分配空間的關係，
    所以乍看之下像是跑版， 因此製造空白的元素來做填充防止跑版。 */
    for(let i=0; i<4; i++){
        var dummyEl = ZekiCore.makeTag("div");
        dummyEl.className = "filling-empty-space-childs";
        workEl.addKid(dummyEl);
    }

    // 延遲函式
    // function sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    //   }
    // await sleep(5000);
    let images = workEl.getTag('img');
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
                workEl.delKid(result.reason.parentNode)
                console.debug(`The ${result.reason.src} url is Error!`);
            }
        });
        // 圖片載入完成時，關閉loading動畫，顯示所有圖片。
        ZekiCore.getClass('loading')[0].addClass('d-none');
        workEl.delClass('d-none');

        // 判斷是否從News點擊載入
        if(slotContentEl.getAttr('src')){
            ZekiCore.all(`div[src="${slotContentEl.getAttr('src')}"]`)[0].click()
        }
        
    })
}

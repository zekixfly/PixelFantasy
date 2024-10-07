async function pixelArtWork(id){
    getId(`${id}Work`).addClass('d-none');
    const res = await fetch(API_GET_DATA);
    const data =  await res.json();
    getId(`${id}Work`).innerHTML = '';
    for(var idx in data){
        var divElement = makeTag("div");
        divElement.className = "pixelart_Thumbnail";

        // console.log(`${id.replace(/^./, id[0].toUpperCase())} Fantasy`);
        // 替換id第一個小寫字母為大寫                
        if(`${id.replace(/^./, id[0].toUpperCase())}` === data[idx].category){
            var imgElement = makeTag("img");
            imgElement.src = `img/pixelart/${id}/` + data[idx].src;
            imgElement.addEventListener("load", () => {
                getClasses("showBoxPreloader")[0].addClass("d-none");
            })
            divElement.addKid(imgElement);
            divElement.setAttrs({
                "title": data[idx].title,
                "date": data[idx].date,
                "category": data[idx].category,
                "description": data[idx].description,
                "src": data[idx].src
            });

            if(getId("showBox") != null){
                divElement.addEventListener("click", event => {
                    getClasses("showBoxBackGround")[0].addClass("d-block");
                    getId("showBox").addClass("d-block");
                    getId("showBox").getTags("img")[0].src = `img/pixelart/${id}/`+ event.currentTarget.getAttr("src");
                    getId("showBox").getClasses("showBoxTitle")[0].innerHTML = event.currentTarget.title;
                    getId("showBox").getClasses("showBoxInfo")[0].innerHTML = event.currentTarget.getAttr("description");
                    getTags('body')[0].addClass('overflow-hidden');
                    getClasses("showBoxClose")[0].addEventListener("click", event => {
                        showBoxClose()
                    });
                    getClasses("showBoxContainer")[0].addEventListener("click", event => {
                        showBoxClose()
                    });
                    getId("showBox").getClasses("showBoxCover")[0].addEventListener("click", event => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log("event.preventDefault")
                    });
                    function showBoxClose(){
                        getClasses("showBoxContainer")[0].scrollTop = 0;
                        getId("showBox").delClass("d-block");
                        getTags('body')[0].delClass('overflow-hidden');
                        getClasses("showBoxBackGround")[0].delClass("d-block");
                        document.querySelector('[slot=content]').delAttr('src');
                    }
                });                        
            }

            getId(`${id}Work`).addKid(divElement);
        }
    }

    /* 在CSS裡，因justify-content使用space-evenly空間平均分配，
    所以最後剩餘的元素因為數量不足又加上自動分配空間的關係，
    所以乍看之下像是跑版， 因此製造空白的元素來做填充防止跑版。 */
    for(let i=0; i<4; i++){
        var dummyElement = makeTag("div");
        dummyElement.className = "filling-empty-space-childs";
        getId(`${id}Work`).addKid(dummyElement);
    }

    // 延遲函式
    // function sleep(ms) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    //   }
    // await sleep(5000);
    let images = getId(`${id}Work`).getTags('img');
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
                getId(`${id}Work`).delKid(result.reason.parentNode)
                console.debug(`The ${result.reason.src} url is Error!`);
            }
        });
        // 圖片載入完成時，關閉loading動畫，顯示所有圖片。
        getClasses('loading')[0].addClass('d-none');
        getId(`${id}Work`).delClass('d-none');

        // 判斷是否從News點擊載入
        if(document.querySelector('[slot=content]').getAttr('src')){
            document.querySelectorAll(`div[src="${document.querySelector('[slot=content]').getAttr('src')}"]`)[0].click()
        }
        
    })
}

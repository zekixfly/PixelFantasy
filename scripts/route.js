let route = {
    replace: function(ref = 'news') {
        history.replaceState( {page: ref}, `${ref}`, `./#/${ref}`);
    },
    push: function (ref = 'news') {
        history.pushState( {page: ref}, `${ref}`, `./#/${ref}`);
    },
    active: function(ref) {           
        
        const currentNode = ZekiCore.one(`[href=${ref}]`)
        document.title = `Pixel Fantasy - ${ref.replace(/^./,ref[0].toUpperCase())}`;

        ZekiCore.all(`li a`).forEach(ele => {
            ele.delClass('active');
        });

        currentNode.addClass('active');

    },
    tempLoad: async function(ref , target){
        
        try {
            const response = await fetch(`./template/${ref}.html`);
            
            // 轉換成文字
            const htmlText = await response.text();

            // 轉換成HTML
            const htmlParser = new DOMParser();
            const htmlElement = htmlParser.parseFromString(htmlText, 'text/html');

            // 取得template樣板網頁的內容       
            const zekiElement = ZekiCore.toZeki(htmlElement);            
            const template = zekiElement.getTag('template')[0];
            const htmlTemplate = template.html;
            function mountScript(target){
                /* 因為已掛載的template樣板網頁，並不會自動執行script標籤裡面的語法，
                故在此判斷已掛載的template樣板網頁裡是否有script，
                如果有script就取得已掛載網頁裡的script，
                並將原本的script標籤刪除並重新載入scirpt執行。 */
                if(ZekiCore.one(`[slot=${target}]`).getTag('script').length !== 0){
                    [...ZekiCore.one(`[slot=${target}]`).getTag('script')].map( script => {
                        ZekiCore.one(`[slot=${target}]`).delKid(script);
                        const scriptTag = ZekiCore.makeTag('script');
                        scriptTag.type = script.type || 'text/javascript';
                        if(script.src){
                            scriptTag.src = script.src;
                        }else if(script.html){
                            scriptTag.html = script.html;
                        }
                        ZekiCore.one(`[slot=${target}]`).addKid(scriptTag);
                    })                
                }
            }

            // 找尋插入的標籤
            switch (target) {
                case 'nav':
                    ZekiCore.one('[slot=nav]').html = htmlTemplate;
                    mountScript('nav');
                    let menuSwitch = false;
                    function menuSlide() {
                        menuSwitch = !menuSwitch
                        if(this instanceof Window) return;
                        if(menuSwitch){
                            ZekiCore.toZeki(this).getClass('menu')[0].addClass('d-none');
                            ZekiCore.toZeki(this).getClass('close')[0].addClass('d-block');
                            ZekiCore.getTag('body')[0].addClass('offset-260');
                            ZekiCore.getClass('nav')[0].addClass('offset-0');
                        }
                        else{
                            ZekiCore.toZeki(this).getClass('menu')[0].delClass('d-none');
                            ZekiCore.toZeki(this).getClass('close')[0].delClass('d-block');
                            ZekiCore.getTag('body')[0].delClass('offset-260');
                            ZekiCore.getClass('nav')[0].delClass('offset-0');
                        }
                    }
                    ZekiCore.getId('navList').on('click', event => {
                        event.preventDefault();
                        if(ZekiCore.toZeki(event.target).getAttr('href')){
                            // route.tempLoad(event.target.getAttr('href'), 'content');
                            route.push(ZekiCore.toZeki(event.target).getAttr('href'));
                            route.active(ZekiCore.toZeki(event.target).getAttr('href'));
                            getComputedStyle(ZekiCore.getId('navList-m').el).display !== 'none' && menuSlide();
                        }
                    })
                    
                    ZekiCore.getId('navList-m').on('click', menuSlide);
                    route.active('news');
                    break;
                case 'content':
                    ZekiCore.one('[slot=content]').html = htmlTemplate;
                    mountScript('content');

                    route.active(location.hash.replace('#/', ''));
                    break;
                case 'footer':
                    ZekiCore.one('[slot=footer]').html = htmlTemplate;
                    mountScript('footer');
                    break;
                default:
                    break;
            }

        } catch (error) {
             console.warn('Request Error:', error);
        }   
                       
    }
};

// 綁定事件監聽，這樣就創建了2個全新的事件，事件名為pushState和replaceState，我們就可以在全局監聽：
ZekiCore.bindEvent(history.pushState);
ZekiCore.bindEvent(history.replaceState);

ZekiCore.on(history.replaceState.name, function(e) {
    route.tempLoad(location.hash.replace('#/', ''), 'content');
});

ZekiCore.on(history.pushState.name, function(e) {
    route.tempLoad(location.hash.replace('#/', ''), 'content');
});

// 監聽此頁面的DOM都載入完畢時，才觸發做函式。
document.addEventListener("readystatechange", function(event) {
    if(event.target.readyState !== 'interactive' && event.target.readyState !== 'complete') return;
    route.tempLoad('nav', 'nav');
    
    let url = location.pathname.split("/")[location.pathname.split("/").length-1];
    
    if(url == '' || url == 'index.html'){           
        route.replace('news');
    }else{
        route.tempLoad(location.hash.replace('#/', ''), 'content');        
    }
    route.tempLoad('footer', 'footer');    
});

// 點擊上一頁下一頁觸發事件
ZekiCore.on("popstate", event => {
    if (event.state?.page) {
        route.active(event.state.page);
        route.replace(event.state.page);
    }
});

// 輸入網址時觸發事件
ZekiCore.on("hashchange", () => {
    route.tempLoad(location.hash.replace('#/', ''), 'content');
});
// window.onload = e => {console.log(e)}
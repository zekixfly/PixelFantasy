let route = {
    replace: function(id = 'news') {
        history.replaceState( {id}, `${id}`, `./#/${id}`);
    },
    push: function (id = 'news') {
        history.pushState( {id}, `${id}`, `./#/${id}`);
    },
    active: function(id) {           
        
        document.title = `Pixel Fantasy - ${id.replace(/^./, id[0].toUpperCase())}`;

        ZekiCore.all(`li a`).delClass('active');

        ZekiCore.one(`[href=${id}]`).addClass('active');

    },
    tempLoad: async function(id , target){
        
        try {
            const response = await fetch(`./template/${id}.html`);
            
            // 轉換成文字
            const htmlText = await response.text();

            // 轉換成HTML
            const htmlParser = new DOMParser();
            const htmlElement = htmlParser.parseFromString(htmlText, 'text/html');

            // 取得template樣板網頁的內容       
            const zekiElement = ZekiCore.toZekiEl(htmlElement);            
            const template = zekiElement.getTag('template')[0];
            const htmlTemplate = template.html;
            const slotTargetEl = ZekiCore.one(`[slot=${target}]`);

            // 將template樣板網頁的內容放入對應的slot裡面
            slotTargetEl.html = htmlTemplate;

            /* 因為已掛載的template樣板網頁，並不會自動執行script標籤裡面的語法，
            故在此判斷已掛載的template樣板網頁裡是否有script，
            如果有script就取得已掛載網頁裡的script，
            並將原本的script標籤刪除並重新載入scirpt執行。 */
            if(slotTargetEl.getTag('script').length !== 0){
                Array.from(slotTargetEl.getTag('script')).forEach( script => {
                    slotTargetEl.delKid(script);
                    const scriptTag = ZekiCore.makeTag('script');
                    scriptTag.type = script.type || 'text/javascript';
                    if(script.src){
                        scriptTag.src = script.src;
                    }else if(script.html){
                        scriptTag.html = script.html;
                    }
                    slotTargetEl.addKid(scriptTag);
                })                
            }

            if(target === 'nav'){
                let menuSwitch = false;
                const navListMobileEl = ZekiCore.getId('navList-m');
                function menuSlide() {
                    const bodyEl = ZekiCore.getTag('body')[0];
                    const navEl = ZekiCore.getClass('nav')[0];
                    menuSwitch = !menuSwitch
                    if(menuSwitch){
                        navListMobileEl.getClass('menu')[0].addClass('d-none');
                        navListMobileEl.getClass('close')[0].addClass('d-block');
                        bodyEl.addClass('offset-260');
                        navEl.addClass('offset-0');       
                    }
                    else{
                        navListMobileEl.getClass('menu')[0].delClass('d-none');
                        navListMobileEl.getClass('close')[0].delClass('d-block');
                        bodyEl.delClass('offset-260');
                        navEl.delClass('offset-0');
                    }
                }
                ZekiCore.getId('navList').on('click', event => {
                    event.preventDefault();
                    if(ZekiCore.toZekiEl(event.target).getAttr('href')){
                        // route.tempLoad(event.target.getAttr('href'), 'content');
                        route.push(ZekiCore.toZekiEl(event.target).getAttr('href'));
                        route.active(ZekiCore.toZekiEl(event.target).getAttr('href'));
                        navListMobileEl.getStyle('display') !== 'none' && menuSlide();
                    }
                })
                navListMobileEl.on('click', menuSlide);
                route.active('news');
            } else if(target === 'content'){
                route.active(location.hash.replace('#/', ''));
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
    if (event.state?.id) {
        route.active(event.state.id);
        route.replace(event.state.id);
    }
});

// 輸入網址時觸發事件
ZekiCore.on("hashchange", () => {
    route.tempLoad(location.hash.replace('#/', ''), 'content');
});
// window.onload = e => {console.log(e)}
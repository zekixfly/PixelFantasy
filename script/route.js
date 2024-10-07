let route = {
    replace: function(ref = 'news') {
        history.replaceState( {page: ref}, `${ref}`, `./#/${ref}`);
    },
    push: function (ref = 'news') {
        history.pushState( {page: ref}, `${ref}`, `./#/${ref}`);
    },
    active: function(ref) {           
        
        const currentNode = document.querySelector(`[href=${ref}]`)
        document.title = `Pixel Fantasy - ${ref.replace(/^./,ref[0].toUpperCase())}`;

        document.querySelectorAll(`li a`).forEach(ele => {
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
            const template = htmlElement.getTags('template')[0];
            const htmlTemplate = template.innerHTML;
            function mountScript(target){
                /* 因為已掛載的template樣板網頁，並不會自動執行script標籤裡面的語法，
                故在此判斷已掛載的template樣板網頁裡是否有script，
                如果有script就取得已掛載網頁裡的script，
                並將原本的script標籤刪除並重新載入scirpt執行。 */
                if(document.querySelector(`[slot=${target}]`).getTags('script').length !== 0){
                    [...document.querySelector(`[slot=${target}]`).getTags('script')].map( script => {
                        document.querySelector(`[slot=${target}]`).delKid(script);
                        const scriptTag = makeTag('script');
                        scriptTag.type = script.type || 'text/javascript';
                        if(script.src){
                            scriptTag.src = script.src;
                        }else if(script.innerHTML){
                            scriptTag.innerHTML = script.innerHTML;
                        }
                        document.querySelector(`[slot=${target}]`).addKid(scriptTag);
                    })                
                }
            }

            // 找尋插入的標籤
            switch (target) {
                case 'nav':
                    document.querySelector('[slot=nav]').innerHTML = htmlTemplate;
                    mountScript('nav');
                    let menuSwitch = false;
                    function menuSlide() {
                        menuSwitch = !menuSwitch
                        if(menuSwitch){
                            this.getClasses('menu')[0].addClass('d-none');
                            this.getClasses('close')[0].addClass('d-block');
                            getTags('body')[0].addClass('offset-260');
                            getClasses('nav')[0].addClass('offset-0');
                        }
                        else{
                            this.getClasses('menu')[0].delClass('d-none');
                            this.getClasses('close')[0].delClass('d-block');
                            getTags('body')[0].delClass('offset-260');
                            getClasses('nav')[0].delClass('offset-0');
                        }
                    }
                    getId('navList').onclick = event => {
                        event.preventDefault();
                        // console.log(event.target.getAttr('href'));
                        if(event.target.getAttr('href')){
                            // route.tempLoad(event.target.getAttr('href'), 'content');
                            route.push(event.target.getAttr('href'));
                            route.active(event.target.getAttr('href'));
                            getComputedStyle(getId('navList-m')).display !== 'none' && menuSlide();
                        }
                    }
                    
                    getId('navList-m').onclick = menuSlide
                    route.active('news');
                    break;
                case 'content':
                    document.querySelector('[slot=content]').innerHTML = htmlTemplate;
                    mountScript('content');

                    route.active(location.hash.replace('#/', ''));
                    break;
                case 'footer':
                    document.querySelector('[slot=footer]').innerHTML = htmlTemplate;
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
history.replaceState.bindEvent();
history.pushState.bindEvent();

window.addEventListener(history.replaceState.name, function(e) {
    route.tempLoad(location.hash.replace('#/', ''), 'content');
});

window.addEventListener(history.pushState.name, function(e) {
    route.tempLoad(location.hash.replace('#/', ''), 'content');
});

// 監聽此頁面的DOM都載入完畢時，才觸發做函式。
document.addEventListener("DOMContentLoaded", function(event) {

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
window.addEventListener("popstate", event => {
    if (event.state?.page) {
        route.active(event.state.page);
        route.replace(event.state.page);
    }
});

// 輸入網址時觸發事件
window.addEventListener("hashchange", () => {
    route.tempLoad(location.hash.replace('#/', ''), 'content');
});
// window.onload = e => {console.log(e)}
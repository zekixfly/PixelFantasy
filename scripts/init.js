
// zk.setDebug(true);

(async () => {
    const { template: navTemplate, script: navScript } = await zk.fetchTemplate("nav.html");
    const { template: contentTemplate, script: contentScript } = await zk.fetchTemplate("content.html");
    const { template: footerTemplate, script: footerScript } = await zk.fetchTemplate("footer.html");

    zk.one('[slot="nav"]').html = navTemplate.innerHTML;
    navScript && zk.one('[slot="nav"]').addKid(navScript);
    zk.one('[slot="content"]').html = contentTemplate.innerHTML;
    contentScript && zk.one('[slot="nav"]').addKid(contentScript);
    zk.one('[slot="footer"]').html = footerTemplate.innerHTML;
    footerScript && zk.one('[slot="nav"]').addKid(footerScript);
})()



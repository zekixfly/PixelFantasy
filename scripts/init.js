// zk.setDebug(true);

(async () => {
  const templates = ["nav", "content", "footer"];
  const renderHTML = async page => {
    const { template, script } = await zk.fetchTemplate(page);
    zk.one(`[slot="${page}"]`).html = template.innerHTML;
    script && zk.one(`[slot="${page}"]`).addKid(script);
  }
  for (const page of templates.reverse()) await renderHTML(page);
})();

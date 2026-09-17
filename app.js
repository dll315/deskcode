const posts = [
  {
    id: 1, category: "设计思考", date: "2024.06.18", read: "8 分钟阅读",
    title: "把复杂留给自己：关于好设计的减法练习",
    excerpt: "好的设计不是添加更多，而是知道什么时候停下来。记录最近一次产品重构中，那些被删掉的细节。",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    featured: true
  },
  {
    id: 2, category: "漫游手记", date: "2024.06.04", read: "5 分钟阅读",
    title: "在京都，学会慢一点生活", excerpt: "雨落在石板路上，时间忽然有了声音。", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 3, category: "代码与人", date: "2024.05.21", read: "11 分钟阅读",
    title: "写给未来自己的代码，不要太聪明", excerpt: "可读性是一种温柔的工程实践。", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 4, category: "设计思考", date: "2024.05.08", read: "6 分钟阅读",
    title: "界面之外：建立你的视觉词汇", excerpt: "审美不是天赋，是持续观察后留下的痕迹。", image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=85"
  },
  {
    id: 5, category: "书与影", date: "2024.04.25", read: "4 分钟阅读",
    title: "那些让我重新拿起笔的书", excerpt: "书页翻动的声音，像一条安静的河。", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=85"
  }
];

const icon = (name) => ({
  search: "⌕", moon: "◐", sun: "☼", arrow: "↗", edit: "✎", grid: "▦", posts: "▤", chart: "⌁", comment: "◌", settings: "⚙", plus: "+"
}[name] || "·");

const isAdminRoute = () => window.location.pathname.replace(/\/+$/, "").endsWith("/admin") || window.location.hash === "#/admin";
const state = { view: isAdminRoute() ? "admin" : "home", category: "全部", query: "", adminTab: "概览", theme: localStorage.getItem("deskcode-theme") === "dark", authenticated: localStorage.getItem("deskcode-admin") === "true" };
const app = document.querySelector("#app");

function header() {
  return `<header class="topbar">
    <a class="brand" href="#" onclick="goHome()"><div class="mark">林</div><div class="brand-copy"><strong>林默的数字花园</strong><span>NOTES ON MAKING & LIVING</span></div></a>
    <nav class="nav">
      <button class="${state.view === "home" ? "active" : ""}" onclick="goHome()">首页</button>
      <button onclick="scrollToSection('writing')">文章</button>
      <button onclick="scrollToSection('about')">关于我</button>
    </nav>
    <div class="toolbar">
      <button class="icon-btn" title="搜索" onclick="openSearch()">${icon("search")}</button>
      <button class="icon-btn theme-btn" title="${state.theme ? "切换到日间模式" : "切换到夜间模式"}" aria-label="${state.theme ? "切换到日间模式" : "切换到夜间模式"}" onclick="toggleTheme()">${state.theme ? icon("sun") : icon("moon")}</button>
    </div>
  </header>`;
}

function homeView() {
  const filtered = posts.filter((p) => (state.category === "全部" || p.category === state.category) && (!state.query || `${p.title}${p.excerpt}`.includes(state.query)));
  return `<main class="main">
    <section class="hero">
      <div><div class="eyebrow">独立创作者 · 上海</div><h1>记录所见，<br/><em>也记录所想。</em></h1><p class="hero-lede">你好，我是林默，一名产品设计师和终身学习者。在这里分享关于设计、代码、阅读和生活的片段。</p><div class="hero-actions"><button class="primary-btn" onclick="scrollToSection('writing')">阅读最新文章 ${icon("arrow")}</button><button class="ghost-btn" onclick="scrollToSection('about')">认识我</button></div></div>
      <div class="hero-visual"><img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85" alt="山野风景"/><div class="visual-stamp">保持<br/>好奇</div><span class="visual-note">FIELD NOTE / 024</span></div>
    </section>
    <section id="writing"><div class="section-head"><h2>最近在写</h2><span>05 篇文章 · 持续更新中</span></div>
      <div class="filters">${["全部", "设计思考", "代码与人", "漫游手记", "书与影"].map(c => `<button class="filter ${state.category === c ? "active" : ""}" onclick="setCategory('${c}')">${c}</button>`).join("")}</div>
      <div class="post-grid">${filtered.length ? filtered.map(postCard).join("") : `<p class="hero-lede">没有找到相关内容，试试其他关键词。</p>`}</div>
    </section>
    <section id="about" class="about"><div class="portrait"><span>LM</span></div><div><div class="eyebrow">关于作者</div><h2>保持开放，保持在路上。</h2><p>我在上海生活和工作，过去十年里做过产品、写过代码，也在周末学习摄影。相信好的作品来自长期主义，欢迎通过邮件和我交换想法。</p><div class="about-links"><a href="mailto:hello@linmo.studio">EMAIL ↗</a><a href="#">INSTAGRAM ↗</a><a href="#">GITHUB ↗</a></div></div></section>
    <footer class="footer"><span>© 2024 LIN MO. ALL RIGHTS RESERVED.</span><span>MADE WITH CURIOSITY · SHANGHAI</span></footer>
  </main>`;
}

function postCard(p) {
  return `<article class="post-card ${p.featured ? "featured" : ""}" onclick="openArticle(${p.id})"><div><div class="post-image"><img src="${p.image}" alt="${p.title}" loading="lazy"/></div></div><div><div class="post-meta"><span class="tag">${p.category}</span><span>·</span><span>${p.date}</span><span>·</span><span>${p.read}</span></div><h3>${p.title}</h3><p>${p.excerpt}</p><div class="read-more">继续阅读</div></div></article>`;
}

function articleView(post) {
  return `<main class="article"><button class="back" onclick="goHome()">← 返回文章列表</button><div class="article-meta">${post.category} &nbsp; / &nbsp; ${post.date} &nbsp; / &nbsp; ${post.read}</div><h1>${post.title}</h1><p class="lead">${post.excerpt} 有些想法值得慢慢展开，所以我把它们放在这里，留给未来的自己，也留给同样在思考的你。</p><div class="article-cover"><img src="${post.image}" alt="${post.title}"/></div><div class="article-body"><p>我们总是很容易被“更多”吸引：更多功能、更多颜色、更多信息。但在每一次真实的使用中，人们需要的往往是更少的阻力，以及恰好被理解的那一刻。</p><h2>从删掉一个按钮开始</h2><p>最近参与的一次产品重构里，我们花了整整两周讨论一个问题：是否真的需要把所有选项都展示出来。答案最后藏在用户的犹豫里——当选择变多，决定反而变得困难。</p><p>于是我们开始删减。每一次删减都需要理由，每一个留下的元素都必须为体验服务。这个过程很慢，却让产品第一次有了呼吸感。</p><h2>留白不是空白</h2><p>留白让重要的内容被看见，也让使用者拥有自己的节奏。好的设计不会急着证明自己，它更愿意退后一步，把空间还给人。</p></div></main>`;
}

function adminView() {
  return `<div class="admin"><div class="admin-shell"><aside class="admin-side"><div class="side-label">Workspace</div><nav class="side-nav">${[["grid","概览"],["posts","文章管理"],["comment","评论"],["settings","设置"]].map(([i, t]) => `<button class="${state.adminTab === t ? "active" : ""}" onclick="setAdminTab('${t}')"><span>${icon(i)}</span><b>${t}</b></button>`).join("")}</nav><div class="side-label">Quick actions</div><nav class="side-nav"><button onclick="openEditor()"><span>${icon("plus")}</span><b>写新文章</b></button><button onclick="goHome()"><span>↗</span><b>查看网站</b></button></nav></aside><section class="admin-content">${adminContent()}</section></div></div>`;
}

function adminContent() {
  if (state.adminTab !== "概览") return `<div class="admin-title"><div><h1>${state.adminTab}</h1><p>这里的功能正在持续完善中。</p></div><button class="primary-btn" onclick="openEditor()">+ 写新文章</button></div><div class="panel"><p class="hero-lede">作为一个轻量、专注写作的后台，这里会帮助你保持内容秩序。现在可以先从创建一篇新文章开始。</p></div>`;
  return `<div class="admin-title"><div><h1>早上好，林默 <span style="font-size:22px">✦</span></h1><p>这是你的内容空间，愿今天也有新的灵感。</p></div><div class="admin-date">2024 年 06 月 18 日 · 周二</div></div><div class="metric-grid"><div class="metric"><div class="metric-label">总浏览量</div><div class="metric-value">12,846</div><div class="metric-note">↗ 18.4% 较上月</div></div><div class="metric"><div class="metric-label">文章总数</div><div class="metric-value">24</div><div class="metric-note">↗ 本月新增 3 篇</div></div><div class="metric"><div class="metric-label">订阅读者</div><div class="metric-value">1,284</div><div class="metric-note">↗ 12.1% 较上月</div></div><div class="metric"><div class="metric-label">平均阅读时长</div><div class="metric-value">4:32</div><div class="metric-note">↗ 0:24 较上月</div></div></div><div class="admin-grid"><div class="panel"><div class="panel-head"><h2>文章表现</h2><button class="panel-link" onclick="setAdminTab('文章管理')">查看全部 ↗</button></div><div class="table"><div class="table-row header"><span>文章</span><span>浏览</span><span>状态</span></div>${posts.slice(0, 4).map(p => `<div class="table-row"><div><strong>${p.title}</strong><small>${p.date} · ${p.category}</small></div><span style="font-family:var(--mono);font-size:11px">${(Math.random()*3+1).toFixed(1)}k</span><span class="status">已发布</span></div>`).join("")}</div></div><div class="panel"><div class="panel-head"><h2>本月浏览</h2><span style="color:var(--muted);font-size:10px">JUN 2024</span></div><div class="chart">${[48,72,55,84,65,97,78,58,88,74,66,91].map((h, i) => `<div class="bar" style="height:${h}%"><span>${i + 1}</span></div>`).join("")}</div><div class="chart-caption">相比上月增长 <b style="color:#528160">18.4%</b></div></div><div class="panel"><div class="panel-head"><h2>最近评论</h2><button class="panel-link" onclick="setAdminTab('评论')">管理 ↗</button></div><div class="quick-list"><div class="quick"><div class="quick-avatar">周</div><p><b>周予安</b> 赞同你关于留白的观点<small>12 分钟前 · 把复杂留给自己</small></p></div><div class="quick"><div class="quick-avatar">K</div><p><b>Kevin</b> 留下了一条新评论<small>2 小时前 · 写给未来自己的代码</small></p></div><div class="quick"><div class="quick-avatar">林</div><p><b>林小满</b> 开始关注你的博客<small>昨天</small></p></div></div></div></div>`;
}

function render() { app.innerHTML = header() + (state.view === "admin" ? adminView() : state.view === "article" ? articleView(posts.find(p => p.id === state.articleId)) : homeView()); }
function adminPath() {
  const base = window.location.pathname.replace(/\/+$/, "").replace(/\/admin$/, "");
  return `${base || ""}/admin`;
}
function goHome() { state.view = "home"; history.pushState({}, "", window.location.pathname.replace(/\/admin$/, "") || "/"); render(); window.scrollTo(0, 0); }
function goAdmin(event) {
  event?.preventDefault();
  if (!state.authenticated) {
    openLogin();
    return;
  }
  state.view = "admin";
  history.pushState({}, "", adminPath());
  render();
  window.scrollTo(0, 0);
}
function openArticle(id) { state.view = "article"; state.articleId = id; render(); window.scrollTo(0, 0); }
function setCategory(category) { state.category = category; render(); document.querySelector("#writing")?.scrollIntoView({ behavior: "smooth" }); }
function setAdminTab(tab) { state.adminTab = tab; render(); }
function scrollToSection(id) { state.view = "home"; render(); setTimeout(() => document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" }), 0); }
function toggleTheme() {
  state.theme = !state.theme;
  localStorage.setItem("deskcode-theme", state.theme ? "dark" : "light");
  document.documentElement.dataset.theme = state.theme ? "dark" : "light";
  render();
}
function openSearch() { const query = prompt("搜索文章"); if (query !== null) { state.query = query.trim(); state.category = "全部"; render(); document.querySelector("#writing")?.scrollIntoView({ behavior: "smooth" }); } }
function openLogin() {
  document.body.insertAdjacentHTML("beforeend", `<div class="overlay" id="login"><div class="modal login-modal"><div class="login-brand"><div class="mark">林</div><div><strong>管理后台</strong><small>LIN MO'S DIGITAL GARDEN</small></div></div><h2>欢迎回来</h2><p class="login-hint">登录后管理你的文章与内容。</p><form onsubmit="submitLogin(event)"><div class="field"><label>管理员账号</label><input id="admin-user" autocomplete="username" placeholder="输入账号" required /></div><div class="field"><label>密码</label><input id="admin-pass" type="password" autocomplete="current-password" placeholder="输入密码" required /></div><p class="login-error" id="login-error"></p><button class="primary-btn login-submit" type="submit">登录后台 ${icon("arrow")}</button></form><button class="close login-close" onclick="closeLogin()">×</button></div></div>`);
  setTimeout(() => document.querySelector("#admin-user")?.focus(), 0);
}
function submitLogin(event) {
  event.preventDefault();
  const username = document.querySelector("#admin-user").value.trim();
  const password = document.querySelector("#admin-pass").value;
  if (username === "admin" && password === "123456") {
    state.authenticated = true;
    localStorage.setItem("deskcode-admin", "true");
    closeLogin();
    state.view = "admin";
    history.pushState({}, "", adminPath());
    document.documentElement.dataset.theme = state.theme ? "dark" : "light";
    render();
    return;
  }
  document.querySelector("#login-error").textContent = "账号或密码不正确，请重试。";
}
function closeLogin() { document.querySelector("#login")?.remove(); }
function logout() {
  state.authenticated = false;
  localStorage.removeItem("deskcode-admin");
  state.view = "home";
  render();
}
function openEditor() { document.body.insertAdjacentHTML("beforeend", `<div class="overlay" id="editor"><div class="modal"><div class="modal-head"><h2>写一篇新文章</h2><button class="close" onclick="closeEditor()">×</button></div><div class="form-grid"><div class="field full"><label>文章标题</label><input placeholder="给这篇文章起个名字..." /></div><div class="field"><label>分类</label><select><option>设计思考</option><option>代码与人</option><option>漫游手记</option><option>书与影</option></select></div><div class="field"><label>预计阅读时间</label><input placeholder="比如：6 分钟阅读" /></div><div class="field full"><label>文章摘要</label><textarea placeholder="用一两句话介绍这篇文章..."></textarea></div></div><div class="modal-actions"><button class="ghost-btn" onclick="closeEditor()">保存草稿</button><button class="primary-btn" onclick="publishEditor()">发布文章 ${icon("arrow")}</button></div></div></div>`); }
function closeEditor() { document.querySelector("#editor")?.remove(); }
function publishEditor() { closeEditor(); alert("文章已发布（演示）"); }
render();
if (state.view === "admin" && !state.authenticated) openLogin();

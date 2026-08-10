<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#1a6b4a">
<title>سامانه مسجد آقا منیر</title>
<link rel="apple-touch-icon" href="https://i.ibb.co/S2b6YjQ/unnamed.jpg">
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Vazirmatn',sans-serif;-webkit-tap-highlight-color:transparent}
body{background:#fdf8f0;min-height:100vh;color:#2c1810;padding:12px;line-height:1.6}
.hidden{display:none!important}
.app{max-width:900px;margin:0 auto}
button{font-family:inherit;cursor:pointer;border:none;background:none}
input,select,textarea{font-family:inherit;outline:none}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes slideRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
@keyframes scaleIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(200,150,62,.4)}50%{box-shadow:0 0 40px rgba(200,150,62,.8)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes shimmer{0%{background-position:-1000px 0}100%{background-position:1000px 0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes bounceIn{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes bannerPop{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
@keyframes trophy{0%,100%{transform:rotate(-8deg)scale(1)}50%{transform:rotate(8deg)scale(1.15)}}
@keyframes wave{0%,100%{height:15px;opacity:.5}50%{height:50px;opacity:1}}
@keyframes fadeOut{to{opacity:0;transform:translateY(-20px)}}
.splash{position:fixed;inset:0;background:linear-gradient(135deg,#1a6b4a,#0f3d2a);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;transition:opacity .6s}
.splash.hide{opacity:0;pointer-events:none}
.splash-icon{font-size:4em;margin-bottom:16px;animation:float 2s infinite}
.splash-title{color:#fff;font-size:1.5em;font-weight:800;margin-bottom:8px}
.splash-sub{color:#e0c87a;font-size:.9em;margin-bottom:30px}
.splash-loader{width:60px;height:60px;border:4px solid rgba(255,255,255,.2);border-top-color:#e0c87a;border-radius:50%;animation:spin 1s linear infinite}
.hdr{background:linear-gradient(135deg,#1a6b4a,#0f3d2a);color:#fff;padding:20px;border-radius:18px;text-align:center;margin-bottom:12px;box-shadow:0 4px 16px rgba(0,0,0,.15)}
.hdr h1{font-size:1.4em;font-weight:800;margin-bottom:4px}
.hdr .sub{font-size:.8em;color:#e0c87a}
.chip{display:inline-block;background:rgba(255,255,255,.15);border:1px solid #e0c87a;color:#e0c87a;border-radius:12px;padding:3px 12px;font-size:.75em;margin-top:8px;font-weight:700}
.card{background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 2px 10px rgba(0,0,0,.05);border:1px solid #e8dcc8;animation:fadeIn .4s ease both}
.card h3{font-size:1em;color:#0f3d2a;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #f0e8d5;font-weight:800;display:flex;align-items:center;gap:8px}
input,select,textarea{padding:11px 14px;border:2px solid #e0d5c0;border-radius:12px;background:#fdf8f0;font-size:.9em;width:100%;transition:all .25s}
input:focus,select:focus,textarea:focus{border-color:#1a6b4a;background:#fff;box-shadow:0 0 0 3px rgba(26,107,74,.1)}
textarea{resize:vertical;min-height:70px}
.btn{padding:11px 18px;border-radius:12px;font-weight:700;font-size:.9em;transition:all .25s;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.btn:active{transform:scale(.96)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-primary{background:linear-gradient(135deg,#1a6b4a,#0f3d2a);color:#fff}
.btn-gold{background:linear-gradient(135deg,#c8963e,#8b6914);color:#fff}
.btn-danger{background:#b5343a;color:#fff}
.btn-outline{background:#fff;border:2px solid #1a6b4a;color:#1a6b4a}
.btn-ghost{background:transparent;color:#1a6b4a;padding:8px 12px}
.btn-sm{padding:7px 12px;font-size:.78em}
.btn-lg{padding:13px 20px;font-size:1em}
.btn-xl{width:100%;padding:15px;font-size:1.05em;border-radius:14px}
.btn-success{background:linear-gradient(135deg,#2d8f65,#1a6b4a);color:#fff;font-weight:800}
.btn.armed{background:#b5343a!important;color:#fff!important}
.start-box{max-width:500px;margin:20px auto;background:#fff;border-radius:22px;padding:24px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.1);animation:scaleIn .5s cubic-bezier(.175,.885,.32,1.275)}
.start-img{width:140px;height:140px;border-radius:70px 70px 20px 20px;border:4px solid #e0c87a;margin:0 auto 16px;object-fit:cover;animation:float 3s ease-in-out infinite;box-shadow:0 4px 14px rgba(0,0,0,.2)}
.start-title{font-size:1.5em;font-weight:800;color:#0f3d2a;margin-bottom:4px}
.start-sub{font-size:.88em;color:#5c4030;margin-bottom:14px}
.credit{font-size:.72em;color:#888;padding:8px 14px;background:#fdf8f0;border-radius:10px;margin-bottom:18px}
.credit b{color:#1a6b4a}
.credit .phone{direction:ltr;display:inline-block;font-weight:700}
.branch-tabs{display:flex;gap:6px;margin-bottom:14px}
.branch-tab{flex:1;padding:12px;border-radius:12px;background:#fdf8f0;border:2px solid #e0d5c0;font-weight:700;font-size:.9em;transition:all .3s;display:flex;align-items:center;justify-content:center;gap:6px}
.branch-tab.active{background:linear-gradient(135deg,#1a6b4a,#0f3d2a);color:#fff;border-color:#1a6b4a}
.role-btn{display:flex;align-items:center;gap:14px;width:100%;padding:14px;background:#fdf8f0;border:2px solid #e0d5c0;border-radius:14px;margin-bottom:10px;text-align:right;transition:all .3s}
.role-btn:active{border-color:#1a6b4a;background:#fff}
.role-btn .ri{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#1a6b4a,#0f3d2a);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.4em;flex-shrink:0}
.role-btn.rg .ri{background:linear-gradient(135deg,#c8963e,#8b6914)}
.role-btn.ri2 .ri{background:linear-gradient(135deg,#2a9d8f,#1a6b4a)}
.role-btn .rb{flex:1}
.role-btn .rt{font-weight:800;font-size:1em;margin-bottom:2px}
.role-btn .rd{font-size:.75em;color:#888}
.role-btn .arr{color:#888;font-size:1.2em}
.search-results{max-height:250px;overflow-y:auto;border:2px solid #e0d5c0;border-radius:12px;background:#fff;margin-bottom:10px}
.mosque-item{padding:12px 14px;border-bottom:1px solid #f0e8d5;cursor:pointer;display:flex;align-items:center;gap:10px;transition:all .2s}
.mosque-item:last-child{border-bottom:none}
.mosque-item.selected{background:linear-gradient(135deg,#1a6b4a,#0f3d2a);color:#fff}
.mosque-item .mi{font-size:1.5em}
.mosque-item .mn{font-weight:700;flex:1}
.mosque-item .mb{font-size:.68em;padding:2px 8px;border-radius:8px;background:rgba(0,0,0,.08)}
.selected-mosque{background:linear-gradient(135deg,#1a6b4a,#0f3d2a);color:#fff;padding:14px;border-radius:12px;margin-bottom:10px;display:flex;align-items:center;gap:10px;animation:slideRight .4s}
.selected-mosque .smi{font-size:1.8em}
.selected-mosque .smn{font-weight:800;flex:1}
.divider{height:2px;background:linear-gradient(90deg,transparent,#e0c87a,transparent);margin:18px 0}
.top-banner{background:linear-gradient(90deg,#ff4d94,#c8963e,#ff4d94);background-size:200% 100%;color:#fff;border-radius:14px;padding:16px;margin-bottom:12px;font-weight:800;font-size:1em;display:flex;align-items:center;gap:12px;animation:gradient 3s ease infinite,bannerPop .5s;box-shadow:0 6px 20px rgba(200,150,62,.5);text-shadow:0 1px 3px rgba(0,0,0,.3)}
.top-banner .ti{font-size:1.6em;animation:pulse 1s infinite}
.champ-banner{background:linear-gradient(135deg,#ffd93d,#c8963e);color:#5c4030;border-radius:14px;padding:14px 16px;margin-bottom:12px;font-weight:700;display:flex;align-items:center;gap:12px;animation:pulse 2s ease-in-out infinite;box-shadow:0 4px 14px rgba(200,150,62,.4)}
.champ-banner .trophy{font-size:1.6em;animation:trophy 1.2s infinite}
.motivation{background:linear-gradient(135deg,#fff9e6,#fff3cd);border:2px solid #e0c87a;border-radius:16px;padding:18px;margin-bottom:12px;position:relative;overflow:hidden;animation:slideRight .6s}
.motivation::before{content:'✨';position:absolute;top:10px;left:10px;font-size:1.5em;opacity:.3;animation:float 3s infinite}
.mot-text{font-size:1.05em;font-weight:600;line-height:1.8}
.mot-foot{font-size:.75em;color:#888;margin-top:10px;text-align:left}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}
.stat-card{background:#fff;border-radius:14px;padding:12px 8px;text-align:center;border:1px solid #e8dcc8}
.stat-value{font-size:1.5em;font-weight:800;color:#0f3d2a;line-height:1}
.stat-label{font-size:.7em;color:#888;margin-top:4px}
.tabs{display:flex;gap:3px;background:#fff;border-radius:12px;padding:4px;margin-bottom:12px;overflow-x:auto;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:0 0 auto;padding:10px 14px;border-radius:10px;font-size:.8em;font-weight:700;color:#5c4030;transition:all .25s;white-space:nowrap}
.tab.active{background:#1a6b4a;color:#fff}
.panel{display:none;animation:fadeIn .4s}
.panel.active{display:block}
.list-item{background:#fdf8f0;border-radius:12px;padding:12px;display:flex;align-items:center;gap:12px;margin

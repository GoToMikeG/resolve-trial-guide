// resolve-trial-guide.jsx — GoTo Resolve Trial Evaluation Tool
import React, { useState, useEffect, useRef } from 'react';

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const ICONS = {
  Check:         <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>,
  ChevronRight:  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/>,
  ChevronDown:   <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>,
  Download:      <><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4"/><path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16"/></>,
  FileText:      <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  Target:        <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  Calendar:      <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  BarChart3:     <><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/></>,
  AlertTriangle: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  ArrowRight:    <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  Star:          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  Mail:          <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  Save:          <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
  RefreshCw:     <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
  X:             <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  ClipboardList: <><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></>,
  Award:         <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
  Edit3:         <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
};
function Icon({ name, size=16, color='currentColor', strokeWidth=2, style }) {
  const p = ICONS[name]; if (!p) return null;
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} style={{display:'inline-block',verticalAlign:'middle',flexShrink:0,...style}}>{p}</svg>;
}

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root {
    --font: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;
    --font-mono: 'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;
    --bg:#171B1F; --bg2:#22292E; --surface:#22292E; --surface2:#2C353C; --surface3:#3D4852;
    --brand:#8552F6; --brand-hover:#A37BFB; --brand-subtle:rgba(133,82,246,0.14); --brand-border:rgba(133,82,246,0.5);
    --yellow:#F2DD06; --yellow-text:#171B1F;
    --text1:#FFFFFF; --text2:rgba(217,227,233,0.75); --text3:rgba(217,227,233,0.4);
    --border:rgba(88,121,143,0.45); --border2:rgba(88,121,143,0.7);
    --success:#2BA95C; --success-bg:rgba(43,169,92,0.12);
    --danger:#D33A61;  --danger-bg:rgba(211,58,97,0.1);
    --warning:#F2DD06; --warning-bg:rgba(242,221,6,0.1);
    --amber:#F59E0B;   --amber-bg:rgba(245,158,11,0.1);
    --grey:#6B7280;    --grey-bg:rgba(107,114,128,0.12);
    --shadow-sm:0 1px 3px rgba(0,0,0,.25),0 1px 2px rgba(0,0,0,.15);
    --shadow-md:0 4px 12px rgba(0,0,0,.3),0 2px 4px rgba(0,0,0,.2);
    --shadow-lg:0 8px 24px rgba(0,0,0,.35),0 4px 8px rgba(0,0,0,.2);
    --r-sm:4px; --r-md:8px; --r-lg:12px; --r-pill:1000px;
  }
  html,body{height:100%;}
  body{font-family:var(--font);background:var(--bg);color:var(--text1);line-height:1.6;-webkit-font-smoothing:antialiased;}

  /* ── Layout shells ── */
  .full-center{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;background:var(--bg);}
  .inner{width:100%;max-width:640px;}

  /* ── Brand mark ── */
  .brand-mark{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--brand);margin-bottom:36px;text-align:center;}

  /* ── Progress dots ── */
  .progress-dots{display:flex;gap:6px;justify-content:center;margin-bottom:40px;}
  .pdot{width:6px;height:6px;border-radius:var(--r-pill);background:var(--surface3);transition:background .25s,width .25s;}
  .pdot.done{background:var(--brand);}
  .pdot.active{background:var(--brand);width:18px;}

  /* ── Animations ── */
  .fade-up{animation:fadeUp .32s ease both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}

  /* ── Question block ── */
  .q-eyebrow{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--brand);margin-bottom:8px;}
  .q-text{font-size:20px;font-weight:600;color:var(--text1);margin-bottom:22px;line-height:1.35;}
  .q-sub{font-size:13px;color:var(--text2);margin-bottom:20px;line-height:1.55;}

  /* ── Option cards ── */
  .opt-card{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:var(--r-md);border:1px solid var(--border);background:var(--surface);cursor:pointer;margin-bottom:8px;transition:border-color .15s,box-shadow .15s,background .15s;user-select:none;}
  .opt-card:hover{border-color:var(--border2);box-shadow:var(--shadow-sm);background:var(--surface2);}
  .opt-card.selected{border-color:var(--brand);border-left:3px solid var(--brand);background:var(--brand-subtle);}
  .opt-radio{width:18px;height:18px;border-radius:50%;border:2px solid var(--text3);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:border-color .15s,background .15s;}
  .opt-check{width:18px;height:18px;border-radius:var(--r-sm);border:2px solid var(--text3);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:border-color .15s,background .15s;}
  .opt-card.selected .opt-radio,.opt-card.selected .opt-check{border-color:var(--brand);background:var(--brand);}
  .opt-label{font-size:14px;font-weight:500;color:var(--text1);}

  /* ── Status pills (RAG+) ── */
  .pill{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:var(--r-pill);font-size:11px;font-family:var(--font-mono);font-weight:600;white-space:nowrap;border:1px solid transparent;}
  .pill-met{background:var(--success-bg);color:var(--success);border-color:rgba(43,169,92,.3);}
  .pill-partial{background:var(--amber-bg);color:var(--amber);border-color:rgba(245,158,11,.3);}
  .pill-notmet{background:var(--danger-bg);color:var(--danger);border-color:rgba(211,58,97,.3);}
  .pill-skipped{background:var(--grey-bg);color:var(--grey);border-color:rgba(107,114,128,.25);}
  .pill-pass{background:var(--success-bg);color:var(--success);border-color:rgba(43,169,92,.3);font-size:13px;padding:5px 14px;}
  .pill-conditional{background:var(--amber-bg);color:var(--amber);border-color:rgba(245,158,11,.3);font-size:13px;padding:5px 14px;}
  .pill-notpassed{background:var(--danger-bg);color:var(--danger);border-color:rgba(211,58,97,.3);font-size:13px;padding:5px 14px;}

  /* ── Buttons ── */
  .btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:var(--r-md);font-family:var(--font);font-size:14px;font-weight:600;cursor:pointer;transition:background .15s,box-shadow .15s,transform .1s,border-color .15s;white-space:nowrap;border:none;}
  .btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
  .btn-primary{background:var(--brand);color:#fff;}
  .btn-primary:hover{background:var(--brand-hover);box-shadow:var(--shadow-sm);transform:translateY(-1px);}
  .btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border);}
  .btn-ghost:hover{border-color:var(--border2);color:var(--text1);background:var(--surface2);}
  .btn-danger{background:var(--danger-bg);color:var(--danger);border:1px solid rgba(211,58,97,.3);}
  .btn-danger:hover{background:rgba(211,58,97,.2);}
  .btn-sm{padding:7px 14px;font-size:13px;}

  /* ── Cards ── */
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:22px 26px;}
  .card-accent{background:var(--surface);border:1px solid var(--brand-border);border-left:3px solid var(--brand);border-radius:var(--r-lg);padding:22px 26px;}
  .card-warn{background:var(--amber-bg);border:1px solid rgba(245,158,11,.3);border-left:3px solid var(--amber);border-radius:var(--r-md);padding:16px 20px;}
  .card-danger{background:var(--danger-bg);border:1px solid rgba(211,58,97,.3);border-left:3px solid var(--danger);border-radius:var(--r-md);padding:16px 20px;}
  .card-success{background:var(--success-bg);border:1px solid rgba(43,169,92,.3);border-left:3px solid var(--success);border-radius:var(--r-md);padding:16px 20px;}

  /* ── Text helpers ── */
  .t1{color:var(--text1);} .t2{color:var(--text2);} .t3{color:var(--text3);}
  .eyebrow{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--brand);margin-bottom:6px;}
  .section-title{font-size:18px;font-weight:700;color:var(--text1);margin-bottom:16px;display:flex;align-items:center;gap:8px;}
  .divider{height:1px;background:var(--border);margin:36px 0;}
  .body-text{font-size:14px;line-height:1.75;color:var(--text2);}
  .body-text strong{color:var(--text1);font-weight:600;}

  /* ── Inputs ── */
  .field-input{width:100%;padding:10px 14px;border-radius:var(--r-md);border:1px solid var(--border);background:var(--bg);color:var(--text1);font-family:var(--font);font-size:14px;outline:none;transition:border-color .15s;}
  .field-input:focus{border-color:var(--brand);}
  .field-input::placeholder{color:var(--text3);}
  textarea.field-input{resize:vertical;min-height:72px;line-height:1.55;}

  /* ── Recall panel ── */
  .recall-panel{margin-top:28px;padding:18px 20px;border-radius:var(--r-lg);border:1px solid var(--border);background:var(--surface);}
  .recall-panel-title{font-size:12px;font-weight:600;color:var(--text2);margin-bottom:12px;}
  .recall-row{display:flex;gap:8px;}
  .recall-msg{margin-top:8px;font-size:12px;color:var(--danger);}
  .recall-msg.ok{color:var(--success);}

  /* ── Loading ── */
  .loading-label{font-size:18px;font-weight:600;color:var(--text1);}
  .loading-sub{font-size:12px;color:var(--text3);font-family:var(--font-mono);}
  .loading-track{width:260px;height:3px;background:var(--surface3);border-radius:var(--r-pill);overflow:hidden;}
  .loading-fill{height:100%;background:var(--brand);border-radius:var(--r-pill);animation:loadFill 1.2s cubic-bezier(.4,0,.2,1) forwards;}
  @keyframes loadFill{from{width:0}to{width:100%}}

  /* ── Check-in flow ── */
  .week-selector{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px;}
  @media(max-width:480px){.week-selector{grid-template-columns:1fr;}}
  .week-tile{padding:16px 18px;border-radius:var(--r-lg);border:1px solid var(--border);background:var(--surface);cursor:pointer;transition:border-color .15s,background .15s;}
  .week-tile:hover{border-color:var(--border2);background:var(--surface2);}
  .week-tile.selected{border-color:var(--brand);border-left:3px solid var(--brand);background:var(--brand-subtle);}
  .week-tile-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--brand);margin-bottom:4px;}
  .week-tile-title{font-size:13px;font-weight:600;color:var(--text1);line-height:1.35;}
  .week-tile-status{margin-top:6px;}
  .criteria-row{display:flex;flex-direction:column;gap:10px;}
  .crit-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:14px 16px;}
  .crit-name{font-size:13.5px;font-weight:600;color:var(--text1);margin-bottom:10px;}
  .status-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;}
  .status-opt{padding:5px 12px;border-radius:var(--r-pill);border:1px solid var(--border);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;font-family:var(--font-mono);}
  .status-opt:hover{border-color:var(--border2);}
  .status-opt.sel-met{background:var(--success-bg);color:var(--success);border-color:rgba(43,169,92,.5);}
  .status-opt.sel-partial{background:var(--amber-bg);color:var(--amber);border-color:rgba(245,158,11,.5);}
  .status-opt.sel-notmet{background:var(--danger-bg);color:var(--danger);border-color:rgba(211,58,97,.5);}
  .status-opt.sel-skipped{background:var(--grey-bg);color:var(--grey);border-color:rgba(107,114,128,.35);}
  .comment-toggle{font-size:11px;color:var(--text3);cursor:pointer;display:inline-flex;align-items:center;gap:4px;margin-bottom:6px;transition:color .15s;}
  .comment-toggle:hover{color:var(--text2);}

  /* ── Output / SAD layout ── */
  .output-wrap{background:var(--bg);min-height:100vh;}
  .output-layout{display:flex;max-width:1100px;margin:0 auto;padding:0 24px;}
  .sidenav{width:196px;flex-shrink:0;padding:32px 0;position:sticky;top:0;height:100vh;overflow-y:auto;border-right:1px solid var(--border);}
  @media(max-width:820px){.sidenav{display:none;}}
  .sidenav-logo{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--brand);padding:0 12px;margin-bottom:24px;}
  .sidenav-link{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--r-md);font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;text-decoration:none;margin-bottom:2px;transition:color .15s,background .15s;}
  .sidenav-link:hover{color:var(--text1);background:var(--surface2);}
  .sidenav-link.active{color:var(--brand);background:var(--brand-subtle);}
  .output-main{flex:1;min-width:0;padding:32px 0 80px 36px;}
  @media(max-width:820px){.output-main{padding:20px 0 60px;}}
  .output-topbar{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:36px;flex-wrap:wrap;}
  .output-title{font-size:24px;font-weight:700;color:var(--text1);line-height:1.2;}
  .output-subtitle{font-size:13px;color:var(--text2);margin-top:4px;}
  .topbar-actions{display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;}
  .out-section{margin-bottom:44px;animation:fadeUp .4s ease both;}

  /* ── Week cards ── */
  .weeks-grid{display:flex;flex-direction:column;gap:14px;}
  .week-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;transition:border-color .15s;}
  .week-card:hover{border-color:var(--border2);}
  .week-header{display:flex;align-items:center;gap:12px;padding:13px 18px;background:var(--surface2);border-bottom:1px solid var(--border);}
  .week-badge{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--yellow-text);background:var(--yellow);padding:2px 10px;border-radius:var(--r-pill);font-weight:600;flex-shrink:0;}
  .week-title-text{font-size:14px;font-weight:600;color:var(--text1);}
  .week-body{padding:16px 18px;}
  .week-tasks{list-style:none;display:flex;flex-direction:column;gap:9px;}
  .week-task{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;color:var(--text2);line-height:1.55;}
  .task-dot{width:5px;height:5px;border-radius:50%;background:var(--brand);flex-shrink:0;margin-top:8px;}

  /* ── Metrics table ── */
  .metrics-wrap{border-radius:var(--r-lg);border:1px solid var(--border);overflow-x:auto;}
  .metrics-table{width:100%;border-collapse:collapse;font-size:13px;}
  .metrics-table th{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);background:var(--surface2);padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);}
  .metrics-table td{padding:11px 14px;border-bottom:1px solid var(--border);color:var(--text2);vertical-align:top;line-height:1.5;}
  .metrics-table tr:last-child td{border-bottom:none;}
  .metrics-table tr:nth-child(even) td{background:rgba(44,53,60,.35);}
  .metrics-table td:first-child{color:var(--text1);font-weight:600;}

  /* ── Save panel ── */
  .save-panel{margin-top:44px;padding:22px 26px;border-radius:var(--r-lg);border:1px solid var(--brand-border);background:var(--brand-subtle);}
  .save-panel-title{font-size:15px;font-weight:600;color:var(--text1);margin-bottom:4px;}
  .save-panel-sub{font-size:13px;color:var(--text2);margin-bottom:14px;}
  .save-row{display:flex;gap:10px;flex-wrap:wrap;}
  .save-feedback{margin-top:10px;font-size:12px;color:var(--success);display:flex;align-items:center;gap:5px;}
  .save-feedback.err{color:var(--danger);}

  /* ── SAD / Evaluation Report ── */
  .sad-wrap{background:var(--bg);min-height:100vh;}
  .sad-cover{min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:60px;background:var(--bg);border-bottom:1px solid var(--border);}
  @media(max-width:600px){.sad-cover{padding:32px 24px;}}
  .sad-cover-logo{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--brand);}
  .sad-cover-title{font-size:36px;font-weight:700;color:var(--text1);line-height:1.2;margin-bottom:12px;}
  @media(max-width:600px){.sad-cover-title{font-size:26px;}}
  .sad-cover-sub{font-size:15px;color:var(--text2);}
  .sad-cover-meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px;}
  @media(max-width:600px){.sad-cover-meta{grid-template-columns:1fr;}}
  .sad-meta-item{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-md);padding:14px 16px;}
  .sad-meta-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--text3);margin-bottom:4px;}
  .sad-meta-value{font-size:14px;font-weight:600;color:var(--text1);}
  .sad-verdict-block{display:flex;align-items:center;gap:16px;padding:22px 26px;border-radius:var(--r-lg);border:1px solid var(--border);background:var(--surface2);margin-top:32px;}
  .sad-verdict-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--text3);margin-bottom:6px;}
  .sad-verdict-value{font-size:22px;font-weight:700;}
  .sad-body{max-width:860px;margin:0 auto;padding:48px 32px 80px;}
  @media(max-width:600px){.sad-body{padding:28px 16px 60px;}}
  .sad-section{margin-bottom:44px;}
  .sad-section-header{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid var(--border);}
  .sad-section-num{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--brand);}
  .sad-section-title{font-size:17px;font-weight:700;color:var(--text1);}
  .scorecard-table{width:100%;border-collapse:collapse;font-size:13px;}
  .scorecard-table th{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);background:var(--surface2);padding:9px 12px;text-align:left;border-bottom:1px solid var(--border);}
  .scorecard-table td{padding:11px 12px;border-bottom:1px solid var(--border);vertical-align:middle;color:var(--text2);}
  .scorecard-table tr:last-child td{border-bottom:none;}
  .scorecard-table td:first-child{color:var(--text1);font-weight:600;}
  .next-steps-table{width:100%;border-collapse:collapse;font-size:13px;}
  .next-steps-table th{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--text3);background:var(--surface2);padding:9px 12px;text-align:left;border-bottom:1px solid var(--border);}
  .next-steps-table td{padding:10px 12px;border-bottom:1px solid var(--border);color:var(--text2);vertical-align:top;}
  .next-steps-table tr:last-child td{border-bottom:none;}
  .editable-field{background:transparent;border:none;border-bottom:1px dashed var(--border2);color:var(--text1);font-family:var(--font);font-size:13px;padding:2px 4px;width:100%;outline:none;transition:border-color .15s;}
  .editable-field:focus{border-bottom-color:var(--brand);}

  /* ── Toast ── */
  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-pill);padding:10px 20px;font-size:13px;font-weight:500;color:var(--text1);box-shadow:var(--shadow-lg);animation:fadeUp .2s ease;z-index:999;white-space:nowrap;}

  /* ── Print / PDF ── */
  @media print {
    .sidenav,.topbar-actions,.save-panel,.toast,.sad-topbar,.no-print{display:none!important;}
    body{background:#fff!important;color:#111!important;}
    .output-layout,.sad-body{display:block!important;max-width:100%!important;padding:0!important;}
    .output-main{padding:0!important;}
    .card,.card-accent,.week-card,.card-danger,.card-warn,.card-success,.sad-meta-item{background:#f7f8fa!important;border-color:#ddd!important;break-inside:avoid;}
    .week-header,.metrics-table th,.scorecard-table th,.next-steps-table th{background:#eef0f3!important;}
    .eyebrow,.q-eyebrow,.sad-section-num,.sad-meta-label,.week-badge{color:#5c3abf!important;}
    .section-title,.sad-section-title,.sad-cover-title,.output-title,.week-title-text,.t1,strong{color:#111!important;}
    .body-text,.t2,.week-task,.metrics-table td,.scorecard-table td,.next-steps-table td{color:#333!important;}
    .metrics-table th,.scorecard-table th,.next-steps-table th{color:#555!important;}
    .week-badge{color:#171B1F!important;background:#F2DD06!important;}
    .sad-cover{min-height:auto!important;padding:32px 40px!important;border-bottom:2px solid #5c3abf!important;}
    .sad-cover-logo{color:#5c3abf!important;}
    .sad-verdict-block{background:#f0ecfd!important;border-color:#b89ef8!important;}
    .print-footer{display:block!important;position:fixed;bottom:0;left:0;right:0;text-align:center;font-size:9px;color:#888;padding:5px;border-top:1px solid #ccc;background:#fff;}
    .out-section,.sad-section{page-break-inside:avoid;}
  }
  .print-footer{display:none;}
`;
/* ─── INTAKE QUESTIONS ───────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 'role',
    label: 'Step 1 of 6 — Your Role',
    text: 'What best describes your role?',
    sub: 'Select all that apply.',
    multi: true,
    options: [
      { id: 'it_admin',       label: 'IT Admin or Systems Administrator' },
      { id: 'helpdesk_lead',  label: 'Help Desk Manager or Support Lead' },
      { id: 'it_director',    label: 'IT Director or VP of IT' },
      { id: 'msp_owner',      label: 'MSP Owner or Practice Manager' },
      { id: 'msp_tech',       label: 'MSP Technician or NOC Engineer' },
      { id: 'it_generalist',  label: 'IT Generalist (I do everything)' },
    ],
  },
  {
    id: 'envSize',
    label: 'Step 2 of 6 — Environment Size',
    text: 'How many devices or endpoints are you responsible for?',
    multi: false,
    options: [
      { id: 'under50',    label: 'Under 50' },
      { id: '50to250',    label: '50 to 250' },
      { id: '251to1000',  label: '251 to 1,000' },
      { id: '1001to5000', label: '1,001 to 5,000' },
      { id: 'over5000',   label: 'More than 5,000' },
    ],
  },
  {
    id: 'currentStack',
    label: 'Step 3 of 6 — Current Tools',
    text: 'Which tools are you currently using? Select all that apply.',
    multi: true,
    options: [
      { id: 'remote_tool',    label: 'A dedicated remote support tool (TeamViewer, AnyDesk, Splashtop, etc.)' },
      { id: 'rmm_platform',   label: 'A separate RMM platform (NinjaOne, Kaseya, Datto, ConnectWise, etc.)' },
      { id: 'mdm_tool',       label: 'Microsoft Intune or another MDM/endpoint management tool' },
      { id: 'helpdesk_tool',  label: 'A helpdesk or ticketing system (Zendesk, Freshservice, Jira Service Desk, etc.)' },
      { id: 'basic_tools',    label: 'I am using basic or built-in tools only (no dedicated platform)' },
      { id: 'adhoc_mix',      label: 'I am using a mix of free and ad-hoc tools' },
    ],
  },
  {
    id: 'painPoint',
    label: 'Step 4 of 6 — Primary Pain',
    text: 'What problems do you need to solve in the next 90 days?',
    sub: 'Select all that apply. Your guide will be built around your top priorities.',
    multi: true,
    options: [
      { id: 'remote_access',   label: 'I need faster, more reliable remote access to support my users' },
      { id: 'visibility',      label: 'I have no visibility into what is happening across my devices' },
      { id: 'patching',        label: 'Patching and software updates are taking too much manual time' },
      { id: 'helpdesk_broken', label: 'My helpdesk process is broken — tickets, sessions, and tools are disconnected' },
      { id: 'tool_reduction',  label: 'I need to reduce the number of tools I am paying for and managing' },
      { id: 'msp_mgmt',        label: 'I am an MSP and I need better multi-client management from one place' },
      { id: 'compliance',      label: 'I need to prove compliance or security posture to leadership or auditors' },
    ],
  },
  {
    id: 'successDef',
    label: 'Step 5 of 6 — Success Definition',
    text: 'How will you know this trial was a success?',
    sub: 'Select everything that would make this a win for you.',
    multi: true,
    options: [
      { id: 'unattended_access', label: 'I can remote into any device in my environment without calling the user first' },
      { id: 'live_inventory',    label: 'I have a live inventory of all devices with health and patch status visible' },
      { id: 'faster_tickets',    label: 'I resolved tickets faster using integrated remote sessions than I did before' },
      { id: 'tool_replaced',     label: 'I replaced at least one tool I am currently paying for' },
      { id: 'msp_console',       label: 'I can manage multiple client environments from a single console without confusion' },
      { id: 'compliance_report', label: 'I presented a compliance or patch coverage report to my manager or client' },
    ],
  },
  {
    id: 'biggestConcern',
    label: 'Step 6 of 6 — Your Concerns',
    text: 'What could cause you to walk away from this evaluation?',
    sub: 'Select all that apply — we will address each one directly in your guide.',
    multi: true,
    options: [
      { id: 'deploy_complexity', label: 'The agent is too complex or disruptive to deploy at scale' },
      { id: 'session_quality',   label: 'Remote sessions are unreliable or slow compared to what I use today' },
      { id: 'rmm_depth',         label: 'The RMM features are not deep enough to replace what I have' },
      { id: 'pricing',           label: 'Pricing does not justify replacing my current stack' },
      { id: 'team_adoption',     label: 'My team will not adopt a new tool without strong onboarding' },
      { id: 'trial_window',      label: 'I cannot get meaningful results within my trial window' },
    ],
  },
];

/* ─── CONTENT ENGINE ─────────────────────────────────────────────────────── */

const ROLE_MAP = {
  it_admin: 'IT Admin / Systems Administrator',
  helpdesk_lead: 'Help Desk Manager / Support Lead',
  it_director: 'IT Director / VP of IT',
  msp_owner: 'MSP Owner / Practice Manager',
  msp_tech: 'MSP Technician / NOC Engineer',
  it_generalist: 'IT Generalist',
};
// Accepts single string or array; always returns a display string
function getRoleLabel(role) {
  if (Array.isArray(role)) return role.map(r => ROLE_MAP[r] || r).join(' / ');
  return ROLE_MAP[role] || role || '—';
}
// Returns the primary (first) value for content logic
function getPrimaryRole(role) {
  return Array.isArray(role) ? role[0] : role;
}

function getEnvLabel(env) {
  const map = {
    under50: 'under 50 devices',
    '50to250': '50–250 devices',
    '251to1000': '251–1,000 devices',
    '1001to5000': '1,001–5,000 devices',
    over5000: 'more than 5,000 devices',
  };
  return map[env] || env;
}

function getStackLabels(stack) {
  const map = {
    remote_tool: 'a dedicated remote support tool',
    rmm_platform: 'a standalone RMM platform',
    mdm_tool: 'an MDM/endpoint management tool',
    helpdesk_tool: 'a helpdesk or ticketing system',
    basic_tools: 'basic or built-in tools only',
    adhoc_mix: 'a mix of free and ad-hoc tools',
  };
  return stack.map(s => map[s] || s);
}

const PAIN_MAP = {
  remote_access: 'faster, more reliable remote access',
  visibility: 'full device visibility and inventory',
  patching: 'automated patch management',
  helpdesk_broken: 'an integrated helpdesk workflow',
  tool_reduction: 'tool consolidation and cost reduction',
  msp_mgmt: 'multi-client MSP management',
  compliance: 'compliance and security posture reporting',
};
function getPainLabel(pain) {
  if (Array.isArray(pain)) return pain.map(p => PAIN_MAP[p] || p).join(', ');
  return PAIN_MAP[pain] || pain || '—';
}
function getPrimaryPain(pain) {
  return Array.isArray(pain) ? pain[0] : pain;
}

const SUCCESS_MAP = {
  unattended_access: 'unattended remote access to any device',
  live_inventory: 'live device inventory with health and patch status',
  faster_tickets: 'tickets resolved faster via integrated sessions',
  tool_replaced: 'replacing at least one existing paid tool',
  msp_console: 'managing multiple client environments from one console',
  compliance_report: 'a compliance or patch coverage report delivered to leadership',
};
function getSuccessLabel(s) {
  if (Array.isArray(s)) return s.map(x => SUCCESS_MAP[x] || x).join(', ');
  return SUCCESS_MAP[s] || s || '—';
}
function getPrimarySuccess(s) {
  return Array.isArray(s) ? s[0] : s;
}

const CONCERN_MAP = {
  deploy_complexity: 'agent deployment complexity',
  session_quality: 'remote session reliability and performance',
  rmm_depth: 'RMM feature depth vs. your current platform',
  pricing: 'pricing vs. stack consolidation value',
  team_adoption: 'team adoption and onboarding friction',
  trial_window: 'getting meaningful results within the trial window',
};
function getConcernLabel(c) {
  if (Array.isArray(c)) return c.map(x => CONCERN_MAP[x] || x).join(', ');
  return CONCERN_MAP[c] || c || '—';
}
function getPrimaryConcern(c) {
  return Array.isArray(c) ? c[0] : c;
}

/* ── Profile summary paragraph ── */
function buildProfileSummary(answers) {
  const role = getRoleLabel(answers.role);
  const env = getEnvLabel(answers.envSize);
  const stack = getStackLabels(answers.currentStack || []);
  const pain = getPainLabel(answers.painPoint);
  const success = getSuccessLabel(answers.successDef);
  const concern = getConcernLabel(answers.biggestConcern);

  let stackStr;
  if (stack.length === 0) stackStr = 'a mix of existing tools';
  else if (stack.length === 1) stackStr = stack[0];
  else stackStr = stack.slice(0, -1).join(', ') + ', and ' + stack[stack.length - 1];

  const painArr = Array.isArray(answers.painPoint) ? answers.painPoint : (answers.painPoint ? [answers.painPoint] : []);
  const painStr = painArr.length > 1 ? 'your top priorities: ' + pain : pain;

  return `You are evaluating GoTo Resolve as a ${role} responsible for ${env}. Your current environment includes ${stackStr}. The outcomes you need to achieve are ${painStr}. You will consider this trial a success when you have demonstrated ${success}. Your evaluation risk areas are ${concern} — this guide is structured to address each one directly.`;
}

/* ── First Value Target ── */
function buildFirstValue(answers) {
  const role = getPrimaryRole(answers.role);
  const painPoint = getPrimaryPain(answers.painPoint);
  const successDef = getPrimarySuccess(answers.successDef);
  const { envSize } = answers;

  if (role === 'helpdesk_lead' || painPoint === 'helpdesk_broken' || successDef === 'faster_tickets') {
    return `Your first value target is to resolve three real helpdesk tickets from creation to close without leaving the Resolve console — one from email, one from the end-user portal, and one created manually by you. Each ticket should escalate to an integrated remote session without opening a separate remote access tool. If you hit all three in your first week, you have proven the core helpdesk-to-session workflow that justifies this platform for your team.`;
  }

  if (role === 'msp_owner' || role === 'msp_tech' || painPoint === 'msp_mgmt' || successDef === 'msp_console') {
    return `Your first value target is to have two real client environments fully isolated in Resolve — each with enrolled devices, separate technician access controls, and at least one completed unattended remote session — within your first five business days. If you can toggle between those two client environments in under 10 seconds and remote into any device in either one without confusion, you have validated the multi-tenancy foundation that the rest of your MSP workflow depends on.`;
  }

  if (painPoint === 'compliance' || successDef === 'compliance_report') {
    return `Your first value target is a live compliance snapshot across your pilot device group: every enrolled device should be reporting OS version, patch status, and last-seen timestamp, and you should be able to identify your current patch gap — devices that are more than 30 days behind — within five business days. That single report, pulled without manual data collection, is your first proof that Resolve can replace the spreadsheet or patchwork of tools you are currently using for this.`;
  }

  if (painPoint === 'patching' || successDef === 'live_inventory') {
    const pilotSize = envSize === 'under50' ? '10 to 20' : '20 to 50';
    return `Within your first five business days, you should have the Resolve agent deployed on a pilot group of ${pilotSize} devices, a live inventory showing OS version, patch status, and hardware specs for every device in that group, and one patch policy deployed and confirmed successful on at least 80% of the pilot fleet. If you hit all three, you have validated the RMM core and proven that Resolve can give you the visibility your environment currently lacks.`;
  }

  if (painPoint === 'remote_access' || successDef === 'unattended_access') {
    return `Your first value target is simple and specific: remote into five devices in your environment without calling or emailing the user first — all via unattended access — within your first three business days. Test across device types if your environment is mixed. If sessions connect reliably and feel fast, you have cleared the bar that matters most for your use case. Everything else in this guide builds on that foundation.`;
  }

  if (painPoint === 'tool_reduction' || successDef === 'tool_replaced') {
    return `Your first value target is a capability map: within your first five business days, identify every tool you are currently paying for that has a direct equivalent in Resolve, and complete at least one real workflow in Resolve that you currently perform in one of those tools. You are not trying to replace everything in week one — you are confirming that the replacement path is real, not theoretical. One validated workflow substitution is enough to justify continuing the evaluation.`;
  }

  // default / it_director / it_generalist
  return `Your first value target is a working foundation: agent deployed on a pilot group, device inventory visible and complete, and one successful unattended remote session — all within your first five business days. These three things together confirm that Resolve can see your environment and reach into it, which is the prerequisite for everything else this evaluation will test.`;
}

/* ── Week-by-week plan ── */
function buildWeeklyPlan(answers) {
  const role = getPrimaryRole(answers.role);
  const painPoint = getPrimaryPain(answers.painPoint);
  const successDef = getPrimarySuccess(answers.successDef);
  const biggestConcern = getPrimaryConcern(answers.biggestConcern);
  const { envSize, currentStack } = answers;

  const isMSP = role === 'msp_owner' || role === 'msp_tech' || painPoint === 'msp_mgmt' || successDef === 'msp_console';
  const isHelpdesk = role === 'helpdesk_lead' || painPoint === 'helpdesk_broken' || successDef === 'faster_tickets';
  const isPatching = painPoint === 'patching' || painPoint === 'visibility' || successDef === 'live_inventory';
  const isCompliance = painPoint === 'compliance' || successDef === 'compliance_report';
  const isRemote = painPoint === 'remote_access' || successDef === 'unattended_access';
  const isConsolidate = painPoint === 'tool_reduction' || successDef === 'tool_replaced';

  const pilotSize = envSize === 'under50' ? '10–20' : envSize === '50to250' ? '20–50' : '50–100';

  const week1 = {
    label: 'Week 1',
    title: 'Foundation — Agent Deployment & First Access',
    tasks: isMSP ? [
      `Create your first two client sites in the Resolve multi-tenant console`,
      `Generate site-specific agent installers and deploy to 3–5 devices per client`,
      `Configure technician role-based access — verify technicians cannot see across client boundaries`,
      `Complete one unattended remote session per client site to confirm isolation is working`,
      `Document your baseline: how long does client context-switching take in your current tool?`,
    ] : [
      `Deploy the Resolve agent to a pilot group of ${pilotSize} devices using the group-specific installer`,
      `Validate inventory completeness — target 100% of pilot devices reporting within 24 hours`,
      `Review the patch gap report and document your current compliance baseline before any remediation`,
      `Create your first Device Group and confirm all pilot devices are correctly assigned`,
      `Complete one unattended remote session on a device in the pilot group`,
    ],
  };

  let week2;
  if (isMSP) {
    week2 = {
      label: 'Week 2',
      title: 'Multi-Tenant Operations — Cross-Client Efficiency',
      tasks: [
        `Test context-switching speed between client environments during a simulated live incident`,
        `Deploy a patch policy to one client and confirm it does not affect the second client`,
        `Run the same script on devices in both clients — validate output consistency`,
        `Measure technician context-switching time in Resolve vs. your current platform`,
        `Identify which client management workflows still require leaving the Resolve console`,
      ],
    };
  } else if (isHelpdesk) {
    week2 = {
      label: 'Week 2',
      title: 'Helpdesk Integration — Ticket-to-Session Workflow',
      tasks: [
        `Configure email-to-ticket integration and set up the end-user self-service portal`,
        `Resolve 3 real tickets end-to-end: one from email, one from the portal, one created manually`,
        `Test one-click escalation from an open ticket to an active remote session`,
        `Validate session recording and confirm recordings attach to the closed ticket`,
        `Measure time from ticket open to remote session active — record your baseline`,
      ],
    };
  } else if (isPatching || isCompliance) {
    week2 = {
      label: 'Week 2',
      title: 'Patch Management — Full Policy Cycle',
      tasks: [
        `Create a patch policy targeting your pilot Device Group`,
        `Run a patch scan and review results against the baseline you captured in Week 1`,
        `Deploy one OS patch and one third-party application patch to the pilot group`,
        `Validate patch success rate and review the failure log for any devices that did not comply`,
        `Test manual override — push a one-off patch to a single device on demand`,
      ],
    };
  } else if (isRemote) {
    week2 = {
      label: 'Week 2',
      title: 'Remote Access Depth — Multi-Device & Edge Cases',
      tasks: [
        `Test unattended access across all OS types in your environment (Windows, Mac, Linux if applicable)`,
        `Test attended session flow — confirm the end-user experience is acceptable`,
        `Validate multi-monitor support, file transfer, and clipboard sync in a real session`,
        `Test session behavior on a low-bandwidth or high-latency connection`,
        `Review session recordings and confirm they are stored and retrievable`,
      ],
    };
  } else {
    week2 = {
      label: 'Week 2',
      title: 'Core Use Case — Capability Validation',
      tasks: [
        `Identify the two or three workflows you perform most frequently across your current tools`,
        `Replicate each workflow entirely within Resolve — document where it maps cleanly`,
        `Flag any capability gaps and note whether they are blockers or workarounds`,
        `Run a patch policy on your pilot group and review the compliance output`,
        `Expand agent deployment to a second device group beyond your original pilot`,
      ],
    };
  }

  let week3;
  if (isMSP) {
    week3 = {
      label: 'Week 3',
      title: 'Client Reporting & Documentation',
      tasks: [
        `Generate a device health report for each client — evaluate completeness and export quality`,
        `Test per-client report branding — confirm each client's report is visually isolated`,
        `Review what data is exportable for client-facing QBRs and executive summaries`,
        `Test the AI scripting assistant: generate a client-specific automation from natural language`,
        `Document which client reporting needs Resolve covers vs. what still requires manual work`,
      ],
    };
  } else if (isHelpdesk) {
    week3 = {
      label: 'Week 3',
      title: 'Team Adoption Test',
      tasks: [
        `Add 2–3 of your technicians to Resolve and brief them on the core workflow`,
        `Have each technician handle their normal daily ticket volume in Resolve for 3 full days`,
        `Collect qualitative feedback: what is faster, what is slower, what is missing`,
        `Run the AI ticket summarization on 5 closed tickets — evaluate accuracy and time saved`,
        `Document the top 3 technician objections — you will address these directly in Week 4`,
      ],
    };
  } else if (isCompliance) {
    week3 = {
      label: 'Week 3',
      title: 'Compliance Reporting & Audit Readiness',
      tasks: [
        `Generate a full patch compliance report across all enrolled devices`,
        `Configure threshold-based alerts for devices that fall out of compliance`,
        `Test the policy enforcement workflow — apply a configuration policy and confirm enforcement`,
        `Export a compliance summary in a format you could present to leadership or an auditor`,
        `Identify any compliance data points that Resolve does not currently capture`,
      ],
    };
  } else {
    week3 = {
      label: 'Week 3',
      title: 'Automation, Scripting & AI Features',
      tasks: [
        `Use the AI scripting assistant to generate a script for your most common manual task`,
        `Deploy that script to the pilot group as a scheduled automation and validate output`,
        `Configure 2–3 device health alerts (disk space threshold, CPU spike, offline device)`,
        `Validate alert delivery and confirm the response workflow fits your team's process`,
        `Test the AI ticket summarization or anomaly detection features relevant to your environment`,
      ],
    };
  }

  let week4;
  if (biggestConcern === 'rmm_depth') {
    week4 = {
      label: 'Week 4',
      title: 'RMM Depth Validation — Head-to-Head with Your Current Tool',
      tasks: [
        `Write down 5 specific RMM tasks you perform regularly in your current platform`,
        `Attempt each one in Resolve and document: fully supported / workaround available / genuine gap`,
        `For any genuine gaps, share the specific use case with your SC before concluding it is a blocker`,
        `Test one advanced scenario: a multi-step scripted remediation with conditional logic`,
        `Decision framework: if 4 of 5 tasks work cleanly, the platform is viable — gaps are a roadmap conversation`,
      ],
    };
  } else if (biggestConcern === 'deploy_complexity') {
    week4 = {
      label: 'Week 4',
      title: 'Deployment Stress Test — Scale & Edge Cases',
      tasks: [
        `Expand agent deployment beyond your pilot group — target at least 2x the original pilot size`,
        `Test deployment via GPO or your existing software distribution method if applicable`,
        `Document every device that fails to enroll and classify the failure reason (network, firewall, OS version)`,
        `Validate that enrolled devices survive a reboot and reconnect automatically`,
        `Share your deployment failure rate and failure classification with your SC — target is under 5%`,
      ],
    };
  } else if (biggestConcern === 'team_adoption') {
    week4 = {
      label: 'Week 4',
      title: 'Adoption Decision — Objection Resolution',
      tasks: [
        `Review the technician objections documented in Week 3 with your SC`,
        `Classify each objection: configuration issue (fixable now) / learning curve (temporary) / product gap (flag)`,
        `For configuration issues: resolve them during the Week 4 SC session`,
        `For learning curve issues: identify the specific training or documentation that addresses it`,
        `Decision rule: if more than 2 of your top 3 objections are genuine product gaps, that is a real signal worth discussing with your SC before deciding`,
      ],
    };
  } else if (biggestConcern === 'pricing' || isMSP) {
    week4 = {
      label: 'Week 4',
      title: 'Stack Consolidation Math — Commercial Validation',
      tasks: [
        `List every tool you are currently paying for that Resolve partially or fully replaces`,
        `Map each capability to the specific Resolve feature that covers it`,
        `Calculate current per-seat or per-device spend on replaceable tools vs. Resolve pricing`,
        `Identify what stays — tools Resolve cannot replace today — and factor that into your model`,
        `Share this analysis with your SC before any commercial conversation — it is the most useful input they can have`,
      ],
    };
  } else if (biggestConcern === 'session_quality') {
    week4 = {
      label: 'Week 4',
      title: 'Session Reliability — Systematic Quality Assessment',
      tasks: [
        `Run 10 unattended sessions across different device types, network conditions, and geographies`,
        `Score each session: connection time, visual quality, input latency, stability`,
        `Test one session over a cellular hotspot or VPN to simulate field technician conditions`,
        `Compare your scores against your current remote access tool on the same devices`,
        `If you observe consistent quality issues on specific device types or networks, document and share with SC — many are resolvable at the infrastructure level`,
      ],
    };
  } else {
    week4 = {
      label: 'Week 4',
      title: 'Decision Criteria Validation — Trial Readout',
      tasks: [
        `Return to your success definition from the intake: have you achieved it? Document the evidence`,
        `Identify the one capability you are least confident about and stress-test it this week`,
        `Review the red flags section of this guide — have you observed any of them?`,
        `Prepare a 5-minute trial readout: what worked, what did not, what questions remain`,
        `Schedule a debrief with your SC before the trial expires — bring your readout and your concerns`,
      ],
    };
  }

  return [week1, week2, week3, week4];
}

/* ── Success Metrics ── */
function buildMetrics(answers) {
  const { role, painPoint, successDef, biggestConcern } = answers;
  const isMSP = role === 'msp_owner' || role === 'msp_tech' || painPoint === 'msp_mgmt' || successDef === 'msp_console';
  const isHelpdesk = role === 'helpdesk_lead' || painPoint === 'helpdesk_broken' || successDef === 'faster_tickets';
  const isCompliance = painPoint === 'compliance' || successDef === 'compliance_report';

  const base = [
    {
      name: 'Agent deployment success rate',
      how: 'Devices enrolled ÷ devices targeted × 100 in the Resolve device inventory',
      target: '95%+ of targeted devices enrolled within 48 hours',
      why: 'Deployment friction is the most common early blocker — a high rate confirms your network and security posture are compatible',
    },
    {
      name: 'Inventory completeness',
      how: 'Count of devices reporting OS, patch status, and hardware data vs. expected pilot size',
      target: '100% of enrolled devices reporting complete data within 24 hours of enrollment',
      why: 'Incomplete inventory means blind spots — you cannot patch or manage what you cannot see',
    },
  ];

  const patchMetric = {
    name: 'Patch compliance rate on pilot group',
    how: 'Compliant devices ÷ total enrolled devices, visible in the Patch Management dashboard',
    target: '90%+ compliant within 7 days of policy creation',
    why: 'This is your proof that Resolve can close the patch gap you identified in Week 1',
  };

  const sessionMetric = {
    name: 'Unattended session connection time',
    how: 'Time from clicking "Connect" to live session — measure 10 sessions and average',
    target: 'Under 15 seconds on a standard corporate network',
    why: 'Session latency is the most visceral indicator of whether your team will actually use the tool',
  };

  const ticketMetric = {
    name: 'Ticket-to-session time',
    how: 'Time from ticket created to remote session active — track manually on 10 tickets',
    target: 'Under 3 minutes from ticket open to active remote session',
    why: 'This single metric captures the workflow integration that justifies replacing your current stack',
  };

  const adoptionMetric = {
    name: 'Technician satisfaction score',
    how: 'Informal 1–5 rating from each technician after 3 days of daily use — average the scores',
    target: '3.5+ average, with no technician rating below 2',
    why: 'A tool your team refuses to use has no ROI — this catches adoption risk before you commit',
  };

  const mspIsolationMetric = {
    name: 'Client isolation verification',
    how: 'Confirm technician A (scoped to Client 1) cannot see Client 2 devices — test both directions',
    target: 'Zero cross-client visibility with default role-based access configuration',
    why: 'A single isolation failure is a disqualifying event for an MSP — test this before anything else',
  };

  const contextSwitchMetric = {
    name: 'Client context-switch time',
    how: 'Time to move from an active session in Client 1 to an active session in Client 2 — measure 5 switches',
    target: 'Under 10 seconds per switch',
    why: 'Multi-client efficiency is what differentiates an MSP platform from a single-tenant tool',
  };

  const complianceMetric = {
    name: 'Compliance report generation time',
    how: 'Time from opening Resolve to exporting a shareable patch compliance report',
    target: 'Under 5 minutes for a report covering your full pilot group',
    why: 'If generating a compliance snapshot takes longer than it does today, the tool is not solving your problem',
  };

  const scriptMetric = {
    name: 'Automation deployment success rate',
    how: 'Scripts that execute successfully on first run ÷ total scripts deployed',
    target: '90%+ on first run across pilot devices',
    why: 'Script reliability is the foundation of RMM value — one-off failures are normal, systemic failures are not',
  };

  const alertMetric = {
    name: 'Alert delivery latency',
    how: 'Time from threshold breach to alert notification in Resolve — trigger a test condition manually',
    target: 'Alert generated within 5 minutes of threshold breach',
    why: 'Slow alerts mean slow response — if your current tool is faster, that is a real regression to flag',
  };

  if (isMSP) {
    return [...base, mspIsolationMetric, contextSwitchMetric, patchMetric, sessionMetric];
  }
  if (isHelpdesk) {
    return [...base, ticketMetric, adoptionMetric, sessionMetric, alertMetric];
  }
  if (isCompliance) {
    return [...base, patchMetric, complianceMetric, alertMetric, scriptMetric];
  }
  return [...base, patchMetric, sessionMetric, scriptMetric, alertMetric];
}

/* ── Red Flags ── */
function buildRedFlags(answers) {
  const { biggestConcern, painPoint, role, envSize } = answers;
  const isMSP = role === 'msp_owner' || role === 'msp_tech' || painPoint === 'msp_mgmt';
  const isLarge = envSize === '1001to5000' || envSize === 'over5000';

  const flags = [];

  if (biggestConcern === 'rmm_depth') {
    flags.push({
      title: 'You cannot replicate a scripted workflow your team runs today',
      body: `If you attempt to recreate a specific multi-step automation from your current RMM and Resolve does not support the scripting logic or scheduling granularity you need, that is a genuine depth gap — not a configuration issue. <strong>What to do:</strong> Document the exact workflow (language, trigger, conditions, output) and share it with your SC. This is active development territory and your SC may have a supported workaround or a roadmap timeline that changes your calculus.`,
    });
    flags.push({
      title: 'Policy scope is not behaving as expected',
      body: `If you create a patch or configuration policy targeting a Device Group and the scope bleeds to unintended devices — or excludes devices it should catch — stop and check your Group assignments before escalating. This is almost always a Device Group configuration issue, not a product defect. <strong>What to do:</strong> Audit your Group membership rules before concluding there is a scoping bug.`,
    });
  }

  if (biggestConcern === 'deploy_complexity' || isLarge) {
    flags.push({
      title: 'Agent enrollment failure rate exceeds 10% with no clear error pattern',
      body: `Isolated enrollment failures are normal — firewall rules, endpoint security exceptions, and OS version edge cases all cause them. A failure rate above 10% with no repeating error code is different: it usually means a network-level policy is blocking the agent's communication path. <strong>What to do:</strong> Pull the enrollment failure log, identify whether failures cluster by subnet or device type, and share with your SC. Do not interpret broad enrollment failures as product quality until this is ruled out.`,
    });
  }

  if (biggestConcern === 'session_quality') {
    flags.push({
      title: 'Session latency is consistently higher than your current tool on the same devices',
      body: `Run this test head-to-head: connect to the same device with Resolve and your current tool within the same hour. If Resolve is meaningfully slower on a corporate network, document the delta. Occasional latency is infrastructure. Consistent latency on the same device is signal. <strong>What to do:</strong> Share your comparison data with your SC — Resolve has relay infrastructure in multiple regions, and SC can verify whether your devices are connecting to a suboptimal relay.`,
    });
  }

  if (biggestConcern === 'team_adoption') {
    flags.push({
      title: 'Technicians rate the tool below 2 out of 5 after 3 days — not just one of them',
      body: `One technician struggling is a training issue. Multiple technicians independently rating the workflow below 2 after 3 real days of use is a product fit signal. The most common cause is a specific missing keyboard shortcut, a required feature from their current tool, or a session handoff workflow that does not match their mental model. <strong>What to do:</strong> Do not dismiss this. Collect the specific objections, bring them to your SC, and distinguish between "different from what we know" and "worse for our actual job."`,
    });
  }

  if (biggestConcern === 'pricing') {
    flags.push({
      title: 'The consolidation math does not work even after mapping all replaced tools',
      body: `If you complete the Week 4 stack consolidation exercise and Resolve costs more than the tools it replaces — even accounting for the tools you can remove — that is a legitimate commercial concern, not an evaluation failure. <strong>What to do:</strong> Share your cost model with your SC before the trial ends. Pricing conversations are far more productive when they are grounded in a specific, documented comparison rather than a general objection.`,
    });
  }

  if (biggestConcern === 'trial_window') {
    flags.push({
      title: 'You reach the end of Week 2 and have not completed a single end-to-end workflow',
      body: `If you are mid-trial and have not yet completed one complete workflow — one ticket resolved, one device patched, one unattended session established — the evaluation is at risk of running out of time before producing a decision. This is usually caused by deployment blockers or competing priorities, not product issues. <strong>What to do:</strong> Contact your SC immediately. A focused half-day session with SC support can often compress two weeks of exploration into a single day of structured testing.`,
    });
  }

  if (isMSP) {
    flags.push({
      title: 'Client data or device lists are visible across site boundaries',
      body: `Any cross-client data visibility — even partial — is a disqualifying condition for an MSP deployment. This should not happen with default configuration, but verify it explicitly in Week 1. <strong>What to do:</strong> If you observe any cross-client data leakage, stop the evaluation and contact your SC immediately. This is a configuration audit, not a product defect — but it must be resolved before any client data is moved into the platform.`,
    });
  }

  // Always include a universal "learning curve vs. gap" red flag
  flags.push({
    title: 'You are frustrated with the UI but cannot name a specific missing capability',
    body: `Frustration with a new tool in the first two weeks is almost always a learning curve issue, not a product gap. If you find yourself annoyed but cannot articulate a specific workflow that is impossible — only one that is different from what you know — treat that as onboarding friction. <strong>What to do:</strong> Identify the three most frustrating moments and look them up in the Resolve knowledge base before escalating. Most "missing" features are present but in a different location than users expect.`,
  });

  return flags.slice(0, 5);
}

/* ── Next Step ── */
function buildNextStep(answers) {
  const { role, biggestConcern } = answers;
  const isMSP = role === 'msp_owner' || role === 'msp_tech';

  if (biggestConcern === 'trial_window') {
    return {
      cta: 'Start Week 1 today — time is your most constrained resource.',
      body: `Share this guide with anyone on your team who will be involved in the evaluation, and complete the Week 1 foundation tasks before your next meeting with your Solutions Consultant. <strong>Book a check-in with your SC at the end of Week 1</strong> — bring your agent enrollment count, your first inventory screenshot, and any blockers you hit. Your SC can compress your evaluation timeline significantly if you give them early signal on where you are stuck.`,
    };
  }

  if (isMSP) {
    return {
      cta: 'Set up your first two client sites before anything else.',
      body: `The entire MSP evaluation depends on validating multi-tenancy first. Share this guide with your senior technician or NOC lead, and complete the client site setup and isolation verification in Week 1 together. <strong>Book a commercial check-in with your SC at the end of Week 3</strong> — bring your consolidation math and your Week 3 client reporting assessment. That conversation will determine whether the commercial case is real.`,
    };
  }

  return {
    cta: 'Share this guide with your team and schedule your Week 1 kickoff.',
    body: `You do not need to run this evaluation alone. Share this guide with the one or two people on your team who will be most affected by the outcome, and align on who owns each week's testing tasks. <strong>Your Solutions Consultant is your most valuable resource during this trial</strong> — book a 30-minute check-in at the end of Week 2 and bring your results. They have seen hundreds of evaluations in environments like yours and can tell you quickly whether what you are seeing is normal or worth escalating.`,
  };
}
/* ─── localStorage ───────────────────────────────────────────────────────── */
const SC_EMAIL = 'francesca.gutierrez@goto.com';
const STORE = 'rg_v2_';

function saveRecord(email, record) {
  localStorage.setItem(STORE + email.trim().toLowerCase(), JSON.stringify(record));
}
function loadRecord(email) {
  const r = localStorage.getItem(STORE + email.trim().toLowerCase());
  try { return r ? JSON.parse(r) : null; } catch { return null; }
}
function newRecord(answers) {
  return { answers, savedAt: Date.now(), context: {}, checkIns: [] };
}
function upsertCheckIn(record, checkIn) {
  const idx = record.checkIns.findIndex(c => c.week === checkIn.week);
  if (idx >= 0) record.checkIns[idx] = checkIn;
  else record.checkIns.push(checkIn);
  return record;
}

/* ─── CHECK-IN QUESTION BUILDER ─────────────────────────────────────────── */
function buildCheckInCriteria(answers, week) {
  const weeks = buildWeeklyPlan(answers);
  const weekData = weeks[week - 1];
  if (!weekData) return [];
  // Turn each task into a scoreable criterion
  return weekData.tasks.map((task, i) => ({
    id: `w${week}_${i}`,
    name: task,
    status: null,  // 'met'|'partial'|'notmet'|'skipped'
    comment: '',
  }));
}

function computeVerdict(checkIns, answers) {
  if (!checkIns || checkIns.length === 0) return null;
  // Flatten all criteria across check-ins
  const allCriteria = checkIns.flatMap(c => c.criteria || []);
  if (allCriteria.length === 0) return null;
  const scored = allCriteria.filter(c => c.status && c.status !== 'skipped');
  if (scored.length === 0) return null;
  const notMet = scored.filter(c => c.status === 'notmet');
  const partial = scored.filter(c => c.status === 'partial');
  const met = scored.filter(c => c.status === 'met');
  if (notMet.length > scored.length * 0.25) return 'notpassed';
  if (partial.length > 0 || notMet.length > 0) return 'conditional';
  return 'pass';
}

function verdictDisplay(v) {
  if (v === 'pass')        return { label: 'Trial Passed',       cls: 'pill-pass',        color: 'var(--success)' };
  if (v === 'conditional') return { label: 'Conditional Pass',   cls: 'pill-conditional', color: 'var(--amber)'   };
  if (v === 'notpassed')   return { label: 'Not Passed',         cls: 'pill-notpassed',   color: 'var(--danger)'  };
  return                          { label: 'In Progress',        cls: 'pill-skipped',     color: 'var(--grey)'    };
}

const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'End of Trial'];
const STATUS_OPTIONS = [
  { value: 'met',     label: '✓ Met',          cls: 'sel-met'     },
  { value: 'partial', label: '~ Partial',       cls: 'sel-partial' },
  { value: 'notmet',  label: '✕ Not Met',       cls: 'sel-notmet'  },
  { value: 'skipped', label: '— Not Tested',    cls: 'sel-skipped' },
];

/* ─── CHECK-IN FLOW COMPONENT ───────────────────────────────────────────── */
function CheckInFlow({ record, onSave, onCancel }) {
  const [step, setStep] = useState('week');       // 'week'|'scope'|'criteria'|'done'
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [scopeChanged, setScopeChanged] = useState(null);
  const [updatedContext, setUpdatedContext] = useState('');
  const [criteria, setCriteria] = useState([]);

  const weeks = buildWeeklyPlan(record.answers);

  function handleWeekSelect(w) {
    setSelectedWeek(w);
    setStep('scope');
  }

  function handleScopeAnswer(changed) {
    setScopeChanged(changed);
    const base = buildCheckInCriteria(record.answers, selectedWeek);
    // Merge any prior check-in data for this week
    const prior = record.checkIns.find(c => c.week === selectedWeek);
    if (prior) {
      const merged = base.map(b => {
        const p = prior.criteria.find(x => x.id === b.id);
        return p ? { ...b, status: p.status, comment: p.comment } : b;
      });
      setCriteria(merged);
    } else {
      setCriteria(base);
    }
    setStep('criteria');
  }

  function updateCriterion(id, field, value) {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }

  function handleFinish() {
    const checkIn = {
      week: selectedWeek,
      completedAt: Date.now(),
      scopeChanged,
      updatedContext: scopeChanged ? updatedContext : '',
      criteria,
    };
    onSave(checkIn);
    setStep('done');
  }

  const weekTitle = selectedWeek ? (selectedWeek === 5 ? 'End of Trial Review' : weeks[selectedWeek - 1]?.title || '') : '';
  const allScored = criteria.length > 0 && criteria.every(c => c.status);

  if (step === 'done') {
    return (
      <div className="full-center">
        <div className="inner fade-up" style={{ textAlign: 'center' }}>
          <Icon name="Award" size={40} color="var(--brand)" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Check-in saved</div>
          <div className="body-text" style={{ marginBottom: 24 }}>Your Week {selectedWeek === 5 ? 'end-of-trial' : selectedWeek} results have been recorded.</div>
          <button className="btn btn-primary" onClick={onCancel}>Back to your guide</button>
        </div>
      </div>
    );
  }

  if (step === 'week') {
    const existingWeeks = new Set(record.checkIns.map(c => c.week));
    return (
      <div className="full-center">
        <div className="inner fade-up">
          <div className="brand-mark">GoTo Resolve</div>
          <div className="q-eyebrow">Trial Check-In</div>
          <div className="q-text">Which week are you checking in on?</div>
          <div className="q-sub">Select the week you just completed. You can update a previous check-in at any time.</div>
          <div className="week-selector">
            {[1, 2, 3, 4, 5].map(w => {
              const done = existingWeeks.has(w);
              const wLabel = w === 5 ? 'End of Trial' : `Week ${w}`;
              const wTitle = w === 5 ? 'Final Evaluation Review' : (weeks[w - 1]?.title || '');
              const prior = record.checkIns.find(c => c.week === w);
              const verdict = prior ? computeCheckInVerdict(prior.criteria) : null;
              return (
                <div key={w} className={`week-tile ${selectedWeek === w ? 'selected' : ''}`} onClick={() => handleWeekSelect(w)}>
                  <div className="week-tile-label">{wLabel}</div>
                  <div className="week-tile-title">{wTitle}</div>
                  {done && verdict && (
                    <div className="week-tile-status" style={{ marginTop: 6 }}>
                      <StatusPill status={verdict} />
                    </div>
                  )}
                  {done && !verdict && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>✓ Previously submitted</div>}
                </div>
              );
            })}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onCancel} style={{ marginTop: 20 }}>Cancel</button>
        </div>
      </div>
    );
  }

  if (step === 'scope') {
    return (
      <div className="full-center">
        <div className="inner fade-up">
          <div className="brand-mark">GoTo Resolve</div>
          <div className="q-eyebrow">Check-In · {selectedWeek === 5 ? 'End of Trial' : `Week ${selectedWeek}`}</div>
          <div className="q-text">Has anything changed from your original intake?</div>
          <div className="q-sub">Your original goal was: <strong style={{ color: 'var(--text1)' }}>{getPainLabel(record.answers.painPoint)}</strong>. Your success definition was: <strong style={{ color: 'var(--text1)' }}>{getSuccessLabel(record.answers.successDef)}</strong>.</div>
          {[
            { val: false, label: 'No — everything is the same, continue with my original plan' },
            { val: true,  label: 'Yes — my priorities or environment have changed' },
          ].map(opt => (
            <div key={String(opt.val)} className={`opt-card ${scopeChanged === opt.val ? 'selected' : ''}`} onClick={() => setScopeChanged(opt.val)}>
              <div className="opt-radio">{scopeChanged === opt.val && <Icon name="Check" size={11} color="#fff" strokeWidth={3} />}</div>
              <span className="opt-label">{opt.label}</span>
            </div>
          ))}
          {scopeChanged && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>Briefly describe what changed:</div>
              <textarea className="field-input" rows={3} placeholder="e.g. We expanded the pilot group, added MDM to scope, changed the primary evaluator..." value={updatedContext} onChange={e => setUpdatedContext(e.target.value)} />
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setStep('week')}>Back</button>
            <button className="btn btn-primary" disabled={scopeChanged === null} onClick={() => handleScopeAnswer(scopeChanged)}>
              Continue <Icon name="ChevronRight" size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'criteria') {
    return (
      <div className="full-center" style={{ justifyContent: 'flex-start', paddingTop: 48 }}>
        <div className="inner fade-up">
          <div className="brand-mark">GoTo Resolve</div>
          <div className="q-eyebrow">Check-In · {selectedWeek === 5 ? 'End of Trial' : `Week ${selectedWeek}`}</div>
          <div className="q-text">{weekTitle}</div>
          <div className="q-sub">Rate each task. Add a comment if anything needs context — optional but helpful.</div>
          <div className="criteria-row">
            {criteria.map(c => (
              <CriterionCard key={c.id} criterion={c} onChange={(field, val) => updateCriterion(c.id, field, val)} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setStep('scope')}>Back</button>
            <button className="btn btn-primary" disabled={!allScored} onClick={handleFinish}>
              Save Check-In <Icon name="Save" size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function CriterionCard({ criterion, onChange }) {
  const [showComment, setShowComment] = useState(!!criterion.comment);
  return (
    <div className="crit-card">
      <div className="crit-name">{criterion.name}</div>
      <div className="status-pills">
        {STATUS_OPTIONS.map(opt => (
          <button key={opt.value} className={`status-opt ${criterion.status === opt.value ? opt.cls : ''}`}
            onClick={() => onChange('status', opt.value)}>{opt.label}</button>
        ))}
      </div>
      <div className="comment-toggle" onClick={() => setShowComment(v => !v)}>
        <Icon name="Edit3" size={11} /> {showComment ? 'Hide comment' : 'Add comment'}
      </div>
      {showComment && (
        <input className="field-input" style={{ marginTop: 4 }} type="text" placeholder="Optional note..." value={criterion.comment} onChange={e => onChange('comment', e.target.value)} />
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const map = { met: 'pill-met', partial: 'pill-partial', notmet: 'pill-notmet', skipped: 'pill-skipped' };
  const lbl = { met: 'Met', partial: 'Partial', notmet: 'Not Met', skipped: 'Not Tested' };
  return <span className={`pill ${map[status] || 'pill-skipped'}`}>{lbl[status] || status}</span>;
}

function computeCheckInVerdict(criteria) {
  if (!criteria || criteria.length === 0) return 'skipped';
  const scored = criteria.filter(c => c.status && c.status !== 'skipped');
  if (scored.length === 0) return 'skipped';
  if (scored.some(c => c.status === 'notmet')) return 'partial';
  if (scored.some(c => c.status === 'partial')) return 'partial';
  return 'met';
}

/* ─── SAD / EVALUATION REPORT ───────────────────────────────────────────── */
function SADView({ record, onBack, onCheckIn }) {
  const { answers, checkIns = [], context = {} } = record;
  const weeks = buildWeeklyPlan(answers);
  const verdict = computeVerdict(checkIns, answers);
  const vd = verdictDisplay(verdict);

  // Editable next-steps rows
  const [nextSteps, setNextSteps] = useState([
    { action: 'Security / compliance review',        owner: '',  date: '', notes: '' },
    { action: 'Procurement / legal review',          owner: '',  date: '', notes: '' },
    { action: 'Reference customer call',             owner: 'GoTo SC', date: '', notes: '' },
    { action: 'Commercial proposal review',          owner: 'GoTo AE', date: '', notes: '' },
    { action: 'Final purchase decision',             owner: '',  date: '', notes: '' },
    { action: 'Proposed contract start date',        owner: '',  date: '', notes: '' },
  ]);

  function updateStep(i, field, val) {
    setNextSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }

  function buildEmailBody() {
    const sep = '─'.repeat(60);
    const thin = '·'.repeat(60);
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const lines = [];

    lines.push(`GoTo Resolve — Trial Evaluation Report`);
    lines.push(sep);
    lines.push(`Prepared:    ${date}`);
    lines.push(`Prepared by: ${SC_EMAIL}`);
    lines.push(``);

    lines.push(`EVALUATOR PROFILE`);
    lines.push(thin);
    lines.push(`Role:              ${getRoleLabel(answers.role)}`);
    lines.push(`Environment:       ${getEnvLabel(answers.envSize)}`);
    lines.push(`Primary goals:     ${getPainLabel(answers.painPoint)}`);
    lines.push(`Success criteria:  ${getSuccessLabel(answers.successDef)}`);
    lines.push(`Key concerns:      ${getConcernLabel(answers.biggestConcern)}`);
    lines.push(``);

    lines.push(`OVERALL VERDICT`);
    lines.push(thin);
    lines.push(`${vd.label}  (${checkIns.length} of 5 check-ins completed)`);
    lines.push(``);

    if (checkIns.length > 0) {
      lines.push(`WEEKLY RESULTS`);
      lines.push(thin);
      checkIns.forEach(ci => {
        const wLabel = ci.week === 5 ? 'End of Trial Review' : `Week ${ci.week}`;
        const scored = (ci.criteria || []).filter(c => c.status && c.status !== 'skipped');
        const metCount = scored.filter(c => c.status === 'met').length;
        lines.push(`${wLabel}  (${metCount}/${(ci.criteria||[]).length} tasks met · ${new Date(ci.completedAt).toLocaleDateString()})`);
        if (ci.scopeChanged && ci.updatedContext) lines.push(`  Scope note: ${ci.updatedContext}`);
        (ci.criteria || []).forEach(c => {
          const statusLabel = { met: '✓ Met', partial: '~ Partial', notmet: '✕ Not Met', skipped: '— Not Tested' }[c.status] || '—';
          lines.push(`  ${statusLabel.padEnd(14)} ${c.name}${c.comment ? `\n                   Note: ${c.comment}` : ''}`);
        });
        lines.push(``);
      });
    }

    const filledSteps = nextSteps.filter(s => s.owner || s.date || s.notes);
    if (filledSteps.length > 0) {
      lines.push(`NEXT STEPS`);
      lines.push(thin);
      nextSteps.forEach(s => {
        if (!s.action) return;
        lines.push(`• ${s.action}`);
        if (s.owner) lines.push(`    Owner:  ${s.owner}`);
        if (s.date)  lines.push(`    Date:   ${s.date}`);
        if (s.notes) lines.push(`    Notes:  ${s.notes}`);
      });
      lines.push(``);
    }

    lines.push(sep);
    lines.push(`CONFIDENTIAL — GoTo Solutions Consulting`);
    lines.push(SC_EMAIL);

    return encodeURIComponent(lines.join('\n'));
  }

  function handleEmail() {
    const subject = encodeURIComponent(`GoTo Resolve Trial Evaluation Report — ${getRoleLabel(answers.role)}`);
    const body = buildEmailBody();
    window.location.href = `mailto:${SC_EMAIL}?subject=${subject}&body=${body}`;
  }

  const completedWeekNums = checkIns.map(c => c.week);
  const allWeeksDone = completedWeekNums.length >= 4;

  return (
    <div className="sad-wrap">
      <div className="print-footer">
        GoTo Resolve Trial Evaluation Report | Confidential | francesca.gutierrez@goto.com
      </div>

      {/* Top bar — hidden on print */}
      <div className="no-print" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon name="ChevronRight" size={13} style={{ transform: 'rotate(180deg)' }} /> Back to Guide</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-ghost btn-sm" onClick={onCheckIn}><Icon name="ClipboardList" size={13} /> Add Check-In</button>
        <button className="btn btn-ghost btn-sm" onClick={handleEmail}><Icon name="Mail" size={13} /> Email to SC</button>
        <button className="btn btn-primary btn-sm" onClick={() => window.print()}><Icon name="Download" size={13} /> Export PDF</button>
      </div>

      {/* Cover */}
      <div className="sad-cover">
        <div>
          <div className="sad-cover-logo">GoTo Resolve</div>
        </div>
        <div>
          <div className="sad-cover-title">Trial Evaluation Report</div>
          <div className="sad-cover-sub">Prepared {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="sad-cover-meta">
            <div className="sad-meta-item">
              <div className="sad-meta-label">Evaluator Role</div>
              <div className="sad-meta-value">{getRoleLabel(answers.role)}</div>
            </div>
            <div className="sad-meta-item">
              <div className="sad-meta-label">Environment</div>
              <div className="sad-meta-value">{getEnvLabel(answers.envSize)}</div>
            </div>
            <div className="sad-meta-item">
              <div className="sad-meta-label">Primary Goal</div>
              <div className="sad-meta-value">{getPainLabel(answers.painPoint)}</div>
            </div>
            <div className="sad-meta-item">
              <div className="sad-meta-label">Check-Ins Completed</div>
              <div className="sad-meta-value">{checkIns.length} of 5</div>
            </div>
          </div>
          <div className="sad-verdict-block">
            <div>
              <div className="sad-verdict-label">Overall Trial Verdict</div>
              <div className="sad-verdict-value" style={{ color: vd.color }}>{vd.label}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className={`pill ${vd.cls}`} style={{ fontSize: 13, padding: '6px 16px' }}>{vd.label}</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
          CONFIDENTIAL — GoTo Solutions Consulting · {SC_EMAIL}
        </div>
      </div>

      <div className="sad-body">

        {/* S1 — Executive Summary */}
        <div className="sad-section">
          <div className="sad-section-header">
            <span className="sad-section-num">Section 01</span>
            <span className="sad-section-title">Executive Summary</span>
          </div>
          <div className="card-accent">
            <p className="body-text">
              This report summarizes the GoTo Resolve trial evaluation conducted by a <strong>{getRoleLabel(answers.role)}</strong> managing <strong>{getEnvLabel(answers.envSize)}</strong>.
              The evaluation focused on <strong>{getPainLabel(answers.painPoint)}</strong>.
              Success was defined as: <strong>{getSuccessLabel(answers.successDef)}</strong>.
              The primary concern entering the trial was <strong>{getConcernLabel(answers.biggestConcern)}</strong>.
            </p>
            <p className="body-text" style={{ marginTop: 12 }}>
              {checkIns.length === 0 && 'No check-ins have been submitted yet. Complete weekly check-ins to build the full evaluation record.'}
              {checkIns.length > 0 && `${checkIns.length} check-in${checkIns.length > 1 ? 's' : ''} completed. Overall verdict: `}
              {checkIns.length > 0 && <strong style={{ color: vd.color }}>{vd.label}</strong>}
              {checkIns.length > 0 && '.'}
            </p>
            {context.scopeChanged && context.updatedContext && (
              <p className="body-text" style={{ marginTop: 12 }}>
                <strong>Scope update noted:</strong> {context.updatedContext}
              </p>
            )}
          </div>
        </div>

        {/* S2 — Evaluation Profile */}
        <div className="sad-section">
          <div className="sad-section-header">
            <span className="sad-section-num">Section 02</span>
            <span className="sad-section-title">Evaluation Profile &amp; Objectives</span>
          </div>
          <div className="card">
            <p className="body-text">{buildProfileSummary(answers)}</p>
            {checkIns.some(c => c.scopeChanged) && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 8, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Scope Changes Noted During Trial</div>
                {checkIns.filter(c => c.scopeChanged && c.updatedContext).map((c, i) => (
                  <div key={i} className="card-warn" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--amber)', fontFamily: 'var(--font-mono)', marginRight: 8 }}>{c.week === 5 ? 'END OF TRIAL' : `WEEK ${c.week}`}</span>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>{c.updatedContext}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* S3 — Success Criteria Scorecard */}
        <div className="sad-section">
          <div className="sad-section-header">
            <span className="sad-section-num">Section 03</span>
            <span className="sad-section-title">Success Criteria Scorecard</span>
          </div>
          {checkIns.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>
              No check-ins submitted yet. Weekly check-ins will populate this scorecard.
            </div>
          ) : (
            <div style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table className="scorecard-table">
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Task / Criterion</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {checkIns.map(ci =>
                    (ci.criteria || []).map((c, i) => (
                      <tr key={c.id}>
                        {i === 0 && (
                          <td rowSpan={ci.criteria.length} style={{ verticalAlign: 'top', paddingTop: 14 }}>
                            <span className="week-badge" style={{ fontSize: 10 }}>{ci.week === 5 ? 'End' : `Wk ${ci.week}`}</span>
                          </td>
                        )}
                        <td style={{ color: 'var(--text1)', fontWeight: 500 }}>{c.name}</td>
                        <td><StatusPill status={c.status || 'skipped'} /></td>
                        <td style={{ color: 'var(--text2)', fontSize: 12 }}>{c.comment || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* S4 — Week-by-Week Results */}
        <div className="sad-section">
          <div className="sad-section-header">
            <span className="sad-section-num">Section 04</span>
            <span className="sad-section-title">Week-by-Week Results</span>
          </div>
          {checkIns.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)' }}>No check-ins submitted yet.</div>
          ) : (
            <div className="weeks-grid">
              {checkIns.map(ci => {
                const wv = computeCheckInVerdict(ci.criteria);
                const wLabel = ci.week === 5 ? 'End of Trial Review' : (weeks[ci.week - 1]?.title || `Week ${ci.week}`);
                const metCount = (ci.criteria || []).filter(c => c.status === 'met').length;
                const total = (ci.criteria || []).length;
                return (
                  <div key={ci.week} className="week-card">
                    <div className="week-header">
                      <span className="week-badge">{ci.week === 5 ? 'End' : `Week ${ci.week}`}</span>
                      <span className="week-title-text">{wLabel}</span>
                      <span style={{ marginLeft: 'auto' }}><StatusPill status={wv} /></span>
                    </div>
                    <div className="week-body">
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>
                        {metCount} of {total} tasks met · completed {new Date(ci.completedAt).toLocaleDateString()}
                        {ci.scopeChanged && <span style={{ marginLeft: 8, color: 'var(--amber)' }}>· Scope updated</span>}
                      </div>
                      <ul className="week-tasks">
                        {(ci.criteria || []).map(c => (
                          <li key={c.id} className="week-task">
                            <span className="task-dot" style={{ background: c.status === 'met' ? 'var(--success)' : c.status === 'notmet' ? 'var(--danger)' : c.status === 'partial' ? 'var(--amber)' : 'var(--grey)' }} />
                            <span>{c.name}</span>
                            <span style={{ marginLeft: 'auto', flexShrink: 0 }}><StatusPill status={c.status || 'skipped'} /></span>
                          </li>
                        ))}
                      </ul>
                      {ci.criteria.some(c => c.comment) && (
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                          {ci.criteria.filter(c => c.comment).map(c => (
                            <div key={c.id} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
                              <span style={{ color: 'var(--text3)' }}>Note:</span> {c.comment}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* S5 — Gaps & Open Items */}
        {checkIns.some(ci => (ci.criteria || []).some(c => c.status === 'notmet' || c.status === 'partial')) && (
          <div className="sad-section">
            <div className="sad-section-header">
              <span className="sad-section-num">Section 05</span>
              <span className="sad-section-title">Gaps &amp; Open Items</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {checkIns.flatMap(ci =>
                (ci.criteria || []).filter(c => c.status === 'notmet' || c.status === 'partial').map(c => (
                  <div key={c.id} className={c.status === 'notmet' ? 'card-danger' : 'card-warn'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <StatusPill status={c.status} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)' }}>{c.name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{ci.week === 5 ? 'END OF TRIAL' : `WEEK ${ci.week}`}</span>
                    </div>
                    {c.comment && <p style={{ fontSize: 13, color: 'var(--text2)' }}>{c.comment}</p>}
                    {!c.comment && <p style={{ fontSize: 13, color: 'var(--text3)', fontStyle: 'italic' }}>No notes provided. Share details with your SC for remediation guidance.</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* S6 — Recommended Next Steps (editable) */}
        <div className="sad-section">
          <div className="sad-section-header">
            <span className="sad-section-num">Section 06</span>
            <span className="sad-section-title">Recommended Next Steps</span>
          </div>
          <p className="body-text" style={{ marginBottom: 16 }}>Fill in owners and target dates. This table is included in your PDF export and email to your SC.</p>
          <div style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table className="next-steps-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Owner</th>
                  <th>Target Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {nextSteps.map((s, i) => (
                  <tr key={i}>
                    <td style={{ color: 'var(--text1)', fontWeight: 500 }}>{s.action}</td>
                    <td><input className="editable-field" placeholder="Name / team" value={s.owner} onChange={e => updateStep(i, 'owner', e.target.value)} /></td>
                    <td><input className="editable-field" placeholder="MM/DD" value={s.date} onChange={e => updateStep(i, 'date', e.target.value)} /></td>
                    <td><input className="editable-field" placeholder="—" value={s.notes} onChange={e => updateStep(i, 'notes', e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* S7 — Contact */}
        <div className="sad-section">
          <div className="sad-section-header">
            <span className="sad-section-num">Section 07</span>
            <span className="sad-section-title">Your GoTo Team</span>
          </div>
          <div className="card">
            <p className="body-text">Your Solutions Consultant is your primary resource throughout this evaluation and the commercial process. Reach out with questions about gaps, roadmap items, or next steps before making your final decision.</p>
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--surface2)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="Mail" size={15} color="var(--brand)" />
              <a href={`mailto:${SC_EMAIL}`} style={{ color: 'var(--brand)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{SC_EMAIL}</a>
            </div>
          </div>
        </div>

        {/* Email CTA */}
        <div className="no-print" style={{ marginTop: 48, padding: '24px 28px', borderRadius: 'var(--r-lg)', border: '1px solid var(--brand-border)', background: 'var(--brand-subtle)' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Send this report to your SC</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
            Clicking the button below opens your email client with this report pre-filled. If you have a direct SC, add their address to the To field. Otherwise it will go to the GoTo Solutions team.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleEmail}><Icon name="Mail" size={14} /> Email Report to SC</button>
            <button className="btn btn-ghost" onClick={() => window.print()}><Icon name="Download" size={14} /> Export PDF</button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── OUTPUT / GUIDE VIEW ───────────────────────────────────────────────── */
function OutputView({ record, onCheckIn, onViewSAD, onSave, onReset }) {
  const { answers, checkIns = [] } = record;
  const weeks = buildWeeklyPlan(answers);
  const [saveEmail, setSaveEmail] = useState('');
  const [saveFeedback, setSaveFeedback] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const verdict = computeVerdict(checkIns, answers);
  const vd = verdictDisplay(verdict);

  const SECTIONS = [
    { id: 'overview',  label: 'Overview',       icon: 'LayoutDashboard' },
    { id: 'week1',     label: 'Week 1',          icon: 'Calendar' },
    { id: 'week2',     label: 'Week 2',          icon: 'Calendar' },
    { id: 'week3',     label: 'Week 3',          icon: 'Calendar' },
    { id: 'week4',     label: 'Week 4',          icon: 'Calendar' },
    { id: 'endtrial',  label: 'End of Trial',    icon: 'Award' },
    { id: 'resources', label: 'Resources',       icon: 'BookOpen' },
  ];

  function handleSave() {
    if (!saveEmail.trim() || !saveEmail.includes('@')) {
      setSaveFeedback('err:Please enter a valid email address.');
      return;
    }
    saveRecord(saveEmail, record);
    setSaveFeedback('ok:Saved! Use this email to recall your guide later.');
  }

  const completedWeekNums = new Set(checkIns.map(c => c.week));

  return (
    <div className="output-wrap">
      <div className="output-layout">
        {/* Side nav */}
        <nav className="sidenav">
          <div className="sidenav-logo">GoTo Resolve</div>
          {SECTIONS.map(s => (
            <a key={s.id} className={`sidenav-link ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}>
              <Icon name={s.icon} size={14} />
              {s.label}
              {(s.id.startsWith('week') || s.id === 'endtrial') && (() => {
                const wNum = s.id === 'endtrial' ? 5 : parseInt(s.id.replace('week',''));
                if (completedWeekNums.has(wNum)) {
                  const ci = checkIns.find(c => c.week === wNum);
                  const wv = computeCheckInVerdict(ci?.criteria);
                  return <span style={{ marginLeft: 'auto' }}><StatusPill status={wv} /></span>;
                }
                return null;
              })()}
            </a>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '16px 12px' }} />
          <a className="sidenav-link" onClick={onCheckIn}>
            <Icon name="ClipboardList" size={14} /> Check In
          </a>
          <a className="sidenav-link" onClick={onViewSAD}>
            <Icon name="FileText" size={14} /> Evaluation Report
          </a>
        </nav>

        {/* Main content */}
        <main className="output-main">
          {/* Top bar */}
          <div className="output-topbar">
            <div>
              <div className="output-title">Your 30-Day Trial Guide</div>
              <div className="output-subtitle">
                {getRoleLabel(answers.role)} · {getEnvLabel(answers.envSize)} · {getPainLabel(answers.painPoint)}
              </div>
            </div>
            <div className="topbar-actions">
              <button className="btn btn-ghost btn-sm" onClick={onCheckIn}>
                <Icon name="ClipboardList" size={13} /> Check In
              </button>
              {checkIns.length > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={onViewSAD}>
                  <Icon name="FileText" size={13} /> Evaluation Report
                  <span className={`pill ${vd.cls}`} style={{ marginLeft: 4, fontSize: 10, padding: '2px 8px' }}>{vd.label}</span>
                </button>
              )}
              <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                <Icon name="Download" size={13} /> Export PDF
              </button>
            </div>
          </div>

          {/* Check-in progress banner */}
          {checkIns.length > 0 && (
            <div className="card-accent" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Trial Progress</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{checkIns.length} of 5 check-ins completed · Overall: <strong style={{ color: vd.color }}>{vd.label}</strong></div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map(w => {
                  const done = completedWeekNums.has(w);
                  const ci = checkIns.find(c => c.week === w);
                  const wv = ci ? computeCheckInVerdict(ci.criteria) : null;
                  const dotColor = done ? (wv === 'met' ? 'var(--success)' : wv === 'partial' ? 'var(--amber)' : 'var(--danger)') : 'var(--surface3)';
                  return (
                    <div key={w} title={w === 5 ? 'End of Trial' : `Week ${w}`}
                      style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, transition: 'background .3s' }} />
                  );
                })}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={onViewSAD}>View Report</button>
            </div>
          )}

          {/* Section: Overview */}
          {activeSection === 'overview' && (
            <div className="out-section">
              <div className="eyebrow">Evaluation Overview</div>
              <div className="section-title"><Icon name="LayoutDashboard" size={18} /> Your Trial at a Glance</div>
              <div className="card" style={{ marginBottom: 20 }}>
                <p className="body-text">{buildProfileSummary(answers)}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'Primary Goal',       value: getPainLabel(answers.painPoint) },
                  { label: 'Success Definition',  value: getSuccessLabel(answers.successDef) },
                  { label: 'Top Concern',         value: getConcernLabel(answers.biggestConcern) },
                  { label: 'Environment',         value: getEnvLabel(answers.envSize) },
                ].map(m => (
                  <div key={m.label} className="card">
                    <div className="eyebrow" style={{ marginBottom: 6 }}>{m.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text1)' }}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>30-Day Roadmap</div>
              <div className="weeks-grid">
                {weeks.map((w, idx) => {
                  const wNum = idx + 1;
                  const ci = checkIns.find(c => c.week === wNum);
                  const wv = ci ? computeCheckInVerdict(ci.criteria) : null;
                  return (
                    <div key={wNum} className="week-card" onClick={() => setActiveSection(`week${wNum}`)}>
                      <div className="week-header">
                        <span className="week-badge">Week {wNum}</span>
                        <span className="week-title-text">{w.title}</span>
                        <span style={{ marginLeft: 'auto' }}>
                          {wv ? <StatusPill status={wv} /> : <span style={{ fontSize: 11, color: 'var(--text3)' }}>Not started</span>}
                        </span>
                      </div>
                      <div className="week-body">
                        <ul className="week-tasks">
                          {w.tasks.slice(0, 3).map((t, i) => (
                            <li key={i} className="week-task"><span className="task-dot" /><span>{t}</span></li>
                          ))}
                          {w.tasks.length > 3 && <li className="week-task" style={{ color: 'var(--text3)', fontStyle: 'italic' }}>+{w.tasks.length - 3} more tasks</li>}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sections: Week 1–4 */}
          {[1,2,3,4].map(wNum => activeSection === `week${wNum}` && (
            <div key={wNum} className="out-section">
              <div className="eyebrow">Week {wNum}</div>
              <div className="section-title"><Icon name="Calendar" size={18} /> {weeks[wNum-1]?.title}</div>
              {(() => {
                const ci = checkIns.find(c => c.week === wNum);
                const wv = ci ? computeCheckInVerdict(ci.criteria) : null;
                return (
                  <>
                    {ci ? (
                      <div className="card-accent" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <StatusPill status={wv} />
                          <span style={{ fontSize: 13, color: 'var(--text2)' }}>Check-in completed {new Date(ci.completedAt).toLocaleDateString()}</span>
                          {ci.scopeChanged && <span style={{ color: 'var(--amber)', fontSize: 12 }}>· Scope updated</span>}
                        </div>
                        {ci.scopeChanged && ci.updatedContext && (
                          <p style={{ fontSize: 13, color: 'var(--text2)' }}><strong>Scope note:</strong> {ci.updatedContext}</p>
                        )}
                      </div>
                    ) : (
                      <div className="card-warn" style={{ marginBottom: 20 }}>
                        <span style={{ fontSize: 13, color: 'var(--amber)' }}>No check-in yet for this week. </span>
                        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }} onClick={onCheckIn}>Add Check-In</button>
                      </div>
                    )}
                    <div className="weeks-grid">
                      <div className="week-card">
                        <div className="week-header">
                          <span className="week-badge">Week {wNum}</span>
                          <span className="week-title-text">{weeks[wNum-1]?.title}</span>
                        </div>
                        <div className="week-body">
                          <ul className="week-tasks">
                            {(weeks[wNum-1]?.tasks || []).map((t, i) => {
                              const criterion = ci?.criteria?.find(c => c.id === `w${wNum}_${i}`);
                              return (
                                <li key={i} className="week-task">
                                  <span className="task-dot" style={{ background: criterion ? (criterion.status === 'met' ? 'var(--success)' : criterion.status === 'notmet' ? 'var(--danger)' : criterion.status === 'partial' ? 'var(--amber)' : 'var(--grey)') : 'var(--brand)' }} />
                                  <span>{t}</span>
                                  {criterion && <span style={{ marginLeft: 'auto', flexShrink: 0 }}><StatusPill status={criterion.status || 'skipped'} /></span>}
                                </li>
                              );
                            })}
                          </ul>
                          {ci?.criteria?.some(c => c.comment) && (
                            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>Notes</div>
                              {ci.criteria.filter(c => c.comment).map(c => (
                                <div key={c.id} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
                                  <span style={{ color: 'var(--text3)' }}>Note:</span> {c.comment}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {weeks[wNum-1]?.metrics && weeks[wNum-1].metrics.length > 0 && (
                      <>
                        <div className="eyebrow" style={{ marginTop: 32, marginBottom: 10 }}>Success Metrics</div>
                        <div className="metrics-wrap">
                          <table className="metrics-table">
                            <thead><tr><th>Metric</th><th>Target</th><th>How to Measure</th></tr></thead>
                            <tbody>
                              {weeks[wNum-1].metrics.map((m, i) => (
                                <tr key={i}><td>{m.metric}</td><td>{m.target}</td><td>{m.measure}</td></tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
          ))}

          {/* Section: End of Trial */}
          {activeSection === 'endtrial' && (
            <div className="out-section">
              <div className="eyebrow">End of Trial</div>
              <div className="section-title"><Icon name="Award" size={18} /> Final Evaluation Review</div>
              {(() => {
                const ci = checkIns.find(c => c.week === 5);
                const wv = ci ? computeCheckInVerdict(ci.criteria) : null;
                return (
                  <>
                    {ci ? (
                      <div className="card-accent" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <StatusPill status={wv} />
                          <span style={{ fontSize: 13, color: 'var(--text2)' }}>Final review completed {new Date(ci.completedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="card-warn" style={{ marginBottom: 20 }}>
                        <span style={{ fontSize: 13, color: 'var(--amber)' }}>Final check-in not yet submitted. </span>
                        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }} onClick={onCheckIn}>Submit Final Review</button>
                      </div>
                    )}
                    <div className="card" style={{ marginBottom: 20 }}>
                      <div className="eyebrow" style={{ marginBottom: 8 }}>Overall Verdict</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className={`pill ${vd.cls}`}>{vd.label}</span>
                        <span style={{ fontSize: 13, color: 'var(--text2)' }}>{checkIns.length} of 5 check-ins completed</span>
                      </div>
                    </div>
                    {checkIns.length > 0 && (
                      <button className="btn btn-primary" onClick={onViewSAD}>
                        <Icon name="FileText" size={14} /> View Full Evaluation Report
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Section: Resources */}
          {activeSection === 'resources' && (
            <div className="out-section">
              <div className="eyebrow">Resources</div>
              <div className="section-title"><Icon name="BookOpen" size={18} /> Getting Help</div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Your GoTo Team</div>
                <p className="body-text">Your Solutions Consultant is your primary resource. Reach out with questions about the product, proof-of-concept progress, or commercial terms.</p>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="Mail" size={14} color="var(--brand)" />
                  <a href={`mailto:${SC_EMAIL}`} style={{ color: 'var(--brand)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>{SC_EMAIL}</a>
                </div>
              </div>
            </div>
          )}

          {/* Save panel */}
          <div className="save-panel no-print" style={{ marginTop: 44 }}>
            <div className="save-panel-title">Save your progress</div>
            <div className="save-panel-sub">Enter your email to save this guide and retrieve it next time.</div>
            <div className="save-row">
              <input className="field-input" type="email" placeholder="your@email.com" value={saveEmail} onChange={e => setSaveEmail(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
              <button className="btn btn-primary" onClick={handleSave}><Icon name="Save" size={14} /> Save</button>
            </div>
            {saveFeedback && (
              <div className={`save-feedback ${saveFeedback.startsWith('err') ? 'err' : ''}`}>
                {saveFeedback.startsWith('err:') ? saveFeedback.slice(4) : <><Icon name="Check" size={13} /> {saveFeedback.slice(3)}</>}
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="no-print" style={{ marginTop: 24, textAlign: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={onReset}>Start a new evaluation</button>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── INTAKE FLOW ────────────────────────────────────────────────────────── */
function IntakeFlow({ onComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const qIndexRef = useRef(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [recallEmail, setRecallEmail] = useState('');
  const [recallMsg, setRecallMsg] = useState('');

  useEffect(() => { qIndexRef.current = qIndex; }, [qIndex]);

  const q = QUESTIONS[qIndex];

  function advance(ans) {
    const captured = qIndexRef.current;
    const nextAnswers = { ...answers, [q.id]: ans };
    setAnswers(nextAnswers);
    setSelected(null);
    setSelectedMulti([]);
    if (captured >= QUESTIONS.length - 1) {
      setTimeout(() => onComplete(nextAnswers), 320);
    } else {
      setTimeout(() => setQIndex(captured + 1), 320);
    }
  }

  function handleSingleSelect(id) {
    setSelected(id);
    setTimeout(() => advance(id), 260);
  }

  function handleMultiToggle(id) {
    setSelectedMulti(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  }

  function handleRecall() {
    if (!recallEmail.trim()) { setRecallMsg('Enter your email above.'); return; }
    const rec = loadRecord(recallEmail);
    if (!rec) { setRecallMsg('No saved record found for that email.'); return; }
    onComplete(rec.answers, rec);
  }

  return (
    <div className="full-center">
      <div className="inner fade-up">
        <div className="brand-mark">GoTo Resolve</div>
        <div className="progress-dots">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`pdot ${i < qIndex ? 'done' : i === qIndex ? 'active' : ''}`} />
          ))}
        </div>
        <div className="q-eyebrow">{q.label || `Question ${qIndex + 1} of ${QUESTIONS.length}`}</div>
        <div className="q-text">{q.text}</div>
        {q.sub && <div className="q-sub">{q.sub}</div>}

        {!q.multi && q.options.map(opt => (
          <div key={opt.id} className={`opt-card ${selected === opt.id ? 'selected' : ''}`}
            onClick={() => handleSingleSelect(opt.id)}>
            <div className="opt-radio">{selected === opt.id && <Icon name="Check" size={11} color="#fff" strokeWidth={3} />}</div>
            <span className="opt-label">{opt.label}</span>
          </div>
        ))}

        {q.multi && (
          <>
            {q.options.map(opt => (
              <div key={opt.id} className={`opt-card ${selectedMulti.includes(opt.id) ? 'selected' : ''}`}
                onClick={() => handleMultiToggle(opt.id)}>
                <div className="opt-check">{selectedMulti.includes(opt.id) && <Icon name="Check" size={11} color="#fff" strokeWidth={3} />}</div>
                <span className="opt-label">{opt.label}</span>
              </div>
            ))}
            <button className="btn btn-primary" style={{ marginTop: 16 }}
              disabled={selectedMulti.length === 0}
              onClick={() => advance(selectedMulti)}>
              Continue <Icon name="ChevronRight" size={15} />
            </button>
          </>
        )}

        {qIndex === 0 && (
          <div className="recall-panel">
            <div className="recall-panel-title">Returning? Recall your previous guide.</div>
            <div className="recall-row">
              <input className="field-input" type="email" placeholder="your@email.com"
                value={recallEmail} onChange={e => { setRecallEmail(e.target.value); setRecallMsg(''); }} />
              <button className="btn btn-ghost btn-sm" onClick={handleRecall}>Load</button>
            </div>
            {recallMsg && <div className={`recall-msg ${recallMsg.startsWith('No saved') ? '' : 'ok'}`}>{recallMsg}</div>}
          </div>
        )}

        {qIndex > 0 && (
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 20 }}
            onClick={() => { setQIndex(i => i - 1); setSelected(null); setSelectedMulti([]); }}>
            <Icon name="ChevronRight" size={13} style={{ transform: 'rotate(180deg)' }} /> Back
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── LOADING SCREEN ─────────────────────────────────────────────────────── */
function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="full-center">
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="brand-mark">GoTo Resolve</div>
        <div className="loading-label">Building your evaluation guide…</div>
        <div className="loading-sub">Personalizing to your environment</div>
        <div className="loading-track"><div className="loading-fill" /></div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────────────────── */
function ResolveTrialGuide() {
  const [phase, setPhase] = useState('intake');   // intake|loading|output|checkin|checkin_loading|sad
  const [record, setRecord] = useState(null);
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  }

  function handleIntakeComplete(answers, existingRecord) {
    if (existingRecord) {
      setRecord(existingRecord);
      setPhase('output');
    } else {
      setRecord(newRecord(answers));
      setPhase('loading');
    }
  }

  function handleLoadingDone() {
    setPhase('output');
  }

  function handleCheckIn() {
    setPhase('checkin');
  }

  function handleCheckInSave(checkIn) {
    setRecord(prev => {
      const updated = upsertCheckIn({ ...prev, checkIns: [...(prev.checkIns || [])] }, checkIn);
      // Persist if we have a saved email (best-effort)
      try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(STORE));
        if (keys.length > 0) {
          // Update the most recently saved key
          const latest = keys.reduce((a, b) => {
            try {
              const ra = JSON.parse(localStorage.getItem(a));
              const rb = JSON.parse(localStorage.getItem(b));
              return (rb?.savedAt || 0) > (ra?.savedAt || 0) ? b : a;
            } catch { return a; }
          });
          const savedRec = JSON.parse(localStorage.getItem(latest));
          if (savedRec && JSON.stringify(savedRec.answers) === JSON.stringify(updated.answers)) {
            localStorage.setItem(latest, JSON.stringify({ ...updated, savedAt: Date.now() }));
          }
        }
      } catch (_) {}
      return updated;
    });
    showToast('Check-in saved!');
    setPhase('sad');
  }

  function handleCheckInCancel() {
    setPhase(record?.checkIns?.length > 0 ? 'sad' : 'output');
  }

  function handleViewSAD() {
    setPhase('sad');
  }

  function handleBackFromSAD() {
    setPhase('output');
  }

  function handleReset() {
    setRecord(null);
    setPhase('intake');
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      {phase === 'intake' && (
        <IntakeFlow onComplete={handleIntakeComplete} />
      )}
      {phase === 'loading' && (
        <LoadingScreen onDone={handleLoadingDone} />
      )}
      {phase === 'output' && record && (
        <OutputView
          record={record}
          onCheckIn={handleCheckIn}
          onViewSAD={handleViewSAD}
          onReset={handleReset}
        />
      )}
      {phase === 'checkin' && record && (
        <CheckInFlow
          record={record}
          onSave={handleCheckInSave}
          onCancel={handleCheckInCancel}
        />
      )}
      {phase === 'sad' && record && (
        <SADView
          record={record}
          onBack={handleBackFromSAD}
          onCheckIn={handleCheckIn}
        />
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ResolveTrialGuide />);

import{r as n,j as s}from"./index-348175dc.js";import{A as w,R as y,a as N,H as C,b as E}from"./AdminSidebar-8ba375f8.js";import{B as T,D as F}from"./Charts-23ddd718.js";import{T as L}from"./TableHOC-a8223c72.js";import"./iconBase-014c01d4.js";const R="/assets/userpic-996d8bbc.png",I=[{Header:"User",accessor:"user"},{Header:"Time",accessor:"createdAt"},{Header:"Input",accessor:"input"},{Header:"Ouput",accessor:"output"},{Header:"Status",accessor:"status_code"}],S=({data:a=[]})=>L(I,a,"transaction-box","Recent Calls")(),$=()=>{const[a,o]=n.useState(null),[t,r]=n.useState([]),[i,p]=n.useState([]),[d,g]=n.useState([]);return n.useEffect(()=>{(async()=>{try{const c=await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard/top-metrics"),h=await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard/latest5"),u=await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard/env"),x=await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard/gpt-models");if(!x.ok)throw new Error("Failed to fetch GPT models data");if(!c.ok||!h.ok||!u.ok)throw new Error("Failed to fetch data");const j=await c.json(),m=await h.json(),b=await u.json(),f=await x.json();o(j),g(f),p(b),r(m)}catch(c){console.error("Error fetching data:",c)}})()},[]),s.jsxs("div",{className:"admin-container",children:[s.jsx(w,{}),s.jsxs("main",{className:"dashboard",children:[s.jsxs("div",{className:"bar",children:[s.jsx("img",{src:R,alt:"User"}),s.jsx("div",{children:"NOTE : Refresh the page to update the graphs and charts"})]}),s.jsxs("section",{className:"widget-container",children:[s.jsx(l,{percent:parseFloat((((a==null?void 0:a.totalEntries)-98)/98).toFixed(2))*100,amount:!0,value:(a==null?void 0:a.totalEntries)??0,heading:"Total Revenue",color:"rgb(0,115,255)"}),s.jsx(l,{percent:parseFloat((((a==null?void 0:a.totalUniqueUsers)-4)/4).toFixed(2))*100,value:(a==null?void 0:a.totalUniqueUsers)??0,heading:"Users",color:"rgb(0 198 202)"}),s.jsx(l,{percent:parseFloat((((a==null?void 0:a.averageCallsInLast30Days)-2)/2).toFixed(2))*100,value:(a==null?void 0:a.averageCallsInLast30Days)??0,heading:"Calls(30d)",color:"rgb(255 196 0)"}),s.jsx(l,{percent:parseFloat((((a==null?void 0:a.averageMetricsLatency)-2e3)/2e3).toFixed(2))*100,value:(a==null?void 0:a.averageMetricsLatency)??0,heading:"Avg Latency (msec)",color:"rgb(76 0 255)"})]}),s.jsxs("section",{className:"graph-container",children:[s.jsxs("section",{children:[s.jsx(T,{data_1:d.map(e=>e.total_requests),title_1:"API CALLS",bgColor_1:"hsl(240, 40%, 50%)",labels:d.map(e=>e.model),data_2:[],title_2:"",bgColor_2:""}),s.jsx("h2",{children:"AGGREGRATE GPT MODEL DISTRIBUTION"})]}),s.jsxs("div",{className:"dashboard-categories",children:[s.jsx("h2",{children:"Environment-Wise Distribution"}),s.jsx("div",{children:i.map(e=>s.jsx(v,{heading:e.env,value:e.percentage,color:`hsl(${e.percentage*4},${e.percentage}%,50%)`},e.env))})]})]}),s.jsxs("section",{className:"transaction-container",children:[s.jsxs("div",{className:"success-chart",children:[s.jsx("h2",{children:"API Success Ratio"}),s.jsx(F,{labels:["Success","Fails"],data:[(a==null?void 0:a.totalSuccess)??90,(a==null?void 0:a.totalFailures)??0],backgroundColor:["rgba(53,162,235,0.8)","hsl(0, 20%, 50%)"],cutout:90}),s.jsxs("p",{children:[s.jsx(y,{}),s.jsx(N,{})]})]}),s.jsx(S,{data:t})]})]})]})},l=({heading:a,value:o,percent:t,color:r,amount:i=!1})=>s.jsxs("article",{className:"widget",children:[s.jsxs("div",{className:"widget-info",children:[s.jsx("p",{children:a}),s.jsx("h4",{children:i?`$${o}`:o}),t>0?s.jsxs("span",{className:"green",children:[s.jsx(C,{})," +",t,"%"," "]}):s.jsxs("span",{className:"red",children:[s.jsx(E,{})," ",t,"%"," "]})]}),s.jsx("div",{className:"widget-circle",style:{background:`conic-gradient(
        ${r} ${Math.abs(t)/100*360}deg,
        rgb(255, 255, 255) 0
      )`},children:s.jsxs("span",{style:{color:r},children:[t,"%"]})})]}),v=({color:a,value:o,heading:t})=>s.jsxs("div",{className:"category-item",children:[s.jsx("h5",{children:t}),s.jsx("div",{children:s.jsx("div",{style:{backgroundColor:a,width:`${o}%`}})}),s.jsxs("span",{children:[o,"%"]})]});export{$ as default};

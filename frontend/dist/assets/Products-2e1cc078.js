import{r as a,j as r}from"./index-94dceae6.js";import{A as d}from"./AdminSidebar-b01626fa.js";import{T as i}from"./TableHOC-09ebbe70.js";import"./iconBase-5d1ce741.js";const u=[{Header:"ID",accessor:"id"},{Header:"User",accessor:"user"},{Header:"Status",accessor:"status_code"},{Header:"Environment",accessor:"env"},{Header:"CreatedAt",accessor:"createdAt"},{Header:"Model",accessor:"model"},{Header:"Temperature",accessor:"temperature"},{Header:"Max Tokens",accessor:"max_tokens"},{Header:"Top P",accessor:"top_p"},{Header:"Frequency Penalty",accessor:"frequency_penalty"},{Header:"PresencePenalty",accessor:"presence_penalty"},{Header:"Latency",accessor:"metricslatency"},{Header:"Input Tokens",accessor:"inputTokens"},{Header:"Output Tokens",accessor:"outputTokens"},{Header:"Engine",accessor:"engine"},{Header:"Number",accessor:"n"}],f=()=>{const[s,t]=a.useState([]);a.useEffect(()=>{o()},[]);const o=async()=>{try{const e=await fetch("https://truefoundry-0-0-0-release.onrender.com/dashboard",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});if(!e.ok)throw new Error("Failed to fetch data");const n=await e.json();t(n)}catch(e){console.error("Error fetching data:",e)}},c=a.useCallback(i(u,s,"dashboard-product-box","Console Logs",!0),[s]);return r.jsxs("div",{className:"admin-container",children:[r.jsx(d,{}),r.jsx("main",{children:r.jsx("div",{className:"table-container",children:c()})})]})};export{f as default};
import{r as s,j as e}from"./index-94dceae6.js";import{A as j}from"./AdminSidebar-b01626fa.js";import"./iconBase-5d1ce741.js";const v=()=>{const[l,c]=s.useState(""),[o,d]=s.useState(),[u,h]=s.useState(),[a,m]=s.useState(),x=t=>{var i;const n=(i=t.target.files)==null?void 0:i[0],r=new FileReader;n&&(r.readAsDataURL(n),r.onloadend=()=>{typeof r.result=="string"&&m(r.result)})};return e.jsxs("div",{className:"admin-container",children:[e.jsx(j,{}),e.jsx("main",{className:"product-management",children:e.jsx("article",{children:e.jsxs("form",{children:[e.jsx("h2",{children:"New Product"}),e.jsxs("div",{children:[e.jsx("label",{children:"Name"}),e.jsx("input",{required:!0,type:"text",placeholder:"Name",value:l,onChange:t=>c(t.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Price"}),e.jsx("input",{required:!0,type:"number",placeholder:"Price",value:o,onChange:t=>d(Number(t.target.value))})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Stock"}),e.jsx("input",{required:!0,type:"number",placeholder:"Stock",value:u,onChange:t=>h(Number(t.target.value))})]}),e.jsxs("div",{children:[e.jsx("label",{children:"Photo"}),e.jsx("input",{required:!0,type:"file",onChange:x})]}),a&&e.jsx("img",{src:a,alt:"New Image"}),e.jsx("button",{type:"submit",children:"Create"})]})})})]})};export{v as default};
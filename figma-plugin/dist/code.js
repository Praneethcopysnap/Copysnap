(()=>{"use strict";({383:function(){var e=this&&this.__awaiter||function(e,o,t,n){return new(t||(t=Promise))((function(i,s){function c(e){try{a(n.next(e))}catch(e){s(e)}}function r(e){try{a(n.throw(e))}catch(e){s(e)}}function a(e){var o;e.done?i(e.value):(o=e.value,o instanceof t?o:new t((function(e){e(o)}))).then(c,r)}a((n=n.apply(e,o||[])).next())}))};let o=null,t=!1;function n(e){const o={id:e.id,name:e.name,type:e.type,children:[]};if("characters"in e&&(o.text=e.characters),"children"in e)for(const t of e.children)o.children.push(n(t));return o}figma.showUI(__html__,{width:350,height:450}),console.log("Plugin started, UI shown"),figma.ui.onmessage=i=>e(void 0,void 0,void 0,(function*(){if(console.log("Message received from UI:",i),"login-success"===i.type)console.log("Login successful:",i.user),figma.notify(`Logged in as ${i.user.name}`,{timeout:2e3}),o=i.user,t=!0,figma.ui.resize(350,500),figma.ui.postMessage({type:"show-plugin-ui",user:o});else if("generate-copy"===i.type){if(console.log("Processing generate-copy command"),0===figma.currentPage.selection.length)return console.log("No selection found, sending error message"),figma.ui.postMessage({type:"error",message:"Please select a frame or component to generate copy for."}),void figma.notify("Please select a frame or component first",{timeout:2e3});const e=figma.currentPage.selection[0];console.log("Selected node:",e.name,e.type);try{const o=n(e);console.log("Extracted frame data:",o),figma.ui.postMessage({type:"selection-data",data:o}),console.log("Sent selection data to UI")}catch(e){console.error("Error extracting or sending data:",e),figma.notify("Error processing selection: "+e,{timeout:3e3})}}else"close"===i.type&&figma.closePlugin()}))}})[383]()})();
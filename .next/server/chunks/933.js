"use strict";exports.id=933,exports.ids=[933],exports.modules={7933:(e,r,s)=>{s.d(r,{p:()=>processFrame});var o=s(7441),t=s.n(o);async function processFrame(e,r,s){try{let o;if(console.log("Processing frame:",r,"x",s),"string"==typeof e){let r=e.replace(/^data:image\/\w+;base64,/,"");o=Buffer.from(r,"base64")}else if(Buffer.isBuffer(e))o=e;else throw Error("Invalid imageData format");let a=await t()(o).resize({width:640,height:360,fit:"inside"}).jpeg({quality:80}).toBuffer(),i=`data:image/jpeg;base64,${a.toString("base64")}`;console.log("Image compressed, new size:",i.length);let n=`Frame size ${r}x${s}`;return console.log("Generated frame description:",n),{frameDescription:n,encodedImage:i}}catch(e){throw console.error("Error in processFrame:",e),e}}}};
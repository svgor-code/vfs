var g=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var p=Object.prototype.hasOwnProperty;var w=(s,e)=>{for(var t in e)g(s,t,{get:e[t],enumerable:!0})},S=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of u(e))!p.call(s,i)&&i!==t&&g(s,i,{get:()=>e[i],enumerable:!(r=m(e,i))||r.enumerable});return s};var D=s=>S(g({},"__esModule",{value:!0}),s);var a=(s,e,t)=>new Promise((r,i)=>{var o=n=>{try{y(t.next(n))}catch(h){i(h)}},d=n=>{try{y(t.throw(n))}catch(h){i(h)}},y=n=>n.done?r(n.value):Promise.resolve(n.value).then(o,d);y((t=t.apply(s,e)).next())});var E={};w(E,{VFS:()=>f});module.exports=D(E);var l=class{constructor(e){this.fileStorage=e}setType(e){return a(this,null,function*(){let t=yield this.fileStorage.exist(e);return this.type=t?"file":"directory",this.type})}};var c=class{constructor(e,t=null,r){this.name=e,this.parent=t,this.fileStorage=r,t||(this.indexNode=new l(r),this.indexNode.type="directory",this.subdir=[])}getDentryPath(){var r,i;let e=this,t=e.name;for(;e.parent&&((r=e.parent)==null?void 0:r.name)!=="/";)t=`${(i=e.parent)==null?void 0:i.name}/${t}`,e=e.parent;return`/${t}`}linkIndexNode(){return a(this,null,function*(){let e=this.getDentryPath();this.indexNode=new l(this.fileStorage),(yield this.indexNode.setType(e))==="directory"&&(this.subdir=[],this.parent&&(this.parent.subdir=[...this.parent.subdir||[],this]))})}};var f=class{constructor(e){this.dentryTree=new c("/",null,e),this.fileStorage=e,this.dentryTreeCash={"/":this.dentryTree}}find(e){return a(this,null,function*(){let t=e.split("/").filter(Boolean),r=this.dentryTree;for(let i of t){let o=r.name==="/"?`/${i}`:`${r.name}/${i}`;if(!this.dentryTreeCash[o]){let d=new c(i,r,this.fileStorage);yield d.linkIndexNode(),this.dentryTreeCash[o]=d}r=this.dentryTreeCash[o]}return r})}open(e){return a(this,null,function*(){if((yield this.find(e)).indexNode.type==="file")return yield this.fileStorage.read(e);throw new Error(`Cannot open directory as file: ${e}`)})}create(e,t){return a(this,null,function*(){let r=yield this.find(e);return yield this.fileStorage.write(r.getDentryPath(),t)})}scanDir(e){return a(this,null,function*(){let t=yield this.find(e);if(t.indexNode.type!=="directory")throw new Error(`scanDir method is only applicable to directories: ${e}`);let r=yield this.fileStorage.list(e),i=[];for(let o of r)if(!this.dentryTreeCash[o]){let d=new c(o,t,this.fileStorage);yield d.linkIndexNode(),this.dentryTreeCash[o]=d,i.push(d)}return i})}move(e,t){return a(this,null,function*(){let r=yield this.find(e),i=yield this.find(t);if(r.parent){let n=this.dentryTreeCash[r.parent.name];n&&n.subdir&&(n.subdir=n.subdir.filter(h=>h.name!==r.name))}r.parent=i,i.subdir=[...i.subdir||[],r];let o=`${i.getDentryPath().replace("//","/")}/${r.name}`.replace("//","/");delete this.dentryTreeCash[r.name],r.name=o,this.dentryTreeCash[o]=r;let d=yield this.fileStorage.read(e);if(yield this.fileStorage.write(r.name,d)){if(!(yield this.fileStorage.remove(e)))throw new Error("Error removing old record after successful save: ${name}")}else throw new Error(`Error creating new record, old record not removed: ${e}`);return!0})}remove(e){return a(this,null,function*(){let t=yield this.find(e);if(!(yield this.fileStorage.remove(t.getDentryPath())))throw new Error(`Error removing record from storage: ${e}`);return t.parent&&t.parent.subdir&&(t.parent.subdir=t.parent.subdir.filter(i=>i.name!==t.name)),delete this.dentryTreeCash[e],!0})}};0&&(module.exports={VFS});

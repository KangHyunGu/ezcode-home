(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05259c6f"],{"58d5":function(t,e,i){"use strict";var r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,a=e.attrs;return[i("span",t._g(t._b({},"span",a,!1),r),[t._v(" "+t._s(t.display)+" ")])]}}])},[t._v(" "+t._s(t.formatTime)+" ")])},a=[],s={name:"DisplayTime",props:{time:{type:String,required:!0}},computed:{formatTime:function(){return this.$moment(this.time).format("LLL")},display:function(){var t=this.$moment(this.time),e=this.$moment(),i=e.diff(t,"days");return i>0?t.format("LL"):t.fromNow()}}},o=s,n=i("2877"),l=Object(n["a"])(o,r,a,!1,null,null,null);e["a"]=l.exports},"7eee":function(t,e,i){"use strict";i.r(e);var r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-card",[i("v-card-title",[t._v(" "+t._s(t.subject)+" "),i("v-spacer"),i("v-btn",{attrs:{to:"/board/"+t.table}},[i("v-icon",[t._v("mdi-dots-horizontal")])],1)],1),i("v-divider"),i("v-container",{attrs:{fluid:""}},[i("v-row",t._l(t.items,(function(e,r){return i("v-col",{key:e.wr_id,staticClass:"mt-4 gal-item",attrs:{cols:"6",sm:"6",md:"4",lg:"2"}},[i("v-card",{staticStyle:{color:"white","background-color":"#444"}},[i("v-card-title",{staticClass:"px-0 mx-4 text-body-1"},[i("span",{staticStyle:{width:"100%","text-overflow":"ellipsis",overflow:"hidden","white-space":"nowrap"}},[t._v(" "+t._s(e.wr_title)+" ")])]),i("v-card-subtitle",{staticClass:"d-flex",staticStyle:{color:"white"}},[i("div",{staticStyle:{color:"white"}},[i("v-icon",{attrs:{color:"white",small:""}},[t._v("mdi-eye")]),t._v(t._s(e.wr_view)+" "),i("v-icon",{staticClass:"ml-2",attrs:{color:"white",small:""}},[t._v("mdi-comment-outline")]),t._v(t._s(e.wr_reply)+" ")],1),i("v-spacer"),i("display-time",{attrs:{time:e.wr_createat}})],1),i("a",{staticClass:"text-decoration-none",on:{click:function(i){return t.$router.push("/board/"+t.table+"/"+e.wr_id)}}},[i("v-img",{attrs:{src:t.getImage(t.table,e,t.imgSize),"aspect-ratio":1}})],1)],1)],1)})),1)],1)],1)},a=[],s=i("64f2"),o=i("58d5"),n={components:{DisplayTime:o["a"]},name:"Latest",props:{table:{type:String,required:!0},subject:{type:String,required:!0},items:{type:Array,required:!0},loading:{type:Boolean,default:!1}},data:function(){return{imgSize:{w:300,h:300}}},computed:{getImage:function(){return s["getImage"]}}},l=n,c=i("2877"),m=Object(c["a"])(l,r,a,!1,null,null,null);e["default"]=m.exports}}]);
//# sourceMappingURL=chunk-05259c6f.790ae8ca.js.map
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-605f9026"],{"0f68":function(t,e,i){},"45fc":function(t,e,i){"use strict";var s=i("23e7"),c=i("b727").some,o=i("a640"),n=i("ae40"),a=o("some"),r=n("some");s({target:"Array",proto:!0,forced:!a||!r},{some:function(t){return c(this,t,arguments.length>1?arguments[1]:void 0)}})},"493f":function(t,e,i){"use strict";i("d3b7"),i("25f0");var s=function t(e){if(Array.isArray(e)||"[object Object]"===Object.prototype.toString.call(e)){var i=Array.isArray(e)?[]:{};for(var s in e)Array.isArray(e[s])||"[object Object]"===Object.prototype.toString.call(e[s])?i[s]=t(e[s]):i[s]=e[s];return i}return e};e["a"]=s},"88b0":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"history",attrs:{id:"goods_history"}},[i("back-header",{attrs:{title:"我的足迹"}},[i("span",{staticClass:"management",on:{click:t.toggleEdit}},[t._v("管理")])]),i("scroll",{ref:"scroll",class:{edit:t.edit},attrs:{clickable:"","is-finished":t.finished},on:{scrollToEnd:t.loadMore}},[t._l(t.list,(function(e,s){return i("div",{key:e.id,staticClass:"goods",on:{click:function(i){return t.goGoods(s,e.goods.id)}}},[i("div",{staticClass:"check-wrap",on:{click:function(t){t.stopPropagation()}}},[t.edit?i("van-checkbox",{staticClass:"check",attrs:{"icon-size":"0.36rem","checked-color":"#E1234D"},on:{change:t.computedAll},model:{value:e.checked,callback:function(i){t.$set(e,"checked",i)},expression:"item.checked"}}):t._e()],1),i("div",{staticClass:"img",style:{backgroundImage:"url("+e.cover+")"}}),i("div",{staticClass:"info"},[i("p",{staticClass:"van-multi-ellipsis--l3"},[t._v(t._s(e.goods.title))]),i("div",{staticClass:"price"},[i("p",[t._v("¥"+t._s(e.goods.price))]),i("span",[t._v(t._s(e.visits_time))])])])])})),t._e()],2),t.edit?i("div",{staticClass:"footer"},[i("div",{staticClass:"all",on:{click:function(e){t.checkedAll=!t.checkedAll}}},[i("van-checkbox",{attrs:{"icon-size":"0.36rem","checked-color":"#E1234D"},on:{change:t.toggleAll},model:{value:t.checkedAll,callback:function(e){t.checkedAll=e},expression:"checkedAll"}}),i("span",[t._v("全选")])],1),i("div",{staticClass:"del",on:{click:t.delHistory}},[t._v("删除")])]):t._e()],1)},c=[],o=(i("99af"),i("4160"),i("a15b"),i("d81d"),i("45fc"),i("a434"),i("ac1f"),i("1276"),i("159b"),i("5530")),n=i("a750"),a=i("ef39"),r=i("493f"),l=i("60b3"),h=10,d={name:"history",components:{BackHeader:n["a"],Scroll:a["a"]},data:function(){return{list:[],edit:!1,checkedAll:!1,itemChange:!1,parentChange:!1,finished:!0,page:1}},mounted:function(){this.getList()},methods:{loadMore:function(){this.loading||(this.page++,this.loading=!0,this.getList(!1))},toggleEdit:function(){var t=this;this.edit=!this.edit,this.$nextTick((function(){setTimeout((function(){t.$refs.scroll.refresh()}),20)}))},computedAll:function(){var t=this;this.parentChange||(this.itemChange=!0,this.checkedAll=!this.list.some((function(t){return!t.checked})),this.$nextTick((function(){t.itemChange=!1})))},toggleAll:function(){var t=this;if(!this.itemChange){this.parentChange=!0;var e=Object(r["a"])(this.list);e.forEach((function(e){e.checked=t.checkedAll})),this.list=e,this.$nextTick((function(){t.parentChange=!1}))}},getList:function(){var t=this,e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],i=null;1===this.page&&e&&(i=this.$skeLoading("#goods_history")),Object(l["b"])("/shop/user/getUserVisits",{page:this.page,size:h}).then((function(e){var s=e.data.data;t.finished=s.length<h,s.forEach((function(t){t.cover=t.goods.thumb_urls.split(",")[0],t.checked=!1})),t.list=1===t.page?s:t.list.concat(s),t.loading=!1,t.$nextTick((function(){t.$refs.scroll.refresh()})),i&&i.close()})).catch((function(){i&&i.close()}))},goGoods:function(t,e){this.edit?this.$set(this.list,t,Object(o["a"])(Object(o["a"])({},this.list[t]),{},{checked:!this.list[t].checked})):this.$router.push("/goods/".concat(e))},delHistory:function(){var t=this,e=this.$toast.loading(),i=[];this.list.map((function(t){t.checked&&i.push(t.id)})),i.length?Object(l["b"])("/shop/user/delUserVisits",{visitsids:i.join(",")}).then((function(){for(var i=0;i<t.list.length;i++)t.list[i].checked&&(t.list.splice(i,1),i--);e.close()})).catch((function(){setTimeout((function(){e.close()}),1e3)})):this.$toast.fail("请选择商品")}}},f=d,u=(i("ed87"),i("2877")),g=Object(u["a"])(f,s,c,!1,null,"1e2f3660",null);e["default"]=g.exports},a15b:function(t,e,i){"use strict";var s=i("23e7"),c=i("44ad"),o=i("fc6a"),n=i("a640"),a=[].join,r=c!=Object,l=n("join",",");s({target:"Array",proto:!0,forced:r||!l},{join:function(t){return a.call(o(this),void 0===t?",":t)}})},a434:function(t,e,i){"use strict";var s=i("23e7"),c=i("23cb"),o=i("a691"),n=i("50c4"),a=i("7b0b"),r=i("65f0"),l=i("8418"),h=i("1dde"),d=i("ae40"),f=h("splice"),u=d("splice",{ACCESSORS:!0,0:0,1:2}),g=Math.max,p=Math.min,v=9007199254740991,k="Maximum allowed length exceeded";s({target:"Array",proto:!0,forced:!f||!u},{splice:function(t,e){var i,s,h,d,f,u,m=a(this),b=n(m.length),A=c(t,b),C=arguments.length;if(0===C?i=s=0:1===C?(i=0,s=b-A):(i=C-2,s=p(g(o(e),0),b-A)),b+i-s>v)throw TypeError(k);for(h=r(m,s),d=0;d<s;d++)f=A+d,f in m&&l(h,d,m[f]);if(h.length=s,i<s){for(d=A;d<b-s;d++)f=d+s,u=d+i,f in m?m[u]=m[f]:delete m[u];for(d=b;d>b-s+i;d--)delete m[d-1]}else if(i>s)for(d=b-s;d>A;d--)f=d+s-1,u=d+i-1,f in m?m[u]=m[f]:delete m[u];for(d=0;d<i;d++)m[d+A]=arguments[d+2];return m.length=b-s+i,h}})},d81d:function(t,e,i){"use strict";var s=i("23e7"),c=i("b727").map,o=i("1dde"),n=i("ae40"),a=o("map"),r=n("map");s({target:"Array",proto:!0,forced:!a||!r},{map:function(t){return c(this,t,arguments.length>1?arguments[1]:void 0)}})},ed87:function(t,e,i){"use strict";var s=i("0f68"),c=i.n(s);c.a}}]);
//# sourceMappingURL=chunk-605f9026.4c592b89.js.map
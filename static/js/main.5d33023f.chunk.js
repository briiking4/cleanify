(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],[,,,,,,,,,,,,,,function(e,t,a){e.exports=a.p+"static/media/profPic.cc02a310.png"},function(e,t,a){e.exports=a.p+"static/media/logo.69e3c264.png"},,function(e,t,a){e.exports=a(29)},,,,,function(e,t,a){},function(e,t,a){},,function(e,t,a){},function(e,t,a){},,,function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(13),l=a.n(r),i=(a(22),a(4)),c=a(5),o=a(1),d=a(8),m=a(7),u=a(14),p=a.n(u),h=a(15),f=a.n(h),y=(a(23),a(2)),b=a.n(y),g=a(10),v=a(9),k=(a(25),a(6)),w=a.n(k),E=new w.a,N=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={userId:n.props.user,playlistName:n.props.name,playlistId:n.props.data,ownerId:"",buttonPressed:!1,loadingData:!1,newPlaylistId:"",revealUnable:!1,addTrack:!1},n.explicitTracks=[],n.cleanTracks=[],n.noCleanVersions=[],n.recTracks=[],n.timesClicked=1,n.openPlaylist="",n.makeCleanPlaylist=n.makeCleanPlaylist.bind(Object(o.a)(n)),n.findCleanTrack=n.findCleanTrack.bind(Object(o.a)(n)),n.getRecommended=n.getRecommended.bind(Object(o.a)(n)),n.unableToAdd=n.unableToAdd.bind(Object(o.a)(n)),n.addTrack=n.addTrack.bind(Object(o.a)(n)),n}return Object(c.a)(a,[{key:"getTracksData",value:function(e,t){var a=[],n=[];E.getPlaylistTracks(e,t).then((function(e){e.items.map((function(e){!0===e.track.explicit?a.push(e.track):n.push(e.track)}))})),this.explicitTracks=a,this.cleanTracks=n}},{key:"componentDidMount",value:function(){var e=this.props.data,t=this.props.id;this.getTracksData(t,e),window.scrollTo(0,0)}},{key:"findCleanTrack",value:function(){var e=Object(v.a)(b.a.mark((function e(t){var a,n,s,r,l,i,c,o;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.name,n=t.artists[0].name,l=0,e.next=5,E.search('track:"'+a+'" artist:"'+n+'"',["track"]);case 5:i=e.sent,c=Object(g.a)(i.tracks.items);try{for(c.s();!(o=c.n()).done;)!1===(r=o.value).explicit&&(r.name===a||r.name.includes("Clean"))&&r.artists[0].name===n&&l<=0&&(s=r,l++)}catch(d){c.e(d)}finally{c.f()}return 0===l&&(s=null),e.abrupt("return",s);case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"makeCleanPlaylist",value:function(){var e=Object(v.a)(b.a.mark((function e(){var t,a,n,s,r,l,i,c,o,d;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.setState({loadingData:!0}),a=Object(g.a)(this.explicitTracks),e.prev=2,a.s();case 4:if((n=a.n()).done){e.next=12;break}return t=n.value,e.next=8,this.findCleanTrack(t);case 8:null===(s=e.sent)?this.noCleanVersions.push(t):this.cleanTracks.push(s);case 10:e.next=4;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(2),a.e(e.t0);case 17:return e.prev=17,a.f(),e.finish(17);case 20:if(!(this.noCleanVersions.length>0)){e.next=24;break}return e.next=23,this.getRecommended(this.noCleanVersions);case 23:this.recTracks=e.sent;case 24:r=[],l="",c=Object(g.a)(this.cleanTracks);try{for(c.s();!(o=c.n()).done;)i=o.value,r.push(i.uri)}catch(m){c.e(m)}finally{c.f()}return e.next=30,E.createPlaylist(this.state.userId,{name:this.state.playlistName+"(Clean)"});case 30:return d=e.sent,this.openPlaylist=d.external_urls.spotify,l=d.id,e.next=35,E.addTracksToPlaylist(this.state.userId,l,r);case 35:e.sent,this.setState({newPlaylistId:l,buttonPressed:!0});case 37:case"end":return e.stop()}}),e,this,[[2,14,17,20]])})));return function(){return e.apply(this,arguments)}}()},{key:"getRecommended",value:function(){var e=Object(v.a)(b.a.mark((function e(t){var a,n,s,r,l,i,c,o;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=[],n=t.slice(),s=[],t.length>5&&n.splice(5,t.length),n.map((function(e){a.push(e.id)})),e.next=7,E.getRecommendations({limit:20,seed_tracks:a});case 7:r=e.sent,i=Object(g.a)(r.tracks),e.prev=9,i.s();case 11:if((c=i.n()).done){e.next=23;break}if(!0!==(l=c.value).explicit){e.next=20;break}return e.next=16,this.findCleanTrack(l);case 16:null!==(o=e.sent)&&s.push(o),e.next=21;break;case 20:s.push(l);case 21:e.next=11;break;case 23:e.next=28;break;case 25:e.prev=25,e.t0=e.catch(9),i.e(e.t0);case 28:return e.prev=28,i.f(),e.finish(28);case 31:return s.length>10&&(s=s.slice(0,10)),e.abrupt("return",s);case 33:case"end":return e.stop()}}),e,this,[[9,25,28,31]])})));return function(t){return e.apply(this,arguments)}}()},{key:"unableToAdd",value:function(){this.timesClicked++,this.timesClicked%2===0?this.setState({revealUnable:!0}):this.setState({revealUnable:!1})}},{key:"addTrack",value:function(){var e=Object(v.a)(b.a.mark((function e(t){var a,n;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.uri,this.setState({addTrack:!0}),e.next=4,E.addTracksToPlaylist(this.state.userId,this.state.newPlaylistId,[a]);case 4:e.sent,(n=document.getElementById(t.id)).style.backgroundColor="green",n.value=n.name;case 8:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.noCleanVersions.map((function(e,t){return t++,s.a.createElement("p",{key:e.id}," ",t,". ",e.name)})),t=this.recTracks.map((function(e){var t=this;return s.a.createElement("div",{key:e.id},s.a.createElement("div",{className:"row my-2"},s.a.createElement("div",{className:"col-3 col-lg-1 mt-3"},s.a.createElement("input",{type:"button",className:"btn btn-add",id:e.id,value:"ADD",name:"DONE",onClick:function(){return t.addTrack(e)}})),s.a.createElement("div",{className:"col-9 col-lg-11"},s.a.createElement("iframe",{src:"https://open.spotify.com/embed/track/"+e.id,width:"90%",height:"80",frameBorder:"0",allowtransparency:"true",allow:"encrypted-media",title:"embeded-track"}))))}),this);return s.a.createElement("div",{className:"Clean col-12"},this.state.buttonPressed?s.a.createElement("div",{className:"mx-auto"},s.a.createElement("h3",{className:"font-weight-bold text-success"}," Your Playlist Is Cleanified! "),s.a.createElement("p",null," You're done! We have already saved it to your library!"),s.a.createElement("a",{href:this.openPlaylist,target:"_blank",rel:"noopener noreferrer",className:"btn btn-success"}," Open In Spotify "),s.a.createElement("div",{className:"container"},s.a.createElement("div",{className:"row"},s.a.createElement("div",{className:"col"},s.a.createElement("iframe",{src:"https://open.spotify.com/embed/playlist/"+this.state.playlistId,width:"100%",height:"290",frameBorder:"0",allowtransparency:"true",allow:"encrypted-media",title:"embeded-playlist"})),s.a.createElement("i",{className:"fas fa-arrow-right text-success fa-2x"}),s.a.createElement("div",{className:"col"},s.a.createElement("iframe",{src:"https://open.spotify.com/embed/playlist/"+this.state.newPlaylistId,width:"100%",height:"290",frameBorder:"0",allowtransparency:"true",allow:"encrypted-media",title:"embeded-playlist"})))),s.a.createElement("hr",{className:"divider mb-3"}),s.a.createElement("div",null,s.a.createElement("button",{type:"button",className:"btn btn-danger",onClick:this.unableToAdd}," Reveal Songs Unable to be Cleaned: ",this.noCleanVersions.length),this.state.revealUnable&&this.noCleanVersions.length>0?e:this.state.revealUnable&&s.a.createElement("p",null,"Good News! We were able to find clean versions of each song!"),this.noCleanVersions.length>0&&s.a.createElement("div",null,s.a.createElement("hr",{className:"divider mt-5"}),s.a.createElement("h2",null,"Recommended Clean Songs"),s.a.createElement("p",null,"Based on the songs we were unable to add: "),s.a.createElement("div",{className:"container"},t)))):s.a.createElement("div",null,s.a.createElement("button",{type:"button",className:"btn btn-lg btn-success mt-5",onClick:this.makeCleanPlaylist,disabled:this.state.loadingData},this.state.loadingData&&s.a.createElement("i",{className:"fa fa-compact-disc fa-spin text-white"}),"Clean Playlist"),s.a.createElement("div",null,s.a.createElement("iframe",{src:"https://open.spotify.com/embed/playlist/"+this.state.playlistId,width:"80%",height:"400",frameBorder:"0",allowtransparency:"true",allow:"encrypted-media",title:"embeded-playlist"})),s.a.createElement("p",{className:"text-muted"}," Note: Spotify's explicit content tags are applied based on information Spotify receives from rights-holders. They can\u2019t guarantee all explicit content is marked as such. Cleanify will clean your playlist based off of Spotify's marked explicit/clean songs.")))}}]),a}(s.a.Component),x=(a(26),new w.a),C=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).playlistIsSelected=function(e){var t=e.target.getAttribute("id"),a=e.target.getAttribute("owner"),s=e.target.getAttribute("name");n.setState({playlistSelected:!0,currentSelected:t,ownerId:a,playlistName:s})},n.state={ownerId:"",playlistList:[],playlistSelected:!1,currentSelected:"",playlistName:""},n}return Object(c.a)(a,[{key:"getPlaylistData",value:function(){var e=this,t=[];x.getUserPlaylists({limit:50}).then((function(a,n){a.items.map((function(e){return 0===e.images.length&&e.images.push({url:"https://i.ya-webdesign.com/images/notes-grey-icons-png-2.png"}),t.push({ownerId:e.owner.id,id:e.id,name:e.name,image:e.images[0].url}),t})),e.setState({playlistList:t})}))}},{key:"componentDidMount",value:function(){this.getPlaylistData()}},{key:"backButton",value:function(){this.setState({playlistSelected:!1})}},{key:"render",value:function(){var e=this.props.user,t=this.state.currentSelected,a=this.state.ownerId,n=this.playlistIsSelected,r=this.state.playlistList.map((function(e){return s.a.createElement("div",{key:e.id,className:"col-sm-6 col-md-4 col-lg-3 col-12 card"},s.a.createElement("img",{src:e.image,id:e.id,name:e.name,owner:e.ownerId,onClick:n,className:"card-img card-img-top",alt:"card"}),s.a.createElement("div",{className:"card-body"},s.a.createElement("p",{className:"card-text font-weight-bold"},e.name)))}));return s.a.createElement("div",{className:"Playlist"},this.state.playlistSelected?s.a.createElement("div",null,s.a.createElement("div",{className:"row"},s.a.createElement("button",{type:"button",className:"btn btn-success float-left mt-n1",onClick:this.backButton.bind(this)},s.a.createElement("i",{class:"fa fa-arrow-circle-left","aria-hidden":"true"})," Clean Another")),s.a.createElement("div",{className:"row"},s.a.createElement(N,{name:this.state.playlistName,id:a,data:t,user:e}))):s.a.createElement("div",{className:"user-playlists overflow-hidden"},s.a.createElement("h3",{className:"font-weight-bold header"},"Playlists"),s.a.createElement("h3",{className:"h5 text-weight-bold text-success sub-header "}," Select a Playlist to Clean"),s.a.createElement("p",{className:" text-muted sub-sub-header"}," Don't worry! We will not alter your original playlist."),s.a.createElement("p",{className:" text-muted sub-sub-header"}," Can't find it? Make sure you either own or follow the playlist. If so, open Spotify and move it to the top of your list!"),s.a.createElement("hr",{className:"divider mb-5"}),s.a.createElement("div",{className:"row"},r)))}}]),a}(s.a.Component),I=a(11),P=new w.a,T=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(){var e;Object(i.a)(this,a);var n=(e=t.call(this)).getHashParams(),s=n.access_token;return s&&P.setAccessToken(s),I.a.initialize("UA-172518785-1"),I.a.pageview(window.location.pathname),e.state={userId:"",loggedIn:!!n.access_token,profPic:"",name:""},e.login=e.login.bind(Object(o.a)(e)),e}return Object(c.a)(a,[{key:"getHashParams",value:function(){for(var e,t={},a=/([^&;=]+)=?([^&;]*)/g,n=window.location.hash.substring(1);e=a.exec(n);)t[e[1]]=decodeURIComponent(e[2]);return t}},{key:"getUserProfile",value:function(){var e=this;P.getMe().then((function(t){console.log(t),0===t.images.length?e.setState({userId:t.id,profPic:p.a,name:t.display_name}):e.setState({userId:t.id,profPic:t.images[0].url,name:t.display_name})}))}},{key:"componentDidMount",value:function(){this.state.loggedIn&&this.getUserProfile()}},{key:"generateRandomString",value:function(e){for(var t="",a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=0;n<e;n++)t+=a.charAt(Math.floor(Math.random()*a.length));return t}},{key:"login",value:function(){var e=this.generateRandomString(16);localStorage.setItem("spotify_auth_state",e);var t="https://accounts.spotify.com/authorize";t+="?response_type=token",t+="&client_id="+encodeURIComponent("69862027b9b54d9eb6f6dd2ae3ed3050"),t+="&scope="+encodeURIComponent("user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private"),t+="&redirect_uri="+encodeURIComponent("https://briiking4.github.io/cleanify/"),t+="&state="+encodeURIComponent(e),window.location=t}},{key:"render",value:function(){var e=this.state.userId;return s.a.createElement("div",{className:"App"},this.state.loggedIn?s.a.createElement("div",null,s.a.createElement("div",{className:"row profile"},s.a.createElement("div",{className:"col-4 col-sm-4 col-lg-2 col-md-3"},s.a.createElement("img",{src:this.state.profPic,className:"profPic rounded-circle img-fluid",alt:"profile pic"})),s.a.createElement("div",{className:"col-8 col-sm-8 col-lg-10 col-md-9 text-left ml-n3"},s.a.createElement("h1",{className:"profName"},this.state.name))),s.a.createElement(C,{user:e})):s.a.createElement("div",{id:"login",className:"pt-5"},s.a.createElement("img",{src:f.a,class:"logo text-center",alt:"logo"}),s.a.createElement("h1",null,"Cleanify"),s.a.createElement("a",{id:"login-button",href:"http://localhost:8888",class:"btn btn-success btn-lg"},"Log in with Spotify")))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(T,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[17,1,2]]]);
//# sourceMappingURL=main.5d33023f.chunk.js.map
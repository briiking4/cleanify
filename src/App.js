import React, {Component} from 'react';
import profPic from './profPic.png';
import logo from './logo.png'
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';

import './App.css';
import Playlists from './components/Playlists'
import SpotifyWebApi from 'spotify-web-api-js';
import ReactGA from 'react-ga';


const spotifyApi = new SpotifyWebApi();


class App extends Component {

constructor (){
  super();
  const params = this.getHashParams();
  const token = params.access_token;

  if (token) {
     spotifyApi.setAccessToken(token);
  }

    ReactGA.initialize('UA-172518785-1');
    ReactGA.pageview(window.location.pathname);

  this.state ={
    userId: '',
    loggedIn: params.access_token ? true : false,
    profPic: '',
    name: ''
  }

  this.login = this.login.bind(this)
  this.logout = this.logout.bind(this)
}


 getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }


  getUserProfile(){
    spotifyApi.getMe()
      .then((response) => {
        if ((response.images.length === 0)){
          this.setState ({
            userId: response.id,
            profPic: profPic,
            name: response.display_name
          })
        }else{
          this.setState ({
            userId: response.id,
            profPic: response.images[1].url,
            name: response.display_name
          })
        }
      })
  }

  componentDidMount(){

    if(this.state.loggedIn){
      this.getUserProfile()
    }
  }


 generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  login() {
    var stateKey = 'spotify_auth_state';

    var client_id = '69862027b9b54d9eb6f6dd2ae3ed3050'; 
    var redirect_uri = 'https://briiking4.github.io/cleanify/'; 

    var state = this.generateRandomString(16);

    localStorage.setItem(stateKey, state);
    var scope = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private';

    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location = url;
  };

  logout(){
    this.setState({
      loggedIn:false
    })
    window.location.href = ""
  }



  render(){
    const userId = this.state.userId


    return (

      <div className="App">

        {
          this.state.loggedIn ?
           <div>
              <div className="row profile">
                <div className="col-4 col-sm-4 col-lg-1 col-md-3">
                  <img src= {this.state.profPic} className="profPic rounded-circle img-fluid" alt="profile pic"/>
                </div>
                <div className="col-8 col-sm-8 col-lg-11 col-md-9 text-left ml-n3">
                  <button type="button" className="btn btn-danger btn-sm mx-0 logout float-right" onClick={this.logout}>Log Out</button>
                  <h1 className="profName" >{this.state.name}</h1>
                </div>
              </div>
              <Playlists user= {userId}></Playlists>
            </div>
          :
          <div id="login" className="pt-5">
          <Fade top>
          <div>
              <img src={logo} class="logo img-fluid text-center" alt="logo"/>
              <h1 className="logo-title font-weight-bold">Cleanify</h1>
          </div>
          </Fade>
          <Zoom delay={1000}>
            <div>
            <button id="login-button" onClick= {this.login} class="btn btn-success">Log in with Spotify</button>
            </div>
          </Zoom>
          </div>

        }

      </div>
    );
  }
}

export default App;

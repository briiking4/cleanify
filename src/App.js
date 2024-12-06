import React, { Component } from 'react';
import profPic from './profPic.png';
import logo from './logo.png';
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';

import './App.css';
import Playlists from './components/Playlists';
import SpotifyWebApi from 'spotify-web-api-js';
import ReactGA from 'react-ga';


const spotifyApi = new SpotifyWebApi();


class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    console.log(process.env.REACT_APP_SPOTIFY_CLIENT_ID)

    // Set token if it exists in the URL
    if (token) {
      spotifyApi.setAccessToken(token);
      localStorage.setItem('access_token', token); // Store the access token
    }

    ReactGA.initialize('UA-172518785-1');
    ReactGA.pageview(window.location.pathname);

    this.state = {
      userId: '',
      loggedIn: token ? true : false,
      profPic: '',
      name: '',
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  // Function to get user profile from Spotify
  getUserProfile() {
    spotifyApi.getMe().then((response) => {
      if (response.images.length === 0) {
        this.setState({
          userId: response.id,
          profPic: profPic,
          name: response.display_name,
        });
      } else {
        this.setState({
          userId: response.id,
          profPic: response.images[0].url,
          name: response.display_name,
        });
      }
    });
  }

 // Function to get refresh token
getRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const url = 'https://accounts.spotify.com/api/token';

  // Log to check the stored refresh token
  console.log('Refresh Token:', refreshToken);

  // Prepare the payload
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    }),
  };

  try {
    // Send the request
    const body = await fetch(url, payload);
    const response = await body.json();

    // Log the response to debug
    console.log('Refresh Token Response:', response);

    // Check if the response contains the access token
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token); // Store the new access token
      spotifyApi.setAccessToken(response.access_token); // Set the new access token for API
    }

    // Check if there is a new refresh token and store it
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token); // Store the new refresh token
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};


  // Handle component mounting
  async componentDidMount() {
    if (this.state.loggedIn) {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const tokenExpiration = localStorage.getItem('token_expiration');
        if (!tokenExpiration || Date.now() > tokenExpiration) {
          // If token has expired, refresh it
          await this.getRefreshToken();
        }
        this.getUserProfile();
      } else {
        // If no access token, try to refresh
        await this.getRefreshToken();
        this.getUserProfile();
      }
    }
  }

  // Generate random state string for Spotify login
  generateRandomString(length) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  login() {
    const stateKey = 'spotify_auth_state';
    const redirect_uri = 'http://localhost:3000/'; // redirect URI

    const state = this.generateRandomString(16);

    localStorage.setItem(stateKey, state);
    const scope =
      'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private';
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(process.env.REACT_APP_SPOTIFY_CLIENT_ID);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location = url;
  }

  logout() {
    this.setState({
      loggedIn: false,
    });
    window.location.href = '';
  }

  render() {
    const userId = this.state.userId;

    return (
      <div className="App">
        {this.state.loggedIn ? (
          <div>
            <div className="row profile">
              <div className="col-4 col-sm-4 col-lg-1 col-md-3">
                <img
                  src={this.state.profPic}
                  className="profPic rounded-circle img-fluid"
                  alt="profile pic"
                />
              </div>
              <div className="col-8 col-sm-8 col-lg-11 col-md-9 text-left ml-n3">
                <button
                  type="button"
                  className="btn btn-danger btn-sm mx-0 logout float-right"
                  onClick={this.logout}
                >
                  Log Out
                </button>
                <h1 className="profName">{this.state.name}</h1>
              </div>
            </div>
            <Playlists user={userId}></Playlists>
          </div>
        ) : (
          <div id="login" className="pt-5">
            <Fade top>
              <div>
                <img
                  src={logo}
                  className="logo img-fluid text-center"
                  alt="logo"
                />
                <h1 className="logo-title font-weight-bold">Cleanify</h1>
              </div>
            </Fade>
            <Zoom delay={1000}>
              <div>
                <button
                  id="login-button"
                  onClick={this.login}
                  className="btn btn-success"
                >
                  Log in with Spotify
                </button>
              </div>
            </Zoom>
          </div>
        )}
      </div>
    );
  }
}

export default App;

import React from 'react';
import CleanPlaylist from './CleanPlaylist'
import './Playlists.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class Playlists extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      ownerId: '',
      playlistList: [],
      playlistSelected: false,
      currentSelected: '',
      playlistName: '',
      noPlaylists: false
    };
  }

  getPlaylistData(){
    var playlistItems= [];

      spotifyApi.getUserPlaylists({limit:50})
         .then((response, onRejected) => {
           if (response.items.length === 0){
             this.setState({
               noPlaylists: true
             })
           }
           response.items.map((item) => {
             if (item.images.length === 0){
               item.images.push({url: "https://i.ya-webdesign.com/images/notes-grey-icons-png-2.png"})
             }
             playlistItems.push({ownerId: item.owner.id, id: item.id, name:item.name, image: item.images[0].url})
             return playlistItems
           })
          this.setState({
            playlistList: playlistItems
          })
       });

   }

   componentDidMount(){
     this.getPlaylistData()
   }

   playlistIsSelected = (event) => {

     var currentPlaylistId = event.target.getAttribute("id")
     var playlistOwnerId = event.target.getAttribute("owner")
     var playlistName = event.target.getAttribute("name")
     this.setState({
       playlistSelected: true,
       currentSelected: currentPlaylistId,
       ownerId: playlistOwnerId,
       playlistName: playlistName
     });
   }

   backButton(){
     this.setState({
       playlistSelected:false
     })
   }

  render(){
    const userId = this.props.user
    const playlistId = this.state.currentSelected
    const ownerId = this.state.ownerId

    const selected = this.playlistIsSelected

    const showPlaylist =
      this.state.playlistList.map(function(playlist){
        return (
          <div key={playlist.id} className="col-sm-6 col-md-4 col-lg-3 col-12 card">
             <img src={playlist.image} id= {playlist.id} name= {playlist.name} owner = {playlist.ownerId} onClick={selected} className="card-img card-img-top" alt="card"/>
             <div className="card-body">
               <p className="card-text font-weight-bold">{playlist.name}</p>
             </div>
          </div>
           )
      });



    return (
      <div className="Playlist">

      {
        this.state.playlistSelected ?
        <div>
          <div className="row">
          <div className="col">
            <button type="button" className="btn btn-success float-left mt-n1" onClick={this.backButton.bind(this)}><i className ="fa fa-arrow-circle-left" aria-hidden="true"></i> Clean Another</button>
          </div>
          </div>
          <div className="row">
            <CleanPlaylist name= {this.state.playlistName} id= {ownerId} data= {playlistId} user= {userId}></CleanPlaylist>
          </div>
        </div>
        : <div className="user-playlists overflow-hidden">
            <h3 className="font-weight-bold header">Playlists</h3>
            <h3 className="h5 text-weight-bold text-success sub-header "> Select a Playlist to Clean</h3>
            <p className=" text-muted sub-sub-header"> Don't worry! We will not alter your original playlist.</p>
            <p className=" text-muted sub-sub-header"> Can't find it? Make sure you either own or follow the playlist. If so, open Spotify and move it to the top of your list!</p>
            <hr className="divider mb-5"/>
              <div className="row">
              {this.state.noPlaylists ?
                <div class="text-center col-12">
                  <h3>Oh no! You do not have any existing playlists to clean.</h3>
                  <h4> Open Spotify to create a new playlist and revisit Cleanify.</h4>
                  <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" class="btn btn-success">Open Spotify</a>
                </div>
                :
                showPlaylist
              }
              </div>
          </div>
      }
      </div>

    );
  }
}


export default Playlists

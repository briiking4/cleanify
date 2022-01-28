import React from 'react';
import './CleanPlaylist.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class CleanPlaylist extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userId: this.props.user,
      playlistName: this.props.name,
      playlistId: this.props.data,
      ownerId: '',
      buttonPressed: false,
      loadingData: false,
      newPlaylistId: '',
      revealUnable: false,
    };

    this.explicitTracks = [];
    this.cleanTracks = [];
    this.noCleanVersions = [];
    this.recTracks = [];
    this.timesClicked = 1;
    this.unaddCounter = 1;
    this.openPlaylist = "";
    this.makeCleanPlaylist = this.makeCleanPlaylist.bind(this)
    this.findCleanTrack = this.findCleanTrack.bind(this)
    this.getRecommended = this.getRecommended.bind(this)
    this.unableToAdd = this.unableToAdd.bind(this)
    this.addTrack = this.addTrack.bind(this)




  }


  getTracksData(owner, id){
    var explicitTracksList = []
    var cleanTracksList = []
    spotifyApi.getPlaylistTracks(owner, id)
      .then((response) => {
        response.items.map((item) =>{
          if(item.track.explicit === true){
            explicitTracksList.push(item.track)
          }else{
            cleanTracksList.push(item.track)
          }
        })
      })
      this.explicitTracks = explicitTracksList
      this.cleanTracks = cleanTracksList


    }

    componentDidMount(){
      var playlistId = this.props.data
      var ownerId = this.props.id
      this.getTracksData(ownerId, playlistId)
      window.scrollTo(0, 0)
    }

    async findCleanTrack(track){
      var name = track.name
      var artist = track.artists[0].name
      var cleanTrack;
      var itemC;
      var counter = 0;
        let searchResult = await spotifyApi.search('track: ' +name+ ' artist: '+ '"'+ artist + '"' ,['track'])
        for (itemC of searchResult.tracks.items){
          if (itemC.explicit === false){
            if((itemC.name === name || itemC.name.includes("Clean")) && (itemC.artists[0].name === artist && counter <= 0) ){
              cleanTrack = itemC
              counter ++
            }
          }
        }
        if (counter === 0 ){
          cleanTrack = null
        }

        return cleanTrack
    }

    async makeCleanPlaylist(){

      this.setState({
        loadingData: true
      })

      var findCleanTrackPromises = [];
      var itemE;
      for (itemE of this.explicitTracks) {
        findCleanTrackPromises.push(this.findCleanTrack(itemE));
      }

      var cleanTrackResults = await Promise.all(findCleanTrackPromises);
      for (var cleanTrack of cleanTrackResults) {
        if (cleanTrack === null){
          this.noCleanVersions.push(itemE);
        }else{
          this.cleanTracks.push(cleanTrack);
        }
      }

      if (this.noCleanVersions.length > 0){
        this.recTracks = await this.getRecommended(this.noCleanVersions)
      }

       var trackUri = [];
       var newId = '';
       var x;
       for (x of this.cleanTracks){
         trackUri.push(x.uri)
       }
        let playlistResult = await spotifyApi.createPlaylist(this.state.userId, {name: this.state.playlistName + "(Clean)"})
        this.openPlaylist = playlistResult.external_urls.spotify
        newId = playlistResult.id

        let addResult = await spotifyApi.addTracksToPlaylist(this.state.userId, newId, trackUri)

        this.setState({
          newPlaylistId: newId,
          buttonPressed: true
        })

    }

    async getRecommended(tracks){
      var trackId = [];
      var tracksList = tracks.slice();
      var recTracks =[];

      if (tracks.length > 5){
        tracksList.splice(5,tracks.length)
      }

      tracksList.map((item) => {
        trackId.push(item.id)
      })

      let recommededResult = await spotifyApi.getRecommendations({limit: 20, seed_tracks: trackId})
      var itemR;

      var cleanTrackPromises = [];
      for (itemR of recommededResult.tracks) {
        if (itemR.explicit === true){
          cleanTrackPromises.push(this.findCleanTrack(itemR));
        }else{
          cleanTrackPromises.push(Promise.resolve(itemR));
        }
      }

      var cleanTrackResults = await Promise.all(cleanTrackPromises);
      for (var cleanTrack of cleanTrackResults) {
        if (cleanTrack !== null){
          recTracks.push(cleanTrack);
        }
      }

      if (recTracks.length > 10){
        recTracks = recTracks.slice(0,10)
      }

      return recTracks
    }

   unableToAdd(){
     this.timesClicked ++
     if (this.timesClicked % 2 === 0){
       this.setState({
         revealUnable: true
       })
     }else{
       this.setState({
         revealUnable: false
       })
     }
    }

     async addTrack(track){
       // this.unaddCounter ++
       var elem = document.getElementById(track.id);
       var counter = parseInt(elem.getAttribute("clicks"))
       var uri = track.uri
       counter ++
       if (counter % 2 === 0){
         let addResult = await spotifyApi.addTracksToPlaylist(this.state.userId, this.state.newPlaylistId, [uri])
         elem.style.backgroundColor = "green";
         elem.innerHTML = "DONE";
       }else{
         let addResult = await spotifyApi.removeTracksFromPlaylist(this.state.userId, this.state.newPlaylistId, [uri])
         elem.style.backgroundColor = "#565656";
         elem.innerHTML = "ADD";

       }
       elem.setAttribute("clicks", counter);
    }


  render(){

    const unavalible =
    this.noCleanVersions.map(function(item, index) {
      index++
      return (
        <p key={item.id}> {index}. {item.name}</p>
      )
    });


    const recommendedTracks =
    this.recTracks.map(function(item) {
      return (
        <div key= {item.id}>
        <div className="row my-2">
          <div className="col-3 col-lg-1 mt-3">
            <button type="button" className="btn btn-add" id={item.id} clicks = "1" onClick={() => this.addTrack(item)}>ADD</button>
          </div>
          <div className="col-9 col-lg-11">
            <iframe src= {"https://open.spotify.com/embed/track/" + item.id } width="90%" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="embeded-track"></iframe>
          </div>
        </div>
        </div>
      )
    }, this);







    return(
      <div className= "Clean col-12">

      {
        this.state.buttonPressed ?
        <div className= "mx-auto">
          <h3 className="font-weight-bold text-success"> Your Playlist Is Cleanified! </h3>
          <p> You're done! We have already saved it to your library!</p>
            <a href= {this.openPlaylist} target="_blank" rel="noopener noreferrer" className="btn btn-success"> Open In Spotify </a>
        <div className="container">
          <div className="row">
            <div id="fadeshow" className="col">
              <iframe src= {"https://open.spotify.com/embed/playlist/" + this.state.playlistId} width="100%" height="290" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="embeded-playlist"></iframe>
            </div>
            <i id="fadeshow" className="fas fa-arrow-right text-success fa-2x"></i>
            <div className="col">
              <iframe src= {"https://open.spotify.com/embed/playlist/" + this.state.newPlaylistId} width="100%" height="290" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="embeded-playlist"></iframe>
            </div>
          </div>
        </div>
          <hr className="divider mb-3"/>

          <div>
            <button type="button" className="btn btn-danger" onClick={this.unableToAdd}> Reveal Songs Unable to be Cleaned: {this.noCleanVersions.length}</button>
            {
              this.state.revealUnable && this.noCleanVersions.length > 0 ?
                unavalible
              :
              this.state.revealUnable &&
               <p>Good News! We were able to find clean versions of each song!</p>
            }
            {
              this.noCleanVersions.length > 0 &&
              <div>
              <hr className="divider mt-5"/>
              <h2>Recommended Clean Songs</h2>
              <p>Based on the songs we were unable to add: </p>
              <div className="container">

                {recommendedTracks}
              </div>
              </div>
            }


          </div>

        </div>
        :
          <div>
            <button type="button" className="btn btn-lg btn-success mt-5" onClick= {this.makeCleanPlaylist} disabled={this.state.loadingData}>
            { this.state.loadingData &&
              <i className="fa fa-compact-disc fa-spin text-white"></i>
            }
            Clean Playlist
            </button>

            <div>
              <iframe src= {"https://open.spotify.com/embed/playlist/" + this.state.playlistId} width="80%" height="400" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="embeded-playlist"></iframe>
            </div>
            <p className="text-muted"> Note: Spotify's explicit content tags are applied based on information Spotify receives from rights-holders. They can’t guarantee all explicit content is marked as such. Cleanify will clean your playlist based off of Spotify's marked explicit/clean songs.</p>

          </div>
      }

      </div>
    )
  }
}

export default CleanPlaylist

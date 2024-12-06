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

    this.cleanTrackCache = JSON.parse(localStorage.getItem('cleanTrackCache')) || {};




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

    async makeCleanPlaylist() {
      console.log("CACHE STATE")
      console.log(this.cleanTrackCache);

      this.setState({ loadingData: true });
      
      const cleanTrackPromises = this.explicitTracks.map(track => this.findCleanTrack(track));
      console.log(cleanTrackPromises)
    
      const cleanTracks = await Promise.all(cleanTrackPromises);
    
      cleanTracks.forEach((cleanTrack, index) => {
        if (cleanTrack) {
          this.cleanTracks.push(cleanTrack); // Add clean track if found
        } else {
          this.noCleanVersions.push(this.explicitTracks[index]); // Track not found, add to noCleanVersions
        }
      });
    
      if (this.noCleanVersions.length > 0) {
        this.recTracks = await this.getRecommended(this.noCleanVersions);
      }
    
      const trackUris = this.cleanTracks.map(track => track.uri);
    
      const playlistResult = await spotifyApi.createPlaylist(this.state.userId, {
        name: `${this.state.playlistName} (Clean)`
      });
    
      this.openPlaylist = playlistResult.external_urls.spotify;
      const newId = playlistResult.id;
    
      await spotifyApi.addTracksToPlaylist(this.state.userId, newId, trackUris);
    
      this.setState({
        newPlaylistId: newId,
        buttonPressed: true,
        loadingData: false
      });
    }
    
    async findCleanTrack(track, isRecommended = false) {

      if (!track || !track.name || !track.artists || track.artists.length === 0) {
        console.warn("Invalid track data:", track);
        return null;
      }
    
      const name = track.name.toLowerCase();
      const artist = track.artists[0].name.toLowerCase();
      const cacheKey = `${name}-${artist}`;
      console.log("Generated cache key: ", cacheKey); 
      console.log(this.cleanTrackCache[cacheKey]);


      if (this.cleanTrackCache[cacheKey]) {
        console.log("Cache hit for: ", cacheKey);
        return this.cleanTrackCache[cacheKey];
      }

    
      try {
        const searchResult = await spotifyApi.search(`track:${name} artist:${artist}`, ['track']);
        const cleanTrack = searchResult.tracks.items.find(item => {
          const itemName = item.name.toLowerCase();

          const itemArtists = item.artists.map(a => a.name.toLowerCase());
          const isClean = !item.explicit;
          const isSameArtist = itemArtists.includes(artist);
          
          const isTitleClean = itemName.includes("clean") || itemName.includes("radio");
    
          return isClean && isSameArtist && (itemName === name || isTitleClean);
        });    

        if (cleanTrack && !isRecommended) {
          console.log("Found clean track, adding to cache:", cleanTrack);
          this.cleanTrackCache[cacheKey] = cleanTrack;
          localStorage.setItem('cleanTrackCache', JSON.stringify(this.cleanTrackCache));
        }
    
  
        return cleanTrack || null;
      } catch (error) {
        console.error("Error finding clean track:", error);
        return null;
      }
    }
    
    
    async getRecommended(tracks) {
      const trackId = [];
      const tracksList = tracks.slice();
      const recTracks = [];
    
      // Limit the number of tracks to 5, if more than 5 tracks are provided
      if (tracks.length > 5) {
        tracksList.splice(5, tracks.length);
      }
    
      // Collect track IDs
      tracksList.forEach(item => trackId.push(item.id));
    
      // Get recommendations from Spotify
      const recommendedResult = await spotifyApi.getRecommendations({
        limit: 10, 
        seed_tracks: trackId
      });
    
      // Process each recommended track
      for (const itemR of recommendedResult.tracks) {
        if (itemR.explicit === true) {
          const cleanTrack = await this.findCleanTrack(itemR,  true);
          if (cleanTrack !== null) {
            recTracks.push(cleanTrack);
          }
        } else {
          recTracks.push(itemR);
        }
    
        if (recTracks.length >= 7) {
          break;
        }
      }
          return recTracks;
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
          <p> You're done! Your cleaned playlist is already saved to your library.</p>
            <a href= {this.openPlaylist} target="_blank" rel="noopener noreferrer" className="btn btn-success"> Open In Spotify </a>
        <div className="container">
          <div className="row">
            <div id="fadeshow" className="col">
              <iframe src= {"https://open.spotify.com/embed/playlist/" + this.state.playlistId} width="100%" height="100%" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="embeded-playlist"></iframe>
            </div>
            <i id="fadeshow" className="fas fa-arrow-right text-success fa-2x"></i>
            <div className="col">
              <iframe src= {"https://open.spotify.com/embed/playlist/" + this.state.newPlaylistId} width="100%" height="100%" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="embeded-playlist"></iframe>
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
              <hr className="divider"/>
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
            <button type="button" className="btn btn-lg btn-success mt-3" onClick= {this.makeCleanPlaylist} disabled={this.state.loadingData}>
            { this.state.loadingData &&
              <i className="fa fa-compact-disc fa-spin text-white"></i>
            }
            Clean Playlist
            </button>

            <div>
              <iframe src= {"https://open.spotify.com/embed/playlist/" + this.state.playlistId} width="60%" height="400" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="embeded-playlist"></iframe>
            </div>
            <p className="text-muted"> Note: Spotify's explicit content tags are applied based on information Spotify receives from rights-holders. They can’t guarantee all explicit content is marked as such. Cleanify will clean your playlist based off of Spotify's marked explicit/clean songs.</p>

          </div>
      }

      </div>
    )
  }
}

export default CleanPlaylist

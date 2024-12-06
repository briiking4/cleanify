import React from 'react';
import CleanPlaylist from './CleanPlaylist';
import './Playlists.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class Playlists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ownerId: '',
      playlistList: [],
      filteredPlaylists: [],
      playlistSelected: false,
      currentSelected: '',
      playlistName: '',
      noPlaylists: false,
      searchQuery: '' // Add search query state
    };
  }

  async getPlaylistData() {
    let playlistItems = [];
    const limit = 50;
  
    try {
      const initialResponse = await spotifyApi.getUserPlaylists({ limit, offset: 0 });
  
      if (!initialResponse || !initialResponse.items) {
        this.setState({ noPlaylists: true });
        return;
      }
  
      const totalPlaylists = initialResponse.total;
      const totalRequests = Math.ceil(totalPlaylists / limit);
  
      const requests = Array.from({ length: totalRequests }, (_, i) =>
        spotifyApi.getUserPlaylists({ limit, offset: i * limit })
      );
  
      const responses = await Promise.all(requests);
  
      responses.forEach(response => {
        response.items.forEach(item => {
          if (!item.images || item.images.length === 0) {
            item.images = [{ url: "https://static.vecteezy.com/system/resources/previews/011/934/413/original/silver-music-note-icon-free-png.png" }];
          }
  
          // Add to playlistItems if it doesn't already exist
          if (!playlistItems.some(existing => existing.id === item.id)) {
            playlistItems.push({
              ownerId: item.owner.id,
              id: item.id,
              name: item.name,
              image: item.images[0].url
            });
          }
        });
      });
  
      this.setState({
        playlistList: playlistItems,
        filteredPlaylists: playlistItems,
        noPlaylists: playlistItems.length === 0
      });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      this.setState({ noPlaylists: true });
    }
  }
  
  
  

  componentDidMount() {
    this.getPlaylistData();
  }

  playlistIsSelected = (event) => {
    const currentPlaylistId = event.target.getAttribute("id");
    const playlistOwnerId = event.target.getAttribute("owner");
    const playlistName = event.target.getAttribute("name");
    this.setState({
      playlistSelected: true,
      currentSelected: currentPlaylistId,
      ownerId: playlistOwnerId,
      playlistName: playlistName
    });
  }

  backButton() {
    this.setState({ playlistSelected: false });
  }

  handleSearchChange = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const filteredPlaylists = this.state.playlistList.filter(playlist =>
      playlist.name.toLowerCase().includes(searchQuery)
    );
    this.setState({ searchQuery, filteredPlaylists });
  }

  render() {
    const { user } = this.props;
    const { playlistSelected, filteredPlaylists, noPlaylists, searchQuery } = this.state;

    const showPlaylist = filteredPlaylists.map((playlist) => (
      <div key={playlist.id} className="col-sm-6 col-md-4 col-lg-3 col-12 card">
        <img
          src={playlist.image}
          id={playlist.id}
          name={playlist.name}
          owner={playlist.ownerId}
          onClick={this.playlistIsSelected}
          className="card-img card-img-top"
          alt="playlist cover"
        />
        <div className="card-body">
          <p className="card-text font-weight-bold">{playlist.name}</p>
        </div>
      </div>
    ));

    return (
      <div className="Playlist">
        {playlistSelected ? (
          <div>
            <div className="row">
              <div className="col">
                <button
                  type="button"
                  className="btn btn-success float-left mt-n1"
                  onClick={this.backButton.bind(this)}
                >
                  <i className="fa fa-arrow-circle-left" aria-hidden="true"></i> Clean Another
                </button>
              </div>
            </div>
            <div className="row">
              <CleanPlaylist
                name={this.state.playlistName}
                id={this.state.ownerId}
                data={this.state.currentSelected}
                user={user}
              />
            </div>
          </div>
        ) : (
          <div className="user-playlists overflow-hidden">
            <h3 className="font-weight-bold header">Playlists</h3>
            <h3 className="h5 text-weight-bold text-success sub-header">Select a Playlist to Clean</h3>
            <p className="text-muted sub-sub-header">Don't worry! We will not alter your original playlist.</p>
            <p className="text-muted sub-sub-header">Can't find it? Make sure you either own or follow the playlist</p>
            <hr className="divider mb-5" />
            <input
              type="text"
              className="form-control search-input mb-5"
              placeholder="Search your playlists..."
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
            <div className="row">
              {noPlaylists ? (
                <div className="text-center col-12">
                  <h3>Oh no! You do not have any existing playlists to clean.</h3>
                  <h4>Open Spotify to create a new playlist and revisit Cleanify.</h4>
                  <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" className="btn btn-success">Open Spotify</a>
                </div>
              ) : (
                showPlaylist
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Playlists;

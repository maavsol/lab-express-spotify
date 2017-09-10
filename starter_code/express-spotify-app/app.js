const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.use(express.static(__dirname + '/public'))

app.set(expressLayouts)
app.set('layout', __dirname + '/views/layouts/main-layout')
//absolute path pointing to views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Remember to paste here your credentials
const clientId = '51b6cfa62a8e4dbaac541961c9157547',
    clientSecret = '819ff83240744053adad19955560100b';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.get("/", (req, res, next) => {
  res.render('search-form');
})

app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.artist)
  .then(function(data) {
    console.log(data.body.artists.items[0])
    res.render('artist-info', {
      artist: data.body.artists.items[0]
    })
  }, function(err) {
    console.error(err);
  })
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    console.log('Artist albums', data.body.items)
    res.render('albums', {
      albums: data.body.items,
      totalAlbums: data.body.total
    })
  }, function(err) {
    console.error(err)
  })
})

app.get('/tracks/:albumId', (req, res) => {
  spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    console.log(data.body.items);
    res.render('tracks', {
      tracks: data.body.items,
    })
  }, function(err) {
    console.log('Something went wrong!', err);
  });

})

let port = 3000
app.listen(port, () => {console.log(`Port ${port}`);})

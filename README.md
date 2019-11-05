# Guitar
### Easily find what notes are in key for your guitar and discover new scales using the fretboard! Adjust your capo position and how many strings and frets your guitar has. Saves to the cloud for easy setup from any browser.

_Note: Project is in Early/Mid Development_

![Guitar Overview GIF](https://starbound.digital/wp-content/uploads/2019/11/Kapture-2019-11-04-at-18.43.48-min.gif)

## Technologies
* React
  * Hooks
  * Reducers
  * Contexts
* Axios
* Auth0
* Golang
  * rs cors
  * gorilla mux
  * go-sql-driver mysql
* Google Cloud SQL

## Current Features
* View all frets in given key
* Easily find new scales
  * Shows full list of all scales that match selected notes
  * Filterable results to easily find whatever fits your mood
* Lots of Configurations
  * String count
  * Fret count
  * Tuning
  * Capo position
  * ...
* User Authentication & Authorization
  * save your current setup to the cloud, for easy access anywhere!
  * fully secured and safe account creation utilizing Auth0
* Local saving for guest accounts


## Upcoming Features
* More Styling
  * select scale inputs
  * modals
  * tuning presets
* Chords Finder
  * discover new chords based on 2 or more notes!
  * variable 'reach' (how many frets your fingers can spread)
  * variable root note (ie. Root note = 'A' will only show A-based chords with selected notes)
* Guitar Config Presets
  * easily switch between guitars with presets!
  * sets Default Capo Position, Tuning(s), and Fret and String counts
* Profile page to see view your given data (& share presets w/ friends in the near-future)
* Settings page for advanced settings & theme customization
* Shareable presets & tunings
* Songs!
  * Share chords, tunings, etc
  * Easily organize & create song ideas (built for quick 2-8 bar phrases, not a full songwriter like Guitar Pro and the sorts!)


## Required Files & vars for runtime not included in this pkg
* ui/.env
  * NODE_PATH=src/
  * REACT_APP_API_URL={api hosting url: ie http://localhost:8080}
* ui/src/auth_config.json
  * domain: {something.auth0.com},
  * clientId: {key given by auth0}
* api/.env
  * Server & Routing:
    *PORT=8080
    *GET_ALL_USERS={true or false - enables/disables access to the api's /users endpoint}
    *GET_ALL_USERS_SECRET={any text}
  * Google Cloud SQL
    *USERNAME={cloudSQL db username}
    *PASSWORD={cloudSQL db password}
    *INSTANCE={cloudSQL db instance}


<div align="center">
  <br /><br />
  <h1>Thanks for checking out the project!</h1>
</div>

import * as React from 'react';

// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';
import { siteBase } from "./data";

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/analytics';

import { Route, Switch } from 'react-router-dom';
import './App.css';

import Onboard from './components/Onboard';
import Homepage from './components/Homepage';
import Committee from './components/Committee';
import Join from "./components/Join"
import JoinPolle from "./components/Vote"
import JoinSelectCountry from "./components/Setuppersonal"
import Charter from "./components/Charter"
import {RenderBoard, RenderFormerBoard} from "./components/Board"
import Events from "./components/events/Events"
import Dataprotection from "./components/Dataprotection"
import { NotFound } from './components/NotFound';

const firebaseConfig = {
  apiKey: "AIzaSyBpArYbcA4qxIz2fryKH1ewPkRz35BKcrI",
  authDomain: "fgzmunsite.firebaseapp.com",
  projectId: "fgzmunsite",
  storageBucket: "fgzmunsite.appspot.com",
  messagingSenderId: "416994919783",
  appId: "1:416994919783:web:933b252afc6572b7b29bc2",
  measurementId: "G-FWCRFP15R5",
  databaseURL: "https://fgzmunsite-default-rtdb.europe-west1.firebasedatabase.app/"
};


firebase.initializeApp(firebaseConfig);
export const database = firebase.firestore();
firebase.analytics();

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route preload exact path={siteBase + "/"} component={Homepage} />
        <Route preload exact path={siteBase + "/RoP"} component={Charter} />
        <Route preload exact path={siteBase + "/team"} component={RenderBoard}/>
        <Route preload exact path={siteBase + "/team/former"} component={RenderFormerBoard}/>
        <Route preload exact path={siteBase + "/events"} component={Events}/>
        <Route preload exact path={siteBase + "/onboard"} component={Onboard} />
        <Route preload exact path={siteBase + "/committees"} component={Onboard} />
        <Route preload exact path={siteBase + "/Join"} component={Join} />
        <Route preload exact path={siteBase + "/StrawPoll"} component={JoinPolle}/>
        <Route preload exact path={siteBase + "/dataprotection"} component={Dataprotection}/>
        <Route preload path={siteBase + "/Join/:committeeID"} component={JoinSelectCountry} />
        <Route preload path={siteBase + "/committees/:committeeID"} component={Committee} />
        <Route preload path="*">
          <NotFound item="page" id="unknown" />
        </Route>
      </Switch>
    );
  }
}

export default App;

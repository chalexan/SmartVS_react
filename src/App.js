import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainScreen from './components/mainScreen/MainScreen';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch className='container'>
          <Route path=''>
            <MainScreen />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

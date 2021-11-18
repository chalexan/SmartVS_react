import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainScreen from './components/mainScreen/MainScreen';
import InputStream from './components/inputStream/InputStream';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch className='container'>
          <Route path='/inputData'>
            <InputStream />
          </Route>
          <Route path=''>
            <MainScreen />
          </Route>

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

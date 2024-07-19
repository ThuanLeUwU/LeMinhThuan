import logo from './logo.svg';
import './App.css';
import CurrencyConverter from './form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CurrencyConverter/>
        <ToastContainer />
      </header>
    </div>
  );
}

export default App;

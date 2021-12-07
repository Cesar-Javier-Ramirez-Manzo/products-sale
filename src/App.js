import './App.css';
// bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';
import cube from './assets/cubeSpin.gif'
import Products from './components/Products';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <img src={cube} id="cube" alt="loading..." />
        <h1>Inventario de productos</h1>
        
        <Products/>
      </header>
    </div>
  );
}

export default App;
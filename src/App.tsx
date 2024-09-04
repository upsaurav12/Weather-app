import Weather from "./component/weather"
import Nav from "./component/Nav"
function App() {

  return (
    <div className="main-container flex">
        <Nav/>
        <Weather/>
    </div>
  )
}

export default App

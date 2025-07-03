import { BrowserRouter as Router } from 'react-router-dom'
import Navigation from './components/Navigation'
import AppRouter from './router/AppRouter'

function App() {
    return (
        <Router>
            <div>
                <Navigation />
                <AppRouter />
            </div>
        </Router>
    )
}

export default App

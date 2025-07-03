import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'

function Navigation() {
    const location = useLocation()
    
    const routes = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ]
    
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px'
        }}>
            <nav style={{display: 'flex', gap: '24px'}}>
                {routes.map((route) => (
                    <Link
                        key={route.path}
                        to={route.path}
                        style={{
                            textDecoration: 'none',
                            color: location.pathname === route.path ? '#1d4ed8' : '#6b7280',
                            fontWeight: location.pathname === route.path ? 'bold' : 'normal'
                        }}
                    >
                        {route.name}
                    </Link>
                ))}
            </nav>
            
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#111827'}}>
                Aadhya
            </div>
        </div>
    )
}

function Home() {
    return (
        <div style={{marginTop: '60px', padding: '32px'}}>
            <h1>Home</h1>
        </div>
    )
}

function About() {
    return (
        <div style={{marginTop: '60px', padding: '32px'}}>
            <h1>About</h1>
        </div>
    )
}

function Contact() {
    return (
        <div style={{marginTop: '60px', padding: '32px'}}>
            <h1>Contact</h1>
        </div>
    )
}

function App() {
    return (
        <Router>
            <div>
                <Navigation />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App

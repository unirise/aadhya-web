import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Login from '../pages/Login'
import LanguageSwitcher from '../components/LanguageSwitcher'
import NotFound from '../pages/NotFound'

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/language" element={<LanguageSwitcher />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRouter

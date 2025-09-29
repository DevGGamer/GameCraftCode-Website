import {BrowserRouter, Routes, Route} from "react-router-dom"
import Header from '../../Components/Header/Header'
import MainPage from './MainPage/MainPage';

function Home()
{
    return (
        <>
          <Header/>
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </>
      );
}

export default Home;
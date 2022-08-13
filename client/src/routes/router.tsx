import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomePage from '@pages/HomePage/HomePage'
import RegisterPage from '@pages/RegisterPage/RegisterPage'
import withUser from './authHOC'
import NotFoundPage from '@pages/NotFoundPage'
import UploadPage from '@pages/UploadPage/UploadPage'
import SettingsPage from '@pages/SettingsPage/SettingsPage'
import TrackPage from '@pages/TrackPage/TrackPage'
import ProfilePage from '@pages/ProfilePage/ProfilePage'
import SearchPage from '@pages/SearchPage/SearchPage'
import PlaylistPage from '@pages/PlaylistPage/PlaylistPage'
import TrackDetailPage from '@pages/TrackDetailPage/TrackDetailPage'
import PlaylistDetailPage from '@pages/PlaylistDetailPage/playlistDetailPage'
import ProfileDetailPage from '@pages/ProfileDetailPage/ProfileDetailPage'
import TagPage from '@pages/TagPage/TagPage'
import HistoryPage from '@pages/HistoryPage/HistoryPage'
import TrendPage from '@pages/ChartPage/TrendPage'
import NewPage from '@pages/ChartPage/NewPage'
import TrendDetailPage from '@pages/ChartDetailPage/TrendDetailPage'
import NewDetailPage from '@pages/ChartDetailPage/NewDetailPage'

const userDetailPage = ['likes', 'following', 'followers', 'comments']

const Router = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home')
    }
  }, [navigate, location.pathname])

  return (
    <Routes>
      <Route path="*" element={withUser(NotFoundPage, null)} />
      <Route path="/" element={withUser(HomePage, null)} />
      <Route path="/home" element={withUser(HomePage, null)} />
      <Route path="/register" element={withUser(RegisterPage, false)} />
      <Route path="/upload" element={withUser(UploadPage, true)} />
      <Route path="/settings" element={withUser(SettingsPage, true)}></Route>
      {/* Track Page */}
      <Route
        path="/track/:userId/:permalink"
        element={withUser(TrackPage, null)}
      />
      <Route
        path="/track/:userId/:permalink/:detail"
        element={withUser(TrackDetailPage, null)}
      />
      <Route path="/track/notfound" element={withUser(NotFoundPage, null)} />

      {/* Profile Page */}
      <Route path="/profile/:userId" element={withUser(ProfilePage, null)}>
        <Route path=":nav" element={withUser(ProfilePage, null)} />
      </Route>
      {userDetailPage.map((nav, index) => (
        <Route
          key={index}
          path={`/profile/:userId/${nav}`}
          element={withUser(ProfileDetailPage, null)}
        />
      ))}

      {/* Playlsit Page */}
      <Route path="/playlist/notfound" element={withUser(NotFoundPage, null)} />
      <Route
        path="/playlist/:userId/:permalink"
        element={withUser(PlaylistPage, null)}
      />
      <Route
        path="/playlist/:userId/:permalink/:detail"
        element={withUser(PlaylistDetailPage, null)}
      />

      {/* Search Page */}
      <Route path="/search" element={withUser(SearchPage, null)}></Route>

      {/* Tag Page */}
      <Route path="/tags/:tag" element={withUser(TagPage, null)}>
        <Route path=":nav" element={withUser(TagPage, null)} />
      </Route>

      {/* History Page */}
      <Route path="/history" element={withUser(HistoryPage, true)} />

      {/* Trend Page */}
      <Route path="/trend" element={withUser(TrendPage, null)} />
      <Route path="/trend/:genre" element={withUser(TrendDetailPage, null)} />

      {/* New Release Page */}
      <Route path="/newrelease" element={withUser(NewPage, null)} />
      <Route
        path="/newrelease/:genre"
        element={withUser(NewDetailPage, null)}
      />
    </Routes>
  )
}

export default Router

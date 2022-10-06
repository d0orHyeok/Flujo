import { IMusic, IUser } from '@appTypes/types.type.'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { getUserMusics } from '@api/musicApi'
import * as CommonStyle from './common.style'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '@components/Common/Button'
import MusicCard from '@components/MusicCard/MusicCard'
import LoadingArea from '@components/Loading/LoadingArea'
import { useAppSelector } from '@redux/hook'

interface ProfileTracksProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
  editable?: boolean
}

const ProfileTracks = ({ user, editable, ...props }: ProfileTracksProps) => {
  const uid = useAppSelector((state) => state.user.userData?.id)

  const [musics, setMusics] = useState<IMusic[]>([])
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRelatedMusics = useCallback(async () => {
    const getNum = 15

    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * getNum
      const take = skip + getNum
      const response = await getUserMusics(user.id, {
        params: { skip, take, uid },
      })
      const getItems: IMusic[] = response.data
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setMusics((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, page, user.id, uid])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  const checkDeleted = useCallback(() => {
    if (user.id !== uid) {
      return
    }
    setMusics((prevState) =>
      prevState.filter(
        (m1) => user.musics.findIndex((m2) => m2.id === m1.id) !== -1
      )
    )
  }, [uid, user.id, user.musics])

  useEffect(() => {
    checkDeleted()
  }, [checkDeleted])

  useLayoutEffect(() => {
    getRelatedMusics()
  }, [getRelatedMusics])

  return (
    <>
      {!done || musics.length ? (
        <div {...props}>
          {musics.map((music, index) => (
            <MusicCard
              key={index}
              music={music}
              buttonProps={{ mediaSize: 1200 }}
            />
          ))}
          <LoadingArea
            loading={loading}
            onInView={handleOnView}
            hide={done && !loading}
          />
        </div>
      ) : (
        <CommonStyle.Empty>
          <CommonStyle.StyledEmptyTrackIcon />
          {editable ? (
            <>
              <div className="empty-content">
                Seems a little quiet over here
              </div>
              <div className="empty-link">
                <Link to={`/upload`}>
                  Upload a track to share it with your followers.
                </Link>
              </div>
              <PrimaryButton className="empty-button">
                <Link to={`/upload`}>Upload Now</Link>
              </PrimaryButton>
            </>
          ) : (
            <div className="empty-content">{`There's no tracks`}</div>
          )}
        </CommonStyle.Empty>
      )}
    </>
  )
}

export default ProfileTracks

import { getMusicsByIds } from '@api/musicApi'
import { IMusic } from '@appTypes/music.type'
import { IUser } from '@appTypes/user.type'
import LoadingArea from '@components/Loading/LoadingArea'
import MusicCard from '@components/MusicCard/MusicCard'
import NoItem from '@pages/TrackDetailPage/DetailTab/NoItem.style'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { GoHeart } from 'react-icons/go'
import styled from 'styled-components'

const StyledMusicCard = styled(MusicCard)`
  margin: 10px 0;
`

const Heart = styled(GoHeart)`
  padding: 20px 50px;
  padding-bottom: 15px;
  border: 3px solid ${({ theme }) => theme.colors.bgTextRGBA(0.38)};
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.38)};
  font-size: 120px;
`

interface IProfileDetailLikesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
}

const ProfileDetailLikes = ({ user, ...props }: IProfileDetailLikesProps) => {
  const { likeMusics } = user

  const [musics, setMusics] = useState<IMusic[]>([])
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const getMusics = useCallback(async () => {
    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * 15
      const take = skip + 15
      const musicIds = likeMusics.slice(skip, take).map((m) => m.id)
      const response = await getMusicsByIds(musicIds, {
        params: { uid: user.id },
      })
      const getItems: IMusic[] = response.data
      if (!getItems || getItems.length < 15) {
        setDone(true)
      }
      setMusics((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
      setDone(true)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, page, user.id])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  useLayoutEffect(() => {
    getMusics()
  }, [getMusics])

  return likeMusics.length ? (
    <div {...props}>
      {musics.map((music, index) => (
        <StyledMusicCard key={index} music={music} />
      ))}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </div>
  ) : (
    <NoItem>
      <Heart />
      <br />
      {`'${user.nickname || user.username}' has no likes yet`}
    </NoItem>
  )
}

export default ProfileDetailLikes

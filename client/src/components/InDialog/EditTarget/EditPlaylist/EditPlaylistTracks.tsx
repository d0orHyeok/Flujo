import { IPlaylist } from '@appTypes/playlist.type'
import React, { useState, useCallback, useEffect } from 'react'
import DndTrackCard from './DndTrackCard'
import styled from 'styled-components'
import { useDrop } from 'react-dnd'

const Container = styled.div`
  padding: 20px 0;
  font-size: 14px;
  width: 550px;

  ${({ theme }) => theme.device.tablet} {
    width: 400px;
  }
`

interface EditPlaylistTracksProps {
  playlist: IPlaylist
  onChangeOrder?: (changedIndexes: number[] | null) => void
}

interface Prosp
  extends EditPlaylistTracksProps,
    React.HTMLAttributes<HTMLDivElement> {}

const EditPlaylistTracks = ({ playlist, onChangeOrder, ...props }: Prosp) => {
  const [, drop] = useDrop(() => ({ accept: 'card' }))

  const [cards, setCards] = useState(
    playlist.musics.map((music, index) => {
      return { id: index, card: music }
    })
  )

  const findCard = useCallback(
    (id: number) => {
      let findIndex = 0
      const card = cards.filter((c, index) => {
        if (c.id === id) {
          findIndex = index
          return true
        }
        return false
      })[0]
      return {
        card,
        index: findIndex,
      }
    },
    [cards]
  )

  const moveCard = useCallback(
    (id: number, atIndex: number) => {
      const find = findCard(id)

      const { card, index } = find

      setCards((prevCards) => {
        const newCards = [...prevCards]
        newCards.splice(index, 1)
        newCards.splice(atIndex, 0, card)
        return newCards
      })
    },
    [findCard]
  )

  const handleDelete = useCallback(
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setCards((prevCards) => {
        const newCards = [...prevCards]
        newCards.splice(index, 1)
        return newCards
      })
    },
    []
  )

  const whenChanged = useCallback(() => {
    if (!onChangeOrder) return
    const indexes = cards.map((card) => card.id)
    const isChanged =
      indexes.findIndex((id, index) => id !== index) !== -1 ||
      cards.length !== playlist.musics.length
    onChangeOrder(isChanged ? indexes : null)
  }, [cards, onChangeOrder, playlist.musics])

  useEffect(() => {
    whenChanged()
  }, [whenChanged])

  return (
    <Container {...props}>
      <ul ref={drop}>
        {cards.map((item, index) => (
          <DndTrackCard
            key={item.id}
            id={item.id}
            music={item.card}
            moveCard={moveCard}
            findCard={findCard}
            onDelete={handleDelete(index)}
          />
        ))}
      </ul>
    </Container>
  )
}

export default EditPlaylistTracks

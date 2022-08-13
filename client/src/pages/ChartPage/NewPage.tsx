import { getNewReleaseMusics } from '@api/musicApi'
import { Helmet } from 'react-helmet-async'
import BaseChartPage from './BaseChartPage'

const NewPage = () => {
  return (
    <>
      <Helmet>
        <title>New Release tracks | Wave</title>
      </Helmet>
      <BaseChartPage
        title="New Release tracks"
        description="Up-and-coming tracks"
        getMusics={getNewReleaseMusics}
      />
    </>
  )
}

export default NewPage

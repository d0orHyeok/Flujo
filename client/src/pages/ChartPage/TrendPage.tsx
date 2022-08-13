import { getTrendingMusics } from '@api/musicApi'
import { Helmet } from 'react-helmet-async'

import BaseChartPage from './BaseChartPage'

const TrendPage = () => {
  return (
    <>
      <Helmet>
        <title>Trending tracks | Wave</title>
      </Helmet>
      <BaseChartPage
        title="Trending tracks"
        description="The most played tracks"
        getMusics={getTrendingMusics}
      />
    </>
  )
}

export default TrendPage

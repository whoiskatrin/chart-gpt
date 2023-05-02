import { Col, Grid } from '@tremor/react';
import { NextPage } from 'next';

const NewHome: NextPage = () => {
  return (
    <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-4 h-full">
      <Col
        numColSpan={1}
        numColSpanMd={2}
        className="bg-gray-100 rounded-md p-4 border border-gray-200 h-full"
      >
        main section
      </Col>
      <aside className="h-full space-y-4 w-[300px]">Sidebar</aside>
    </Grid>
  );
};

export default NewHome;

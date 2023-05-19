import {
  Card,
  Text,
  Metric,
  Callout
  } from '@tremor/react';
  import React from 'react';
  
  interface ChartProps {
    data: any;
  }
  
  //TODO: dynamic keys instead of default value
  export const Chart: React.FC<ChartProps> = ({
    data,
  }) => {
    const renderChart = () => {
      return (
       data.map((item: any, index: any) => {
            return (
              <Card key={index} className="mt-2">
                <Text>Step {index + 1}</Text>
                <Metric>{item.mainTitle}</Metric>
                  {item.subheadings.map((subheading: any, index: any) => {
                    return (
                    <Callout
                      className="mt-4 p-4 pb-2"
                      color="gray"
                      title={subheading.trim()}
                      key={index}
                    ></Callout>
                    );
                  })} 
              </Card>
            );
          })
      )
    };
  
    return (<>
        {renderChart()}</>
    );
  };
  
  export default Chart;  
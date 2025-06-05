import { Card, Grid, List, ListItem, Title, Button } from '@tremor/react';
import Link from 'next/link';

export default function Features() {
  const freeFeatures = [
    '3 chart generations per week',
    'Basic chart types',
    'PNG export',
    'Limited customization',
  ];
  const proFeatures = [
    'Unlimited chart generations',
    'All chart types',
    'Advanced customization settings',
    'PNG, PPT and PDF export',
    'Priority support',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <Title className="text-center mb-8">ChartGPT Features</Title>
      <Grid numColsSm={2} className="gap-6">
        <Card>
          <Title>Free Plan</Title>
          <List className="mt-4">
            {freeFeatures.map(f => (
              <ListItem key={f}>{f}</ListItem>
            ))}
          </List>
        </Card>
        <Card>
          <Title>Pro Plan</Title>
          <List className="mt-4">
            {proFeatures.map(f => (
              <ListItem key={f}>{f}</ListItem>
            ))}
          </List>
        </Card>
      </Grid>
      <div className="mt-8 text-center">
        <Link href="/buy-credits">
          <Button>Upgrade</Button>
        </Link>
      </div>
    </div>
  );
}

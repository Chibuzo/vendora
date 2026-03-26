import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const governanceRows = [
  {
    tenant: 'West Africa Core',
    trust: 'Healthy',
    payouts: 'Scheduled',
    moderation: '12 open'
  },
  {
    tenant: 'Home Goods Pilot',
    trust: 'Monitoring',
    payouts: 'Delayed',
    moderation: '4 escalated'
  },
  {
    tenant: 'Creator Commerce',
    trust: 'Healthy',
    payouts: 'Scheduled',
    moderation: '2 open'
  }
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <Badge variant="secondary" size="sm">
            Admin overview
          </Badge>
          <CardTitle className="mt-3">Operational governance across tenants</CardTitle>
          <CardDescription>
            Example usage of tabs, badges, tables, and shared cards inside the admin surface.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="governance">
        <TabsList>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="risk">Risk signals</TabsTrigger>
        </TabsList>

        <TabsContent value="governance">
          <Card>
            <CardHeader>
              <CardTitle>Tenant governance queue</CardTitle>
              <CardDescription>Row states remain subtle to keep dense operational data readable.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Trust posture</TableHead>
                    <TableHead>Payout state</TableHead>
                    <TableHead>Moderation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {governanceRows.map((row) => (
                    <TableRow key={row.tenant} variant="interactive">
                      <TableCell className="font-medium">{row.tenant}</TableCell>
                      <TableCell>
                        <Badge variant={row.trust === 'Healthy' ? 'success' : 'warning'}>{row.trust}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.payouts === 'Scheduled' ? 'primary' : 'danger'}>{row.payouts}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.moderation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Trust investigations</CardTitle>
              <CardDescription>
                Extend this tab with fraud queues, payout investigations, and platform rule controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="panel-muted p-5">
                <p className="text-sm font-semibold text-foreground">Pending reviews</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">18</p>
                <p className="mt-2 text-sm text-muted-foreground">Awaiting moderator action across active tenants.</p>
              </div>
              <div className="panel-muted p-5">
                <p className="text-sm font-semibold text-foreground">Payout exceptions</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">3</p>
                <p className="mt-2 text-sm text-muted-foreground">Delayed settlement batches requiring reconciliation.</p>
              </div>
              <div className="panel-muted p-5">
                <p className="text-sm font-semibold text-foreground">Trust index delta</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">+1.8</p>
                <p className="mt-2 text-sm text-muted-foreground">Week-over-week lift after search and moderation tuning.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

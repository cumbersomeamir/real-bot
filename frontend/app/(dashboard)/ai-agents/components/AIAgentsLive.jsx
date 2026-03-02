'use client';

import useSWR from 'swr';
import api from '@/lib/api';
import { Badge, Button, Card } from '@/components/ui';

const fetcher = (url) => api.get(url).then((res) => res.data?.data);

export default function AIAgentsLive() {
  const { data, mutate, isLoading } = useSWR('/agents', fetcher);
  const agents = data?.items || [];

  const toggleAgent = async (type, active) => {
    await api.post(`/agents/${type}/toggle`, { active: !active });
    mutate();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(isLoading ? Array.from({ length: 4 }) : agents).map((agent, idx) => (
        <Card key={agent?.type || idx}>
          {agent ? (
            <>
              <div className="flex items-center justify-between">
                <h4 className="text-lg capitalize">{agent.type} Agent</h4>
                <Badge variant={agent.active ? 'success' : 'warning'}>{agent.active ? 'Active' : 'Paused'}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-400">Success rate: {(agent.successRate * 100).toFixed(1)}%</p>
              <Button className="mt-4" variant="ghost" onClick={() => toggleAgent(agent.type, agent.active)}>
                {agent.active ? 'Pause' : 'Activate'}
              </Button>
            </>
          ) : (
            <p className="text-sm text-slate-400">Loading...</p>
          )}
        </Card>
      ))}
    </div>
  );
}

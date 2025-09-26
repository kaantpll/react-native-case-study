import '../global.css';

import { Stack } from 'expo-router';

import DatabaseProvider from '@/providers/database-provider';
import { TanStackQueryProvider } from '@/providers/query-client-provider';

export default function Layout() {
  return (
    <DatabaseProvider>
      <TanStackQueryProvider>
        <Stack />
      </TanStackQueryProvider>
    </DatabaseProvider>
  );
}

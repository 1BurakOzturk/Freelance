import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppNavigator } from './src/navigation';
import { getToken } from './src/authStore';

const qc = new QueryClient();

export default function App() {
  const [isAuthed, setIsAuthed] = React.useState<boolean>(false);
  const [booted, setBooted] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const t = await getToken();
      setIsAuthed(!!t);
      setBooted(true);
    })();
  }, []);

  if (!booted) return null;

  return (
    <QueryClientProvider client={qc}>
      <AppNavigator
        isAuthed={isAuthed}
        onAuthed={() => setIsAuthed(true)}
        onLogout={() => setIsAuthed(false)}
      />
    </QueryClientProvider>
  );
}

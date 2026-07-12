import { createFileRoute } from '@tanstack/react-router';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import spec from '../swagger.json';

export const Route = createFileRoute('/api-docs')({
  component: ApiDocs,
  head: () => ({
    meta: [{ title: 'API Documentation · AssetFlow' }],
  }),
});

function ApiDocs() {
  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-white dark:bg-zinc-950">
      {/* We add a specific light background here because Swagger UI doesn't support dark mode out of the box nicely, 
          so forcing a clean slate is best for readability */}
      <div className="max-w-7xl mx-auto p-4 bg-white text-black min-h-full rounded-md">
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}

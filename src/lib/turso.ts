import { createClient } from "@libsql/client";
const tursoConfig = ({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

const tursoClient = createClient(tursoConfig);

export default tursoClient;
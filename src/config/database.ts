import { Pool, types } from "pg";

import { env } from "@/config/environment.js";

// As colunas de data do modelo são "timestamp" (sem fuso) e guardam horário
// UTC. Sem este parser o pg as lê no fuso do processo: rodando fora do Docker
// no Brasil, tudo ficava 3 horas deslocado (e a estação aparecia Offline).
types.setTypeParser(types.builtins.TIMESTAMP, (value) =>
  value === "infinity" || value === "-infinity"
    ? new Date(NaN)
    : new Date(`${value.replace(" ", "T")}Z`),
);

export const database = new Pool({
  connectionString: env.DATABASE_URL,
});

// Sem este listener, uma conexão ociosa que cai (Postgres reiniciou, rede
// oscilou) emite "error" no Pool e o Node derruba o processo. O pg descarta a
// conexão quebrada sozinho; a próxima query abre outra.
database.on("error", (error) => {
  console.error(
    "[database] conexão ociosa com o Postgres caiu:",
    error.message,
  );
});

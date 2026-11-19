import nest from '@rh/eslint-config/nest';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  nest({ tsconfigRootDir: import.meta.dirname }),
  // Regras específicas deste app entram aqui.
);

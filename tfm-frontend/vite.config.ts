import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import EnvironmentPlugin from "vite-plugin-environment"
import { loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => { 
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins:[react()],
    server: {
      host:true
    },
    define: {
      'process.env.YOUR_STRING_VARIABLE': 
      JSON.stringify(env.YOUR_STRING_VARIABLE),
      'process.env.APP_USE_AVT': env.APP_USE_AVT,
    },
  };
});

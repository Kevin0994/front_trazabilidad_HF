import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Frontend-MI',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    url: 'http://192.168.0.115:8100',
    cleartext: true,
  },
};

export default config;

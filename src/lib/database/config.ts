/**
 * Database configuration for StoryForge
 */

export interface DatabaseConfig {
  filename: string;
  options: {
    verbose?: ((message?: unknown, ...additionalArgs: unknown[]) => void);
    timeout?: number;
    readonly?: boolean;
  };
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs: Record<string, DatabaseConfig> = {
    development: {
      filename: './data/storyforge-dev.db',
      options: {
        verbose: console.log,
        timeout: 5000,
      }
    },
    test: {
      filename: './data/storyforge-test.db',
      options: {
        timeout: 5000,
      }
    },
    production: {
      filename: './data/storyforge.db',
      options: {
        timeout: 10000,
      }
    }
  };

  return configs[env] || configs.development;
};
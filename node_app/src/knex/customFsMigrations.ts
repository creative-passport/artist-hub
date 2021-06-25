import path from 'path';
import sortBy from 'lodash/sortBy';
import fs from 'fs';
import { promisify } from 'util';
import { Knex } from 'knex';
const readdir = promisify(fs.readdir);

const DEFAULT_LOAD_EXTENSIONS = Object.freeze([
  '.co',
  '.coffee',
  '.eg',
  '.iced',
  '.js',
  '.cjs',
  '.litcoffee',
  '.ls',
  '.ts',
]);

interface MigrationSpec {
  file: string;
  directory: string;
}

// Custom migrator which strips the file extension so ts and js migrations are compatible

export class CustomFsMigrations implements Knex.MigrationSource<MigrationSpec> {
  loadExtensions: readonly string[];
  migrationsPaths: string[];
  sortDirsSeparately: boolean;

  constructor(
    migrationDirectories: string | string[],
    sortDirsSeparately = false,
    loadExtensions?: string[]
  ) {
    this.sortDirsSeparately = sortDirsSeparately;

    if (!Array.isArray(migrationDirectories)) {
      migrationDirectories = [migrationDirectories];
    }
    this.migrationsPaths = migrationDirectories;
    this.loadExtensions = loadExtensions || DEFAULT_LOAD_EXTENSIONS;
  }

  /**
   * Gets the migration names
   */
  getMigrations(loadExtensions: readonly string[]): Promise<MigrationSpec[]> {
    // Get a list of files in all specified migration directories
    const readMigrationsPromises = this.migrationsPaths.map((configDir) => {
      const absoluteDir = path.resolve(process.cwd(), configDir);
      return readdir(absoluteDir).then((files) => ({
        files,
        configDir,
        absoluteDir,
      }));
    });

    return Promise.all(readMigrationsPromises).then((allMigrations) => {
      const migrations = allMigrations.reduce(
        (acc: MigrationSpec[], migrationDirectory) => {
          // When true, files inside the folder should be sorted
          if (this.sortDirsSeparately) {
            migrationDirectory.files = migrationDirectory.files.sort();
          }

          migrationDirectory.files.forEach((file) =>
            acc.push({ file, directory: migrationDirectory.configDir })
          );

          return acc;
        },
        []
      );

      // If true we have already sorted the migrations inside the folders
      // return the migrations fully qualified
      if (this.sortDirsSeparately) {
        return filterMigrations(
          migrations,
          loadExtensions || this.loadExtensions
        );
      }

      return filterMigrations(
        sortBy(migrations, 'file'),
        loadExtensions || this.loadExtensions
      );
    });
  }

  getMigrationName(migration: MigrationSpec): string {
    // Strip off the file extension
    return migration.file.replace(/\.[^/.]+$/, '');
  }

  getMigration(migration: MigrationSpec): Knex.Migration {
    const absoluteDir = path.resolve(process.cwd(), migration.directory);
    const _path = path.join(absoluteDir, migration.file);
    return require(_path);
  }
}

function filterMigrations(
  migrations: MigrationSpec[],
  loadExtensions: readonly string[]
) {
  return migrations.filter((migration) => {
    const migrationName = migration.file;

    const extension = path.extname(migrationName);
    return loadExtensions.includes(extension);
  });
}

// This is a temporary file to maintain backward compatibility during migration
// It reexports all schema entities from the new modular schema files

export * from './schemas/user.schema';
export * from './schemas/workshop.schema';
export * from './schemas/custom-design.schema';
export * from './schemas/newsletter.schema';
export * from './schemas/volunteer.schema';
export * from './schemas/contact.schema';
export * from './schemas/types';

// Once all imports have been updated to use the new schema structure,
// this file can be removed and imports updated to point directly to the schema files.

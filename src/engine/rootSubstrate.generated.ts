// Auto-generated Global AST Substrate Manifest (Domain-Scoped Aggregator)
import { UI_AST_STRING, UI_EXPORT_CATALOG } from './substrates/ui.substrate';
import { ENGINE_AST_STRING, ENGINE_EXPORT_CATALOG } from './substrates/engine.substrate';
import { SERVICES_AST_STRING, SERVICES_EXPORT_CATALOG } from './substrates/services.substrate';
import { CORE_AST_STRING, CORE_EXPORT_CATALOG } from './substrates/core.substrate';

export {
  UI_AST_STRING,
  UI_EXPORT_CATALOG,
  ENGINE_AST_STRING,
  ENGINE_EXPORT_CATALOG,
  SERVICES_AST_STRING,
  SERVICES_EXPORT_CATALOG,
  CORE_AST_STRING,
  CORE_EXPORT_CATALOG,
};

export const DOMAIN_SUBSTRATE_REGISTRY = {
  ui: { ast: UI_AST_STRING, catalog: UI_EXPORT_CATALOG },
  engine: { ast: ENGINE_AST_STRING, catalog: ENGINE_EXPORT_CATALOG },
  services: { ast: SERVICES_AST_STRING, catalog: SERVICES_EXPORT_CATALOG },
  core: { ast: CORE_AST_STRING, catalog: CORE_EXPORT_CATALOG },
} as const;

export const ROOT_EXPORT_CATALOG = [
  ...UI_EXPORT_CATALOG,
  ...ENGINE_EXPORT_CATALOG,
  ...SERVICES_EXPORT_CATALOG,
  ...CORE_EXPORT_CATALOG,
] as const;

export const ROOT_AST_STRING =
  ';; Collated Root AST Manifest\n(:root-substrate\n' +
  UI_AST_STRING +
  ENGINE_AST_STRING +
  SERVICES_AST_STRING +
  CORE_AST_STRING +
  ')\n';

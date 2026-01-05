

//
// This module contains:
// - Spell entity definition
// - Business rules for spell construction
// - Validation logic
// - Domain invariants

export const SPELL_VERSION = 8;

export interface SpellInput {
  /** UTXO identifier in format "txid:vout" */
  utxo_id: string;

  /** Charm data attached to this input (if any) */
  charms?: Record<string, unknown>;
}

export interface SpellOutput {
  /** Bitcoin address to send to */
  address: string;

  /** Amount in satoshis (optional - can be 0 for OP_RETURN) */
  sats?: number;

  /** Charm data to attach to this output (if any) */
  charms?: Record<string, unknown>;
}

export interface Spell {
  /** Spell version (currently 8) */
  version: number;

  /**
   * Apps that validate this spell
   * Key: app name/identifier
   * Value: verification key (vk) as 32-byte hex string
   */
  apps: Record<string, string>;

  /** Inputs being spent */
  ins: SpellInput[];

  /** Outputs being created */
  outs: SpellOutput[];

  /** Public arguments visible to all */
  public_args?: Record<string, unknown>;

  /** Private arguments only visible to prover */
  private_args?: Record<string, unknown>;
}

export interface SpellValidationError {
  field: string;
  message: string;
}

export interface SpellValidationResult {
  valid: boolean;
  errors: SpellValidationError[];
}

export function validateSpell(spell: Spell): SpellValidationResult {
  const errors: SpellValidationError[] = [];

  // Check version
  if (spell.version !== SPELL_VERSION) {
    errors.push({
      field: 'version',
      message: `Invalid spell version: ${spell.version}. Expected ${SPELL_VERSION}.`,
    });
  }

  // Check apps
  if (!spell.apps || Object.keys(spell.apps).length === 0) {
    errors.push({
      field: 'apps',
      message: 'Spell must have at least one app defined.',
    });
  }

  for (const [appName, vk] of Object.entries(spell.apps || {})) {
    if (!/^[0-9a-fA-F]{64}$/.test(vk)) {
      errors.push({
        field: `apps.${appName}`,
        message: `Invalid verification key: must be 64 hex characters (32 bytes).`,
      });
    }
  }

  // Check inputs
  if (!spell.ins || spell.ins.length === 0) {
    errors.push({
      field: 'ins',
      message: 'Spell must have at least one input.',
    });
  }

  for (let i = 0; i < (spell.ins?.length || 0); i++) {
    const input = spell.ins[i];
    if (!input.utxo_id || !input.utxo_id.includes(':')) {
      errors.push({
        field: `ins[${i}].utxo_id`,
        message: `Invalid utxo_id format. Expected "txid:vout".`,
      });
    } else {
      const [txid, vout] = input.utxo_id.split(':');
      if (!/^[0-9a-fA-F]{64}$/.test(txid)) {
        errors.push({
          field: `ins[${i}].utxo_id`,
          message: `Invalid txid: must be 64 hex characters.`,
        });
      }
      if (!/^\d+$/.test(vout) || parseInt(vout) < 0) {
        errors.push({
          field: `ins[${i}].utxo_id`,
          message: `Invalid vout: must be a non-negative integer.`,
        });
      }
    }
  }

  // Check outputs
  if (!spell.outs || spell.outs.length === 0) {
    errors.push({
      field: 'outs',
      message: 'Spell must have at least one output.',
    });
  }

  for (let i = 0; i < (spell.outs?.length || 0); i++) {
    const output = spell.outs[i];
    if (!output.address) {
      errors.push({
        field: `outs[${i}].address`,
        message: `Missing address.`,
      });
    }
    // Validate sats if present
    if (output.sats !== undefined && output.sats < 0) {
      errors.push({
        field: `outs[${i}].sats`,
        message: `Satoshi amount cannot be negative.`,
      });
    }
  }

  if (spell.public_args) {
    for (const appKey of Object.keys(spell.public_args)) {
      if (!spell.apps[appKey]) {
        errors.push({
          field: `public_args.${appKey}`,
          message: `References unknown app: ${appKey}`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isValidSpell(spell: Spell): boolean {
  return validateSpell(spell).valid;
}

export function createEmptySpell(): Spell {
  return {
    version: SPELL_VERSION,
    apps: {},
    ins: [],
    outs: [],
    public_args: {},
    private_args: {},
  };
}

export function addApp(spell: Spell, name: string, vk: string): Spell {
  return {
    ...spell,
    apps: {
      ...spell.apps,
      [name]: vk,
    },
  };
}

export function addInput(spell: Spell, input: SpellInput): Spell {
  return {
    ...spell,
    ins: [...spell.ins, input],
  };
}

export function addOutput(spell: Spell, output: SpellOutput): Spell {
  return {
    ...spell,
    outs: [...spell.outs, output],
  };
}

export function setPublicArgs(spell: Spell, appName: string, args: unknown): Spell {
  return {
    ...spell,
    public_args: {
      ...spell.public_args,
      [appName]: args,
    },
  };
}

export function setPrivateArgs(spell: Spell, appName: string, args: unknown): Spell {
  return {
    ...spell,
    private_args: {
      ...spell.private_args,
      [appName]: args,
    },
  };
}

export function getTotalOutputSats(spell: Spell): number {
  return spell.outs.reduce((sum, out) => sum + (out.sats || 0), 0);
}

export function getInputCount(spell: Spell): number {
  return spell.ins.length;
}

export function getOutputCount(spell: Spell): number {
  return spell.outs.length;
}

export function getAppNames(spell: Spell): string[] {
  return Object.keys(spell.apps);
}

export function hasApp(spell: Spell, appName: string): boolean {
  return appName in spell.apps;
}

export function hasCharms(spell: Spell): boolean {
  const hasInputCharms = spell.ins.some(input => input.charms && Object.keys(input.charms).length > 0);
  const hasOutputCharms = spell.outs.some(output => output.charms && Object.keys(output.charms).length > 0);
  return hasInputCharms || hasOutputCharms;
}

export function serializeValueForJson(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === 'bigint') {
    // Convert to number if safe, otherwise string
    const num = Number(value);
    if (Number.isSafeInteger(num)) {
      return num;
    }
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValueForJson);
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = serializeValueForJson(val);
    }
    return result;
  }

  return value;
}

export function spellToJson(spell: Spell): Spell {
  const serialized = serializeValueForJson(spell) as Spell;
  return serialized;
}

export function stringifySpell(spell: Spell): string {
  const jsonSafe = spellToJson(spell);
  return JSON.stringify(jsonSafe);
}

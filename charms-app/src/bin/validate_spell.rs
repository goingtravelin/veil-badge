//! Local spell validator - simulates what the prover does
//! 
//! Usage: cargo run --bin validate_spell --features validator < spell.yaml
//! Or:    echo 'badge yaml...' | cargo run --bin validate_spell --features validator
//!
//! This tool helps catch deserialization errors BEFORE sending to the real prover.
//! The prover converts YAML → JSON internally, then JSON → CBOR → Data for WASM.

use std::io::{self, Read};
use charms_data::Data;
use veil::types::{Action, VeilBadge};

fn main() {
    // Read YAML from stdin
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).expect("Failed to read stdin");
    
    println!("=== Veil Spell Validator ===\n");
    println!("Input length: {} bytes", input.len());
    
    // Try parsing as YAML first
    let yaml_value: serde_yaml::Value = match serde_yaml::from_str(&input) {
        Ok(v) => {
            println!("✅ Valid YAML syntax\n");
            v
        }
        Err(e) => {
            eprintln!("❌ YAML parse error: {}", e);
            std::process::exit(1);
        }
    };
    
    // Check if this is a full spell or just a badge/action
    if yaml_value.get("apps").is_some() {
        println!("📋 Detected full spell format");
        validate_spell(&yaml_value);
    } else if yaml_value.get("id").is_some() && yaml_value.get("created_at").is_some() {
        println!("📋 Detected VeilBadge format");
        validate_badge_yaml(&yaml_value);
    } else if yaml_value.get("Mint").is_some() 
           || yaml_value.get("AcceptProposal").is_some() 
           || yaml_value.get("ReportOutcome").is_some() {
        println!("📋 Detected Action format");
        validate_action_yaml(&yaml_value);
    } else {
        println!("⚠️  Unknown format - attempting badge validation...");
        validate_badge_yaml(&yaml_value);
    }
    
    println!("\n=== Validation Complete ===");
}

fn validate_spell(spell: &serde_yaml::Value) {
    // Validate inputs
    if let Some(ins) = spell.get("ins").and_then(|i| i.as_sequence()) {
        println!("\n📥 Validating {} input(s)...", ins.len());
        for (i, input) in ins.iter().enumerate() {
            println!("\n   Input {}:", i);
            if let Some(utxo_id) = input.get("utxo_id") {
                println!("   UTXO: {:?}", utxo_id);
            }
            if let Some(charms) = input.get("charms").and_then(|c| c.as_mapping()) {
                for (key, badge_yaml) in charms {
                    println!("   Charm {:?}:", key);
                    validate_badge_yaml(badge_yaml);
                }
            }
        }
    }
    
    // Validate outputs
    if let Some(outs) = spell.get("outs").and_then(|o| o.as_sequence()) {
        println!("\n📤 Validating {} output(s)...", outs.len());
        for (i, output) in outs.iter().enumerate() {
            println!("\n   Output {}:", i);
            if let Some(charms) = output.get("charms").and_then(|c| c.as_mapping()) {
                for (key, badge_yaml) in charms {
                    println!("   Charm {:?}:", key);
                    validate_badge_yaml(badge_yaml);
                }
            }
        }
    }
    
    // Validate public_args (Action)
    if let Some(public_args) = spell.get("public_args").and_then(|p| p.as_mapping()) {
        println!("\n🎯 Validating public_args (Action)...");
        for (key, action_yaml) in public_args {
            println!("\n   Action for {:?}:", key);
            validate_action_yaml(action_yaml);
        }
    }
}

fn validate_badge_yaml(yaml: &serde_yaml::Value) {
    // Convert YAML → JSON (simulates prover)
    let json_str = match serde_json::to_string(yaml) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("      ❌ YAML→JSON conversion failed: {}", e);
            return;
        }
    };
    
    // Parse as JSON Value
    let json_value: serde_json::Value = match serde_json::from_str(&json_str) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("      ❌ JSON parse failed: {}", e);
            return;
        }
    };
    
    // Convert JSON → Data (simulates prover's conversion to CBOR)
    let data = Data::from(&json_value);
    
    // Try to deserialize as VeilBadge
    match data.value::<VeilBadge>() {
        Ok(badge) => {
            println!("      ✅ VeilBadge deserializes correctly");
            println!("         id: {}...", hex::encode(&badge.id.0[..8]));
            println!("         created_at: {}", badge.created_at);
            println!("         active_transactions: {}", badge.active_transactions.len());
            println!("         reporting_transactions: {}", badge.reporting_transactions.len());
            
            // Show active tx details
            for (i, tx) in badge.active_transactions.iter().enumerate() {
                println!("         active_tx[{}]: id={}..., category={:?}, value={}", 
                    i, hex::encode(&tx.id.0[..8]), tx.category, tx.value);
            }
        }
        Err(e) => {
            eprintln!("      ❌ VeilBadge deserialization FAILED: {:?}", e);
            eprintln!("\n      JSON sent to Data::from:");
            // Pretty print the problematic JSON
            if let Ok(pretty) = serde_json::to_string_pretty(&json_value) {
                for line in pretty.lines().take(50) {
                    eprintln!("      {}", line);
                }
                if pretty.lines().count() > 50 {
                    eprintln!("      ... ({} more lines)", pretty.lines().count() - 50);
                }
            }
            std::process::exit(1);
        }
    }
}

fn validate_action_yaml(yaml: &serde_yaml::Value) {
    // Convert YAML → JSON
    let json_str = match serde_json::to_string(yaml) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("      ❌ YAML→JSON conversion failed: {}", e);
            return;
        }
    };
    
    // Parse as JSON Value
    let json_value: serde_json::Value = match serde_json::from_str(&json_str) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("      ❌ JSON parse failed: {}", e);
            return;
        }
    };
    
    // Convert JSON → Data
    let data = Data::from(&json_value);
    
    // Try to deserialize as Action
    match data.value::<Action>() {
        Ok(action) => {
            println!("      ✅ Action deserializes correctly");
            match &action {
                Action::Mint { pubkey, current_block, .. } => {
                    println!("         Type: Mint");
                    println!("         pubkey: {}...", hex::encode(&pubkey[..8]));
                    println!("         current_block: {}", current_block);
                }
                Action::Transfer => {
                    println!("         Type: Transfer");
                }
                Action::AcceptProposal { proposal_id, value, category, current_block, .. } => {
                    println!("         Type: AcceptProposal");
                    println!("         proposal_id: {}...", hex::encode(&proposal_id.0[..8]));
                    println!("         value: {}", value);
                    println!("         category: {:?}", category);
                    println!("         current_block: {}", current_block);
                }
                Action::ReportOutcome { transaction_id, outcome, current_block } => {
                    println!("         Type: ReportOutcome");
                    println!("         transaction_id: {}...", hex::encode(&transaction_id.0[..8]));
                    println!("         outcome: {:?}", outcome);
                    println!("         current_block: {}", current_block);
                }
                _ => {
                    println!("         Type: Other action variant");
                }
            }
        }
        Err(e) => {
            eprintln!("      ❌ Action deserialization FAILED: {:?}", e);
            eprintln!("\n      JSON sent to Data::from:");
            if let Ok(pretty) = serde_json::to_string_pretty(&json_value) {
                for line in pretty.lines().take(30) {
                    eprintln!("      {}", line);
                }
            }
            std::process::exit(1);
        }
    }
}

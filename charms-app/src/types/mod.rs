mod action;
pub mod backing;
pub mod proposal;
pub mod transitions;
mod serde;

use ::serde::{ser::SerializeSeq, Deserialize, Deserializer, Serialize, Serializer};
use serde_with::{serde_as, hex::Hex};
use derive_more::{Deref, From, Into, AsRef};
use bitflags::bitflags;
use static_assertions::{assert_eq_size, const_assert};
pub use action::{
    Action, Outcome, Severity, TxType,
    TransactionRecord, RecordWitness, VouchWitness, CascadeWitness, NegativeOutcomeProof,
};

pub use backing::*;
pub use backing::BackingPolicy;
pub use proposal::*;
pub use transitions::*;

#[derive(Clone, Copy, Debug, Eq, PartialEq, PartialOrd, Ord, Hash, Default, Deref, From, Into, AsRef)]
pub struct B32(pub [u8; 32]);

assert_eq_size!(B32, [u8; 32]);

impl B32 {
    pub const fn new(bytes: [u8; 32]) -> Self {
        B32(bytes)
    }

    pub const fn zero() -> Self {
        B32([0u8; 32])
    }

    pub fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }
}

impl PartialEq<[u8; 32]> for B32 {
    fn eq(&self, other: &[u8; 32]) -> bool {
        &self.0 == other
    }
}

impl PartialEq<B32> for [u8; 32] {
    fn eq(&self, other: &B32) -> bool {
        self == &other.0
    }
}

impl Serialize for B32 {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        if serializer.is_human_readable() {
            serializer.serialize_str(&hex::encode(self.0))
        } else {
            // Use serialize_tuple to match charms-data::B32
            use ::serde::ser::SerializeTuple;
            let mut seq = serializer.serialize_tuple(32)?;
            for byte in self.0.iter() {
                seq.serialize_element(byte)?;
            }
            seq.end()
        }
    }
}

impl<'de> Deserialize<'de> for B32 {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        struct B32Visitor;

        impl<'de> ::serde::de::Visitor<'de> for B32Visitor {
            type Value = B32;

            fn expecting(&self, formatter: &mut core::fmt::Formatter) -> core::fmt::Result {
                formatter.write_str("32-byte hex string or a sequence of 32 bytes")
            }

            fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
            where
                E: ::serde::de::Error,
            {
                let bytes = hex::decode(v).map_err(E::custom)?;
                let arr: [u8; 32] = bytes
                    .try_into()
                    .map_err(|_| E::custom("expected 32 bytes"))?;
                Ok(B32(arr))
            }

            fn visit_bytes<E>(self, v: &[u8]) -> Result<Self::Value, E>
            where
                E: ::serde::de::Error,
            {
                let arr: [u8; 32] = v
                    .try_into()
                    .map_err(|_| E::custom("expected 32 bytes"))?;
                Ok(B32(arr))
            }

            fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
            where
                A: ::serde::de::SeqAccess<'de>,
            {
                let mut buf = [0u8; 32];
                for i in 0..32 {
                    buf[i] = seq
                        .next_element()?
                        .ok_or_else(|| ::serde::de::Error::invalid_length(i, &"32 elements"))?;
                }
                if seq.next_element::<u8>()?.is_some() {
                    return Err(::serde::de::Error::invalid_length(33, &"32 elements"));
                }
                Ok(B32(buf))
            }
        }

        // When deserializing from CBOR that was converted from JSON,
        // the data might still be a hex string (not a tuple).
        // Use deserialize_any to handle both cases.
        if deserializer.is_human_readable() {
            deserializer.deserialize_str(B32Visitor)
        } else {
            // Use deserialize_any to handle both:
            // - Hex strings (when JSON was converted to CBOR without transformation)
            // - Tuples/sequences (when proper CBOR byte encoding is used)
            deserializer.deserialize_any(B32Visitor)
        }
    }
}

pub type PubKey = [u8; 33];

pub type Signature = [u8; 64];

#[serde_as]
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct VeilBadge {
    pub id: B32,
    pub created_at: u64,
    #[serde_as(as = "Hex")]
    pub pubkey: PubKey,
    pub tx_total: u64,
    pub tx_positive: u64,
    pub tx_negative: u64,
    pub volume_total: u64,
    pub volume_sum_squares: u128,
    pub window_tx_count: u64,
    pub window_volume: u64,
    pub window_start: u64,
    pub counterparty_count: u64,
    pub backing: BackingAggregates,
    pub vouches_out: Vec<Vouch>,
    pub vouches_in: Vec<Vouch>,
    pub cascade_damage: u64,
    pub active_transactions: Vec<proposal::ActiveTransaction>,
    pub reporting_transactions: Vec<proposal::ReportingTransaction>,
    pub outcomes: proposal::OutcomeAggregates,
    pub trust: u64,
    pub risk: u8,
    pub flags: RiskFlags,
    pub last_nonce: B32,
    pub last_update: u64,
}

impl Default for VeilBadge {
    fn default() -> Self {
        Self {
            id: B32::zero(),
            created_at: 0,
            pubkey: [0u8; 33],
            tx_total: 0,
            tx_positive: 0,
            tx_negative: 0,
            volume_total: 0,
            volume_sum_squares: 0,
            window_tx_count: 0,
            window_volume: 0,
            window_start: 0,
            counterparty_count: 0,
            backing: BackingAggregates::default(),
            vouches_out: Vec::new(),
            vouches_in: Vec::new(),
            cascade_damage: 0,
            active_transactions: Vec::new(),
            reporting_transactions: Vec::new(),
            outcomes: proposal::OutcomeAggregates::default(),
            trust: 15,
            risk: 15,
            flags: RiskFlags::default(),
            last_nonce: B32::zero(),
            last_update: 0,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Vouch {
    pub badge_id: B32,
    pub stake_percent: u8,
    pub created_at: u64,
    pub unlock_at: u64,
}

bitflags! {
    #[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
    pub struct RiskFlags: u8 {
        const ACCELERATION = 0b00000001;
        const EXTRACTION   = 0b00000010;
        const ISOLATED     = 0b00000100;
        const TOO_CLEAN    = 0b00001000;
        const ERRATIC      = 0b00010000;
        const NEW_BADGE    = 0b00100000;
    }
}

// Custom serde implementation that handles both integer and string formats
impl Serialize for RiskFlags {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        // Serialize as raw u8 integer for consistency
        serializer.serialize_u8(self.bits())
    }
}

impl<'de> Deserialize<'de> for RiskFlags {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        struct RiskFlagsVisitor;

        impl<'de> ::serde::de::Visitor<'de> for RiskFlagsVisitor {
            type Value = RiskFlags;

            fn expecting(&self, formatter: &mut core::fmt::Formatter) -> core::fmt::Result {
                formatter.write_str("an integer (0-63) or a string of flag names separated by ' | '")
            }

            fn visit_u64<E>(self, v: u64) -> Result<Self::Value, E>
            where
                E: ::serde::de::Error,
            {
                if v > 63 {
                    return Err(E::custom(format!("RiskFlags value {} out of range (0-63)", v)));
                }
                Ok(RiskFlags::from_bits_truncate(v as u8))
            }

            fn visit_i64<E>(self, v: i64) -> Result<Self::Value, E>
            where
                E: ::serde::de::Error,
            {
                if v < 0 || v > 63 {
                    return Err(E::custom(format!("RiskFlags value {} out of range (0-63)", v)));
                }
                Ok(RiskFlags::from_bits_truncate(v as u8))
            }

            fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
            where
                E: ::serde::de::Error,
            {
                // Handle pipe-separated flag names like "ACCELERATION | NEW_BADGE"
                let mut flags = RiskFlags::empty();
                for part in v.split('|') {
                    let part = part.trim();
                    if part.is_empty() {
                        continue;
                    }
                    let flag = match part {
                        "ACCELERATION" => RiskFlags::ACCELERATION,
                        "EXTRACTION" => RiskFlags::EXTRACTION,
                        "ISOLATED" => RiskFlags::ISOLATED,
                        "TOO_CLEAN" => RiskFlags::TOO_CLEAN,
                        "ERRATIC" => RiskFlags::ERRATIC,
                        "NEW_BADGE" => RiskFlags::NEW_BADGE,
                        _ => return Err(E::custom(format!("Unknown RiskFlag: {}", part))),
                    };
                    flags |= flag;
                }
                Ok(flags)
            }
        }

        deserializer.deserialize_any(RiskFlagsVisitor)
    }
}

assert_eq_size!(RiskFlags, u8);

impl RiskFlags {
    pub fn acceleration(&self) -> bool {
        self.contains(RiskFlags::ACCELERATION)
    }

    pub fn extraction(&self) -> bool {
        self.contains(RiskFlags::EXTRACTION)
    }

    pub fn isolated(&self) -> bool {
        self.contains(RiskFlags::ISOLATED)
    }

    pub fn too_clean(&self) -> bool {
        self.contains(RiskFlags::TOO_CLEAN)
    }

    pub fn erratic(&self) -> bool {
        self.contains(RiskFlags::ERRATIC)
    }

    pub fn new_badge(&self) -> bool {
        self.contains(RiskFlags::NEW_BADGE)
    }

    pub fn set_acceleration(&mut self, value: bool) {
        self.set(RiskFlags::ACCELERATION, value);
    }

    pub fn set_extraction(&mut self, value: bool) {
        self.set(RiskFlags::EXTRACTION, value);
    }

    pub fn set_isolated(&mut self, value: bool) {
        self.set(RiskFlags::ISOLATED, value);
    }

    pub fn set_too_clean(&mut self, value: bool) {
        self.set(RiskFlags::TOO_CLEAN, value);
    }

    pub fn set_erratic(&mut self, value: bool) {
        self.set(RiskFlags::ERRATIC, value);
    }

    pub fn set_new_badge(&mut self, value: bool) {
        self.set(RiskFlags::NEW_BADGE, value);
    }
}

pub const WINDOW_SIZE_BLOCKS: u64 = 144 * 30;

pub const MIN_VOUCH_LOCK_BLOCKS: u64 = 144 * 7;

pub const NEW_BADGE_THRESHOLD_BLOCKS: u64 = 144 * 90;

pub const ACCELERATION_THRESHOLD: f64 = 3.0;

pub const EXTRACTION_MULTIPLIER: u64 = 10;

pub const ISOLATION_THRESHOLD: u64 = 20;

pub const TOO_CLEAN_TX_THRESHOLD: u64 = 50;

pub const ERRATIC_CV_THRESHOLD: f64 = 2.0;

const_assert!(WINDOW_SIZE_BLOCKS > MIN_VOUCH_LOCK_BLOCKS);
const_assert!(NEW_BADGE_THRESHOLD_BLOCKS > WINDOW_SIZE_BLOCKS);
const_assert!(MIN_VOUCH_LOCK_BLOCKS > 0);
const_assert!(EXTRACTION_MULTIPLIER > 1);
const_assert!(TOO_CLEAN_TX_THRESHOLD > 0);

assert_eq_size!(PubKey, [u8; 33]);
assert_eq_size!(Signature, [u8; 64]);

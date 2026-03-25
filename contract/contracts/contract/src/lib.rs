#![no_std]

use soroban_sdk::{contract, contractimpl, Env, Symbol, Address};

#[contract]
pub struct EHRContract;

#[contractimpl]
impl EHRContract {

    // Lưu quyền truy cập (patient -> doctor)
    pub fn grant_access(env: Env, patient: Address, doctor: Address) {
        let key = (patient, doctor);
        env.storage().instance().set(&key, &true);
    }

    // Kiểm tra quyền truy cập
    pub fn check_access(env: Env, patient: Address, doctor: Address) -> bool {
        let key = (patient, doctor);
        env.storage().instance().get(&key).unwrap_or(false)
    }
}

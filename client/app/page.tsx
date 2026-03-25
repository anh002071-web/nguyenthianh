import { Contract, rpc, Address, nativeToScVal } from "@stellar/stellar-sdk";
import { getUserInfo, signTransaction } from "@stellar/freighter-api";

const RPC_URL = "https://soroban-testnet.stellar.org";
const server = new rpc.Server(RPC_URL);

// 👉 THAY bằng contract ID của bạn
const CONTRACT_ID = "YOUR_CONTRACT_ID";

export async function getAddress() {
  const { publicKey } = await getUserInfo();
  return publicKey;
}

// 👉 Gọi grant_access
export async function grantAccess(patient: string, doctor: string) {
  const source = await getAddress();

  const contract = new Contract(CONTRACT_ID);

  const tx = await server.prepareTransaction(
    contract.call(
      "grant_access",
      new Address(patient).toScVal(),
      new Address(doctor).toScVal()
    ),
    {
      source: source,
    }
  );

  const signed = await signTransaction(tx.toXDR(), { network: "TESTNET" });
  const result = await server.sendTransaction(signed.signedTxXdr);

  return result;
}

// 👉 Gọi check_access
export async function checkAccess(patient: string, doctor: string) {
  const contract = new Contract(CONTRACT_ID);

  const result = await server.simulateTransaction(
    contract.call(
      "check_access",
      new Address(patient).toScVal(),
      new Address(doctor).toScVal()
    )
  );

  return result.result?.retval?._value || false;
}
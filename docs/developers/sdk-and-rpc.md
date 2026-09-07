# SDK and Soroban RPC

How the app and API talk to the `legacy` contract. The rule: **the API builds
unsigned transactions; the browser signs them in Freighter and submits them.**

## Write path

```
heirloom-api                 heirloom-web / Freighter            Soroban RPC
─────────────                ────────────────────────            ───────────
build unsigned XDR   ───────▶  signTransaction(xdr)      ───────▶ sendTransaction
(no secret key)                (user approves in wallet)          (poll getTransaction)
```

### TypeScript: build (server side, `@stellar/stellar-sdk`)

```ts
import {
  rpc, TransactionBuilder, Contract, Address, nativeToScVal, BASE_FEE, Networks,
} from "@stellar/stellar-sdk";

const server = new rpc.Server(process.env.STELLAR_RPC_URL!);      // https://soroban-testnet.stellar.org
const contract = new Contract(process.env.HEIRLOOM_CONTRACT_ID!); // CAA55GCID6…XUNE

/** Build an unsigned `approve_guardian(legacy_id, guardian)` transaction. */
export async function buildApproveGuardian(guardianG: string, legacyId: bigint) {
  const account = await server.getAccount(guardianG);             // the guardian pays + signs
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "approve_guardian",
        nativeToScVal(legacyId, { type: "u64" }),
        new Address(guardianG).toScVal(),
      ),
    )
    .setTimeout(120)
    .build();

  const prepared = await server.prepareTransaction(tx);           // simulate + assemble footprint
  return prepared.toXDR();                                        // -> send this string to the client
}
```

### TypeScript: sign + submit (browser, `@stellar/freighter-api`)

```ts
import { signTransaction } from "@stellar/freighter-api";
import { rpc, TransactionBuilder, Networks } from "@stellar/stellar-sdk";

const server = new rpc.Server(process.env.NEXT_PUBLIC_RPC_URL!);

export async function signAndSubmit(unsignedXdr: string) {
  const { signedTxXdr } = await signTransaction(unsignedXdr, {
    networkPassphrase: Networks.TESTNET,
  });

  const tx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
  const sent = await server.sendTransaction(tx);
  if (sent.status === "ERROR") throw new Error(JSON.stringify(sent.errorResult));

  // poll until final
  let res = await server.getTransaction(sent.hash);
  while (res.status === "NOT_FOUND") {
    await new Promise((r) => setTimeout(r, 1000));
    res = await server.getTransaction(sent.hash);
  }
  if (res.status !== "SUCCESS") throw new Error(`tx ${sent.hash} ${res.status}`);
  return sent.hash;
}
```

## Read path

Reads need no signature. Simulate against a throwaway account, or use
`getContractData`.

```ts
import { rpc, TransactionBuilder, Contract, Account, nativeToScVal, scValToNative, BASE_FEE, Networks } from "@stellar/stellar-sdk";

const server = new rpc.Server(process.env.STELLAR_RPC_URL!);
const contract = new Contract(process.env.HEIRLOOM_CONTRACT_ID!);

export async function getLegacy(legacyId: bigint) {
  const probe = new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0");
  const tx = new TransactionBuilder(probe, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
    .addOperation(contract.call("get_legacy", nativeToScVal(legacyId, { type: "u64" })))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) throw new Error(sim.error);
  return scValToNative(sim.result!.retval);   // -> { owner, guardians, threshold, beneficiaries, status, token, total_amount, deposited }
}
```

## Argument encoding cheatsheet

| Contract type | `nativeToScVal` call |
| --- | --- |
| `u64` (`legacy_id`) | `nativeToScVal(id, { type: "u64" })` |
| `u32` (`threshold`, `bps`) | `nativeToScVal(n, { type: "u32" })` |
| `i128` (`total_amount`, stroops) | `nativeToScVal(amount, { type: "i128" })` |
| `Address` | `new Address(g).toScVal()` |
| `Vec<Address>` | `nativeToScVal(addrs.map(a => new Address(a).toScVal()))` — or build an `xdr.ScVal.scvVec` |
| `Vec<BeneficiaryShare>` | vec of structs: `nativeToScVal({ beneficiary: new Address(g), bps }, { type: { beneficiary: ["symbol", "address"], bps: ["symbol", "u32"] } })` |

Amounts are **stroops**: 1 unit of the asset = `10_000_000` (`1e7`) stroops.
Never use JavaScript floats for amounts — pass strings/BigInt.

## Events

```ts
const page = await server.getEvents({
  startLedger,
  filters: [{ type: "contract", contractIds: [process.env.HEIRLOOM_CONTRACT_ID!] }],
});
for (const e of page.events) {
  const topic0 = scValToNative(e.topic[0]);   // "created" | "deposited" | "approved" | …
}
```

See [Events](../contracts/events.md) for the full topic/data table.

import { Tally, Process, Bytes, u128, Console } from "@seda-protocol/as-sdk/assembly";

export function tallyPhase(): void {
  const reveals = Tally.getReveals();
  const results: string[] = [];

  // Collect all status strings from reveals
  for (let i = 0; i < reveals.length; i++) {
    const result = reveals[i].reveal.toUtf8String();
    results.push(result);
  }

  if (results.length === 0) {
    Process.error(Bytes.fromUtf8String('No results revealed'));
    return;
  }

  // Check if all results are the same
  const firstResult = results[0];
  let consensus = true;
  for (let i = 1; i < results.length; i++) {
    if (results[i] !== firstResult) {
      consensus = false;
      break;
    }
  }

  if (!consensus) {
    Process.error(Bytes.fromUtf8String('No consensus on transaction status'));
    return;
  }

  // Return consensus result
  Process.success(Bytes.fromUtf8String(firstResult));
}

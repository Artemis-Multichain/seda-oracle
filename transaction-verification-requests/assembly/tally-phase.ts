import { Tally, Process, Bytes } from '@seda-protocol/as-sdk/assembly';

export function tallyPhase(): void {
  const reveals = Tally.getReveals();

  if (reveals.length === 0) {
    Process.error(Bytes.fromUtf8String('No reveals'));
    return;
  }

  // Just take the first result
  const result = reveals[0].reveal.toUtf8String();
  Process.success(Bytes.fromUtf8String(result));
}

import { Tally, Process, Bytes, Console } from '@seda-protocol/as-sdk/assembly';

export function tallyPhase(): void {
  const reveals = Tally.getReveals();

  if (reveals.length === 0) {
    Process.error(Bytes.fromUtf8String('No results were revealed'));
    return;
  }

  // Count occurrences of each result
  const successCount = reveals.reduce<i32>((count, reveal) => {
    return reveal.reveal.toUtf8String() == 'Transaction Successful'
      ? count + 1
      : count;
  }, 0);

  const failCount = reveals.reduce<i32>((count, reveal) => {
    return reveal.reveal.toUtf8String() == 'Transaction Failed'
      ? count + 1
      : count;
  }, 0);

  Console.log(`Successful votes: ${successCount.toString()}`);
  Console.log(`Failed votes: ${failCount.toString()}`);

  // Calculate total valid votes
  const totalValidVotes = successCount + failCount;

  // Check if we have any valid votes
  if (totalValidVotes == 0) {
    Process.error(
      Bytes.fromUtf8String('No valid transaction status results found')
    );
    return;
  }

  // Require more than 50% agreement for a result
  const threshold = totalValidVotes / 2;

  if (successCount > threshold) {
    Console.log('Consensus: Transaction Successful');
    Process.success(Bytes.fromUtf8String('Transaction Successful'));
  } else if (failCount > threshold) {
    Console.log('Consensus: Transaction Failed');
    Process.success(Bytes.fromUtf8String('Transaction Failed'));
  } else {
    Console.log('No clear consensus reached');
    Process.error(Bytes.fromUtf8String('No consensus on transaction status'));
  }
}

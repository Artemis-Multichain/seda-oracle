import {
  Bytes,
  Console,
  Process,
  proxyHttpFetch,
} from '@seda-protocol/as-sdk/assembly';

@json
class ResultStatus {
  status: string = '';
}

@json
class TxVerificationResult {
  status: string = '';
  message: string = '';
  result: ResultStatus = new ResultStatus();
}

export function executionPhase(): void {
  const input = Process.getInputs().toUtf8String();
  Console.log(`Verifying transaction: ${input}`);

  // Parse chainId and txHash from input
  const drInputs = input.split('-');
  if (drInputs.length !== 2) {
    Process.error(Bytes.fromUtf8String('Invalid input format'));
    return;
  }

  const chainId = drInputs[0];
  const txHash = drInputs[1];

  const response = proxyHttpFetch(
    `https://seda-oracle-production-317f.up.railway.app/proxy/etherscan?chainid=${chainId}&module=transaction&action=gettxreceiptstatus&txhash=${txHash}`
  );

  if (!response.ok) {
    const errorMsg = response.bytes.toUtf8String();
    Console.error(
      `HTTP Response failed: ${response.status.toString()} - ${errorMsg}`
    );
    Process.error(
      Bytes.fromUtf8String(`Failed to verify transaction: ${errorMsg}`)
    );
    return;
  }

  const data = response.bytes.toJSON<TxVerificationResult>();

  // Process the result and return a clear message
  if (data.result.status == '1') {
    Process.success(Bytes.fromUtf8String('Transaction Successful'));
  } else {
    Process.success(Bytes.fromUtf8String('Transaction Failed'));
  }
}

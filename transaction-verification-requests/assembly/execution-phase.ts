import {
  Bytes,
  Console,
  Process,
  proxyHttpFetch,
} from '@seda-protocol/as-sdk/assembly';

@json
class ValidationResponse {
  status!: string;
  message!: string;
  result!: string;
}

export function executionPhase(): void {
  const drInputsRaw = Process.getInputs().toUtf8String();
  Console.log(`Starting verification for: ${drInputsRaw}`);

  // Parse chainId and txHash from input
  const drInputs = drInputsRaw.split('-');
  if (drInputs.length !== 2) {
    Process.error(
      Bytes.fromUtf8String('Invalid input format. Expected: chainId-txHash')
    );
    return;
  }

  const chainId = drInputs[0];
  const txHash = drInputs[1];

  Console.log(
    `Fetching transaction status for chain ${chainId} and tx ${txHash}`
  );

  const url = `https://seda-oracle-production-317f.up.railway.app/proxy/?chainid=${chainId}&module=transaction&action=gettxreceiptstatus&txhash=${txHash}`;
  Console.log(`Request URL: ${url}`);

  const response = proxyHttpFetch(url);

  if (!response.ok) {
    const errorMsg = `HTTP Error: ${response.status.toString()} - ${response.bytes.toUtf8String()}`;
    Console.error(errorMsg);
    Process.error(Bytes.fromUtf8String(errorMsg));
    return;
  }

  const responseText = response.bytes.toUtf8String();
  Console.log(`Raw API Response: ${responseText}`);

  const data = response.bytes.toJSON<ValidationResponse>();

  // Validate the response data
  if (!data.status || !data.message || data.result === null) {
    const errorMsg = 'Invalid API response format';
    Console.error(errorMsg);
    Process.error(Bytes.fromUtf8String(errorMsg));
    return;
  }

  Console.log(
    `Parsed Response - Status: ${data.status}, Message: ${data.message}, Result: ${data.result}`
  );

  if (data.message !== 'OK' || !data.result) {
    const errorMsg = `Validation Failed - Status: ${data.status}, Message: ${data.message}`;
    Console.error(errorMsg);
    Process.error(Bytes.fromUtf8String(errorMsg));
    return;
  }

  // Check if transaction was successful (status = 1)
  if (data.result === '1') {
    const successMsg = 'Transaction Validated Successfully: Status 1';
    Console.log(successMsg);
    Process.success(Bytes.fromUtf8String(successMsg));
  } else {
    const failMsg = `Transaction Failed: Status ${data.result}`;
    Console.log(failMsg);
    Process.error(Bytes.fromUtf8String(failMsg));
  }
}

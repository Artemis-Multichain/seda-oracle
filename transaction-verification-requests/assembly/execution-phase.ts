import { Bytes, Console, Process, httpFetch } from '@seda-protocol/as-sdk';

@json
class ValidationResponse {
  status!: string;
  message!: string;
  result!: string;
}

export function executionPhase(): void {
  const drInputsRaw = Process.getInputs().toUtf8String();
  Console.log(`Verifying transaction: ${drInputsRaw}`);

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

  Console.log(`Validate Transaction Status`);

  const response = httpFetch(
    `https://seda-oracle-production-317f.up.railway.app/proxy/?chainid=${chainId}&module=transaction&action=gettxreceiptstatus&txhash=${txHash}`
  );

  if (!response.ok) {
    Console.error(
      `HTTP Response was rejected: ${response.status.toString()} - ${response.bytes.toUtf8String()}`
    );
    Process.error(
      Bytes.fromUtf8String('Error while fetching transaction status')
    );
    return;
  }

  const data = response.bytes.toJSON<ValidationResponse>();

  if (data.message !== 'OK') {
    Process.error(
      Bytes.fromUtf8String(
        `Status: Transaction Cannot be Validated ${data.result}`
      )
    );
  } else {
    Process.success(
      Bytes.fromUtf8String(
        `Status: Transaction Validated Successfully ${data.result}`
      )
    );
  }
}

import {
  Signer,
  buildSigningConfig,
  postAndAwaitDataRequest,
} from '@seda-protocol/dev-tools';

async function main() {
  if (!process.env.ORACLE_PROGRAM_ID) {
    throw new Error('Please set the ORACLE_PROGRAM_ID in your env file');
  }

  const signingConfig = buildSigningConfig({});
  const signer = await Signer.fromPartial(signingConfig);

  // Example transaction verification request
  const chainId = '84532'; // Base Sepolia
  const txHash =
    '0x1b2aa6906b83251aecf9beb5c1e0ff815d4c7f0ac27cc3df474e0117dd8c3f6c';
  const drInput = `${chainId}-${txHash}`;

  console.log('Posting transaction verification request...');
  console.log(`Chain ID: ${chainId}`);
  console.log(`Transaction Hash: ${txHash}`);

  const result = await postAndAwaitDataRequest(
    signer,
    {
      consensusOptions: {
        method: 'none',
      },
      oracleProgramId: process.env.ORACLE_PROGRAM_ID,
      drInputs: Buffer.from(drInput),
      tallyInputs: Buffer.from([]),
      memo: Buffer.from(new Date().toISOString()),
    },
    {}
  );

  console.table(result);
}

main();

process.env.HELIUS_RPC_URL = 'https://example.com';
process.env.KEYPAIR_ENCRYPTION_KEY = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
jest.mock('../src/lib/raydium', () => ({ SOL_MINT: 'So11111111111111111111111111111111111111112' }));
jest.mock('chalk', () => ({ default: {} }));
jest.mock('@metaplex-foundation/umi-bundle-defaults', () => ({
  createUmi: () => ({ use: () => ({}) }),
}));
jest.mock('@metaplex-foundation/mpl-token-metadata', () => ({ mplTokenMetadata: () => ({}) }));

import swapExample from '../src/data/example-pumpfun-swap.json';
import tokenTx from '../src/data/example-token-tx.json';
import { getTransactionDataFromWebhookTransaction, findTokenMintAddressFromTransaction, getTokenPriceInSolFromTransaction } from '../src/lib/utils';
import { ParsedTransactionWithMeta } from '@solana/web3.js';


describe('utils', () => {
  test('parses webhook transaction', () => {
    const data = getTransactionDataFromWebhookTransaction(swapExample as any);
    expect(data).toBeDefined();
    expect(data?.tokenMint).toBe('2Ya8S3FPkaqu8ji6PaxKMSpJEdYYkbyax8eZMDkvpump');
    expect(data?.solAmount).toBeCloseTo(0.05);
    expect(data?.tokenAmount).toBeCloseTo(1071707.852766);
    expect(data?.isBuy).toBe(true);
    expect(data?.isSell).toBe(false);
    expect(data?.price).toBeCloseTo(0.05 / 1071707.852766);
  });

  test('finds token mint', () => {
    const mint = findTokenMintAddressFromTransaction(tokenTx as unknown as ParsedTransactionWithMeta);
    expect(mint).toBe('12UP9cSwe1tDzQg3KSEx1BpSS9nkpT5VkmDe4fSz4Hso');
  });

  test('calculates token price', () => {
    const priceInfo = getTokenPriceInSolFromTransaction(tokenTx as unknown as ParsedTransactionWithMeta, true);
    expect(priceInfo).toBeDefined();
    expect(priceInfo?.solSpent).toBeCloseTo(4.95);
    expect(priceInfo?.tokensReceived).toBeCloseTo(2679024.146408);
    expect(priceInfo?.pricePerToken).toBeCloseTo(4.95 / 2679024.146408);
  });
});

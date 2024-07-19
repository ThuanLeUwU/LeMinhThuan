import { useMemo } from "react";

const priorities = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: Blockchain) => priorities[blockchain] ?? -99;

  const sortedBalances: FormattedWalletBalance[] = useMemo(
    () =>
      balances
        .filter(
          (balance: WalletBalance) =>
            getPriority(balance.blockchain) > -99 && balance.amount <= 0
        )
        .sort(
          (lhs: WalletBalance, rhs: WalletBalance) =>
            getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
        ),
    [balances]
  );

  const rows = sortedBalances.map((balance, idx) => (
    <WalletRow
      className={classes.row}
      key={idx}
      amount={balance.amount}
      usdValue={prices[balance.currency] * balance.amount}
      formattedAmount={balance.formatted}
    />
  ));

  return <div {...rest}>{rows}</div>;
};

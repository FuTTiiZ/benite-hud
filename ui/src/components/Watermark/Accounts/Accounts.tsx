import { CSSProperties } from 'react'
import { useConfig } from '@hooks/useConfig'

import { signal } from '@preact/signals-react'
import { useNuiEvent } from '@hooks/useNuiEvent'

import BankIcon from '@assets/icons/Bank.svg'
import BankNoteIcon from '@assets/icons/BankNote.svg'
import MoneyBagIcon from '@assets/icons/MoneyBag.svg'

import styles from './Accounts.module.css'

type AccountType = 'bank' | 'money' | 'black_money'

const drawAccounts = signal<boolean>(false)
const accounts = signal<Record<AccountType, number>>({
  bank: 0,
  money: 0,
  black_money: 0,
})

const numberFormatter = new Intl.NumberFormat('da-DK')
const Account = ({
  icon,
  balance,
  color,
}: {
  icon: string
  balance: number
  color: string
}) => (
  <li
    className={styles.account}
    style={{ '--icon-color': color } as CSSProperties}
  >
    {numberFormatter.format(balance)}
    <div>
      <div>
        <img src={icon} draggable={false} />
      </div>
    </div>
  </li>
)

const Accounts = () => {
  const config = useConfig()

  useNuiEvent(
    'updateAccounts',
    ({
      accounts: newAccounts,
      draw,
    }: {
      accounts?: Record<AccountType, number>
      draw: boolean
    }) => {
      if (newAccounts) accounts.value = newAccounts
      drawAccounts.value = draw
    }
  )

  return (
    <ul
      className={styles.accounts}
      style={{
        opacity: drawAccounts.value || config.value.stickyAccounts ? 1 : 0,
      }}
    >
      <Account
        icon={BankIcon}
        balance={accounts.value.bank}
        color="var(--color-blue2)"
      />
      <Account
        icon={BankNoteIcon}
        balance={accounts.value.money}
        color="var(--color-green)"
      />
      <Account
        icon={MoneyBagIcon}
        balance={accounts.value.black_money}
        color="var(--color-red)"
      />
    </ul>
  )
}

export default Accounts

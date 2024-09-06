import React from 'react';
import Header from '@/components/header';
import TransactionTable from '@/components/TransactionTable';
import Search from '@/components/search';
import styles from '@/styles/Home.module.css';

const TransactionsPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {/* <Search /> */}
        <TransactionTable />
      </main>
    </div>
  );
};

export default TransactionsPage;

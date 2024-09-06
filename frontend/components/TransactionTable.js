import React, { useState, useEffect } from 'react';
import styles from "@/styles/Home.module.css";
import moment from "moment-timezone";
import { FaCopy, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';

const TransactionTable = () => {
  const [data, setData] = useState([]);
  const [copiedHash, setCopiedHash] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {
  //   const ws = new WebSocket("ws://localhost:8000/ws");

  //   ws.onmessage = (event) => {
  //     const transaction = JSON.parse(event.data);
  //     setData((prevData) => [transaction, ...prevData]);
  //   };

  //   return () => {
  //     ws.close();
  //   };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/transactions');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedHash(text);
        setTimeout(() => setCopiedHash(null), 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    } else {
      console.error('Clipboard API not supported');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter(txn =>
    txn.hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastTxn = currentPage * transactionsPerPage;
  const indexOfFirstTxn = indexOfLastTxn - transactionsPerPage;
  const currentTransactions = filteredData.slice(indexOfFirstTxn, indexOfLastTxn);

  const pageCount = Math.ceil(filteredData.length / transactionsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, pageCount)));
  };

  return (
    <section className={styles.searchResults}>
    
      <table className={styles.txnSection}>
        <thead>
          <tr className={styles.txnTitle}>
            <th>Transaction Hash</th>
            <th>Method</th>
            <th>Block</th>
            <th className={styles.blueText}>Age</th>
            <th>From</th>
            <th></th>
            <th>To</th>
            <th>Value</th>
            <th className={styles.blueText}>Txn Fee</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((txn) => (
            <tr className={styles.txn} key={txn.hash}>
              <td className={styles.blueText}>
                {txn.hash ? `${txn.hash.slice(0, 12)}...` : ''}
                <button 
                  className={styles.copyButton} 
                  onClick={() => handleCopy(txn.hash)}
                  aria-label="Copy transaction hash"
                >
                  <FaCopy className={styles.copyIcon} />
                  {copiedHash === txn.hash && <span className={styles.copiedText}>Copied!</span>}
                </button>
              </td>
              <td>
                <span className={styles.transfer}>Transfer</span>
              </td>
              <td className={styles.blueText}>{txn.block_number}</td>
              <td>{moment.utc(txn.block_timestamp).local().format('YYYY-MM-DD HH:mm:ss')}</td>
              <td>
                {txn.from_address ? `${txn.from_address.slice(0, 6)}...${txn.from_address.slice(-6)}` : ''}
                <button 
                  className={styles.copyButton} 
                  onClick={() => handleCopy(txn.from_address)}
                  aria-label="Copy from address"
                >
                  <FaCopy className={styles.copyIcon} />
                  {copiedHash === txn.from_address && <span className={styles.copiedText}>Copied!</span>}
                </button>
              </td>
              <td>
                <span className={txn.from_address.toLowerCase() !== searchQuery.toLowerCase() ? styles.inTxn : styles.outTxn}>
                  {txn.from_address.toLowerCase() !== searchQuery.toLowerCase() ? ">" : "OUT"}
                </span>
              </td>
              <td className={styles.blueText}>
                {txn.to_address ? `${txn.to_address.slice(0, 6)}...${txn.to_address.slice(-6)}` : ''}
                <button 
                  className={styles.copyButton} 
                  onClick={() => handleCopy(txn.to_address)}
                  aria-label="Copy to address"
                >
                  <FaCopy className={styles.copyIcon} />
                  {copiedHash === txn.to_address && <span className={styles.copiedText}>Copied!</span>}
                </button>
              </td>
              <td>{txn.value || ''}</td>
              <td>{txn.gas_price || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          <FaChevronLeft />
        </button>
        {[...Array(pageCount)].map((_, index) => {
          const pageNumber = index + 1;
          if (
            pageNumber === 1 ||
            pageNumber === pageCount ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`${styles.paginationButton} ${currentPage === pageNumber ? styles.activePage : ''}`}
              >
                {pageNumber}
              </button>
            );
          } else if (
            (pageNumber === currentPage - 2 && currentPage > 3) ||
            (pageNumber === currentPage + 2 && currentPage < pageCount - 2)
          ) {
            return <span key={pageNumber} className={styles.ellipsis}>...</span>;
          }
          return null;
        })}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageCount}
          className={styles.paginationButton}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default TransactionTable;

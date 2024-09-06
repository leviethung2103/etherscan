import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import styles from '@/styles/Home.module.css';
import { FaCopy, FaChevronLeft, FaChevronRight, FaSearch, FaFilter, FaSortUp, FaSortDown} from 'react-icons/fa';


import moment from "moment-timezone";

const MachineLearningPage = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(25);
    const [copiedHash, setCopiedHash] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [rapidFilter, setRapidFilter] = useState('all');
    const [largeTransactionFilter, setLargeTransactionFilter] = useState(false);
    const [largeTransactionAmount, setLargeTransactionAmount] = useState(1000); // Default to 1000 ETH
    const [sortConfig, setSortConfig] = useState({ key: 'value', direction: 'asc' });



    const paginate = (pageNumber) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, pageCount)));
      };
    
    const [addressFilter, setAddressFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:8001/api/rapid-transactions');
            const result = await response.json();
            result.sort((a, b) => new Date(b.block_timestamp) - new Date(a.block_timestamp));
            setData(result);
            setFilteredData(result);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    
    useEffect(() => {
        const filtered = data.filter(txn => {
            if (rapidFilter === 'all') return true;
            return rapidFilter === 'rapid' ? txn.rapid_transaction : !txn.rapid_transaction;
        });
        setFilteredData(filtered);
    }, [rapidFilter, data]);

    useEffect(() => {
        const filtered = data.filter(txn => {
            const matchesRapid = rapidFilter === 'all' || 
                                 (rapidFilter === 'rapid' && txn.rapid_transaction) || 
                                 (rapidFilter === 'non-rapid' && !txn.rapid_transaction);
            const matchesAddress = addressFilter === '' || 
                                   txn.from_address.toLowerCase().includes(addressFilter.toLowerCase());
            const matchesLargeTransaction = !largeTransactionFilter || (parseFloat(txn.value) >= largeTransactionAmount);
                                
            
            return matchesRapid && matchesAddress && matchesLargeTransaction;
        });

         // Apply sorting by Age if filtering by From address
        if (addressFilter) {
            filtered.sort((a, b) => new Date(a.block_timestamp) - new Date(b.block_timestamp));
        }

        //  Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }


        // if (largeTransactionFilter) {
        //     filtered.sort((a, b) => b.value - a.value); // Sort by value from high to low
        // }

        setFilteredData(filtered);
        setCurrentPage(1);  // Reset to first page when filters change
    }, [rapidFilter, addressFilter, largeTransactionFilter, data, sortConfig]);

    
    const pageCount = Math.ceil(filteredData.length / transactionsPerPage);

    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };


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

    const handleFilter = (fromAddress, toAddress) => {
        console.log("from address", fromAddress, toAddress)
        if (filteredData.length === data.length) {
            const filtered = data.filter(txn => txn.from_address === fromAddress || txn.to_address === toAddress);
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    return (
        <div className={styles.container}>
          <Header />
          <main className={styles.main}>
            <section className={styles.searchResults}>
              <div className={styles.tableHeader}>
                <div className={styles.filterContainer}>
                    <FaFilter className={styles.filterIcon} />
                    <select 
                        value={rapidFilter} 
                        onChange={(e) => setRapidFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                    <option value="all">All Transactions</option>
                    <option value="rapid">Rapid Transactions</option>
                    <option value="non-rapid">Non-Rapid Transactions</option>
                  </select>

                  <input
                    type="text"
                    value={addressFilter}
                    onChange={(e) => setAddressFilter(e.target.value)}
                    placeholder="Filter by From address"
                    className={styles.addressInput}
                  />

                  <label className={styles.largeTransactionLabel}>
                    <input
                      type="checkbox"
                      checked={largeTransactionFilter}
                      onChange={(e) => setLargeTransactionFilter(e.target.checked)}
                    />
                    Large Transactions
                  </label>

                  <input
                    type="number"
                    value={largeTransactionAmount}
                    onChange={(e) => setLargeTransactionAmount(parseFloat(e.target.value))}
                    className={styles.largeTransactionInput}
                    placeholder="Min amount (ETH)"
                    disabled={!largeTransactionFilter}
                  />

                </div>
              </div>
              <table className={styles.txnSection}>
                <thead>
                  <tr className={styles.txnTitle}>
                    <th>Transaction Hash</th>
                    <th>Method</th>
                    <th>Block</th>
                    <th>Age</th>
                    <th>From</th>
                    <th></th>
                    <th>To</th>
                    <th 
                      className={`${styles.sortableHeader} ${
                        sortConfig.key === 'value' ? styles[sortConfig.direction] : ''
                      }`} 
                      onClick={() => handleSort('value')}
                    >
                      Value
                    </th>
                    <th>Txn Fee</th>
                    <th className={styles.blueText}>Rapid Transaction</th>
                    <th className={styles.blueText}>Large Transaction</th>
                  </tr>
                </thead>
                <tbody>
                    {filteredData.slice((currentPage - 1) * transactionsPerPage, currentPage * transactionsPerPage).map((txn, index) => (

                    <tr className={styles.txn} key={`${txn.hash}-${index}`}>
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
                      <td>${txn.value || 0 }</td>
                      <td>{txn.gas_price || ''}</td>
                      <td>
                            <span className={`${styles.filterButton} ${txn.rapid_transaction ? styles.rapidTrue : styles.rapidFalse}`}>
                                {txn.rapid_transaction ? 'True' : 'False'}
                            </span>
                        </td>
                      <td>
                            <span className={`${styles.filterButton} ${txn.large_transaction ? styles.rapidTrue : styles.rapidFalse}`}>
                                {txn.large_transaction ? 'True' : 'False'}
                            </span>
                        </td>
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
          </main>
        </div>
      );
};

export default MachineLearningPage;

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link
import styles from "@/styles/Home.module.css";

import Logo from "../public/assets/logo.png";

export default function Header() {
  const [ethPrice, setEthPrice] = useState("");
  // useEffect(() => {
  //   const getEthPrice = async () => {
  //     const response = await axios.get(`http://localhost:5001/getethprice`, {});
  //     setEthPrice(response.data.usdPrice);
  //   };
  //   getEthPrice();
  // });

  useEffect(() => {
    setEthPrice(2000)
  });

  return (
    <section className={styles.header}>
      <section className={styles.topHeader}>
        ETH Price:{" "}
        <span className={styles.blueText}>${Number(ethPrice).toFixed(2)}</span>
      </section>
      <section className={styles.navbar}>
        <Image src={Logo} alt="Etherscan Logo" className={styles.logo} />
        <section className={styles.menu}>
          <p>
            <Link href="/">
              Home
            </Link>
          </p>
          <p>
            <Link href="/transactions">
              Transactions
            </Link>
          </p>
          <p>
            <Link href="/machine-learning">
              Machine Learning
            </Link>
          </p>
          <p>
            NFTs
            <span className={styles.arrow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </p>
          <p>
            Resources
            <span className={styles.arrow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </p>
          <p>
            Developers
            <span className={styles.arrow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </p>
          <p>
            More
            <span className={styles.arrow}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </p>
          <p>|</p>
          <p>Sign In</p>
        </section>
      </section>
    </section>
  );
}


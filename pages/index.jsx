import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>School Management System</title>
        <meta name="description" content="Manage school data with our comprehensive system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            School Management System
          </h1>
          <p className={styles.description}>
            Efficiently manage school data with our modern web application.
            Add new schools and browse the complete directory.
          </p>
          
          <div className={styles.buttonGroup}>
            <Link href="/addSchool" className={styles.primaryButton}>
              Add New School
            </Link>
            <Link href="/showSchools" className={styles.secondaryButton}>
              View All Schools
            </Link>
          </div>
        </div>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📝</div>
            <h3>Easy Data Entry</h3>
            <p>Add school information with our intuitive form and validation</p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🏫</div>
            <h3>School Directory</h3>
            <p>Browse schools in an ecommerce-style layout with images</p>
          </div>
          
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Responsive Design</h3>
            <p>Works perfectly on desktop, tablet, and mobile devices</p>
          </div>
        </div>
      </div>
    </>
  );
}

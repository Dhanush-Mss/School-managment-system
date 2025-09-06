import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/ShowSchools.module.css';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools');
      if (response.ok) {
        const data = await response.json();
        setSchools(data);
      } else {
        setError('Failed to fetch schools');
      }
    } catch (err) {
      setError('An error occurred while fetching schools');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchSchools} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Schools Directory - School Management</title>
        <meta name="description" content="Browse all schools in our directory" />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.navigation}>
          <Link href="/" className={styles.navLink}>← Home</Link>
        </div>
        <div className={styles.header}>
          <h1 className={styles.title}>Schools Directory</h1>
          <p className={styles.subtitle}>
            Discover schools in your area ({schools.length} schools found)
          </p>
          <Link href="/addSchool" className={styles.addButton}>
            + Add New School
          </Link>
        </div>

        {schools.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏫</div>
            <h2>No Schools Found</h2>
            <p>Be the first to add a school to our directory!</p>
            <Link href="/addSchool" className={styles.primaryButton}>
              Add First School
            </Link>
          </div>
        ) : (
          <div className={styles.schoolsGrid}>
            {schools.map((school) => (
              <div key={school.id} className={styles.schoolCard}>
                <div className={styles.imageContainer}>
                  {school.image ? (
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className={styles.schoolImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <span className={styles.placeholderIcon}>🏫</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.schoolName}>{school.name}</h3>
                  
                  <div className={styles.schoolInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>📍</span>
                      <span className={styles.infoText}>{school.address}</span>
                    </div>
                    
                    <div className={styles.infoItem}>
                      <span className={styles.infoIcon}>🏙️</span>
                      <span className={styles.infoText}>
                        {school.city}, {school.state}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.cardActions}>
                    <button className={styles.viewButton}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/AddSchool.module.css';

export default function AddSchool() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const emailValue = watch('email_id');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const result = await response.json();
    return result.imageUrl;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      let imageUrl = '';
      
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const schoolData = {
        ...data,
        contact: parseInt(data.contact),
        image: imageUrl
      };

      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData),
      });

      if (response.ok) {
        setSubmitMessage('School added successfully!');
        reset();
        setImagePreview(null);
        setSelectedFile(null);
      } else {
        setSubmitMessage('Failed to add school. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add School - School Management</title>
        <meta name="description" content="Add a new school to the database" />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.navigation}>
          <Link href="/" className={styles.navLink}>← Home</Link>
          <Link href="/showSchools" className={styles.navLink}>View Schools</Link>
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Add New School</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                School Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'School name is required' })}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Enter school name"
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Address *
              </label>
              <textarea
                id="address"
                {...register('address', { required: 'Address is required' })}
                className={`${styles.textarea} ${errors.address ? styles.inputError : ''}`}
                placeholder="Enter school address"
                rows={3}
              />
              {errors.address && (
                <span className={styles.errorText}>{errors.address.message}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  {...register('city', { required: 'City is required' })}
                  className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                  placeholder="Enter city"
                />
                {errors.city && (
                  <span className={styles.errorText}>{errors.city.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state" className={styles.label}>
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  {...register('state', { required: 'State is required' })}
                  className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
                  placeholder="Enter state"
                />
                {errors.state && (
                  <span className={styles.errorText}>{errors.state.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="contact" className={styles.label}>
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contact"
                  {...register('contact', { 
                    required: 'Contact number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit contact number'
                    }
                  })}
                  className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
                  placeholder="Enter 10-digit contact number"
                />
                {errors.contact && (
                  <span className={styles.errorText}>{errors.contact.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email_id" className={styles.label}>
                  Email ID *
                </label>
                <input
                  type="email"
                  id="email_id"
                  {...register('email_id', { 
                    required: 'Email is required',
                    validate: (value) => validateEmail(value) || 'Please enter a valid email address'
                  })}
                  className={`${styles.input} ${errors.email_id ? styles.inputError : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email_id && (
                  <span className={styles.errorText}>{errors.email_id.message}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>
                School Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                </div>
              )}
            </div>

            {submitMessage && (
              <div className={`${styles.message} ${submitMessage.includes('successfully') ? styles.successMessage : styles.errorMessage}`}>
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : ''}`}
            >
              {isSubmitting ? 'Adding School...' : 'Add School'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

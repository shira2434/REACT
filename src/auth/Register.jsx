import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/store';
import { authAPI } from '../api/api';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'שם פרטי חייב להכיל לפחות 2 תווים')
    .required('שדה חובה'),
  lastName: Yup.string()
    .min(2, 'שם משפחה חייב להכיל לפחות 2 תווים')
    .required('שדה חובה'),
  email: Yup.string()
    .email('כתובת אימייל לא תקינה')
    .required('שדה חובה'),
  password: Yup.string()
    .min(8, 'סיסמה חייבת להכיל לפחות 8 תווים')
    .matches(/[A-Z]/, 'סיסמה חייבת להכיל לפחות אות גדולה אחת')
    .matches(/[a-z]/, 'סיסמה חייבת להכיל לפחות אות קטנה אחת')
    .matches(/[0-9]/, 'סיסמה חייבת להכיל לפחות ספרה אחת')
    .matches(/[!@#$%^&*]/, 'סיסמה חייבת להכיל לפחות תו מיוחד אחד')
    .required('שדה חובה'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'סיסמאות לא תואמות')
    .required('שדה חובה'),
  phone: Yup.string()
    .matches(/^05[0-9]-?[0-9]{7}$/, 'מספר טלפון לא תקין')
    .required('שדה חובה'),
  address: Yup.string()
    .min(5, 'כתובת חייבת להכיל לפחות 5 תווים')
    .required('שדה חובה')
});

const Register = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...userData } = values;
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        setSuccess(true);
        setError('');
        dispatch(loginUser(userData));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בהרשמה');
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.successCard}`}>
          <div className={styles.success}>
            <h2 className={styles.successTitle}>הרשמה הושלמה בהצלחה!</h2>
            <p className={styles.successText}>ברוך הבא למערכת שלנו</p>
            <Link to="/login" className={styles.link}>
              עבור להתחברות
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            👤 הרשמה למערכת 👤
          </h2>
        </div>
        
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>👤 שם פרטי</label>
                  <Field name="firstName" className={styles.input} />
                  <ErrorMessage name="firstName" component="div" className={styles.errorText} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>👤 שם משפחה</label>
                  <Field name="lastName" className={styles.input} />
                  <ErrorMessage name="lastName" component="div" className={styles.errorText} />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>📧 אימייל</label>
                <Field type="email" name="email" className={styles.input} />
                <ErrorMessage name="email" component="div" className={styles.errorText} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>🔒 סיסמה</label>
                <Field type="password" name="password" className={styles.input} />
                <ErrorMessage name="password" component="div" className={styles.errorText} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>🔒 אימות סיסמה</label>
                <Field type="password" name="confirmPassword" className={styles.input} />
                <ErrorMessage name="confirmPassword" component="div" className={styles.errorText} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>📱 טלפון</label>
                <Field name="phone" placeholder="050-1234567" className={styles.input} />
                <ErrorMessage name="phone" component="div" className={styles.errorText} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>🏠 כתובת</label>
                <Field name="address" className={styles.input} />
                <ErrorMessage name="address" component="div" className={styles.errorText} />
              </div>

              <button type="submit" disabled={isSubmitting} className={styles.button}>
                {isSubmitting ? '🔄 נרשם...' : '✅ הירשם'}
              </button>

              <div className={styles.footer}>
                <Link to="/login" className={styles.footerLink}>
                  יש לך כבר חשבון? התחבר כאן
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
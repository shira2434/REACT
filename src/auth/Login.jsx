import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { authAPI } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('כתובת אימייל לא תקינה')
    .required('שדה חובה'),
  password: Yup.string()
    .required('שדה חובה')
});

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await authAPI.login(values);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = '/home';
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('❌ השרת לא מגיב. אנא וודא שהשרת רץ על http://localhost:3001');
      } else {
        setError(err.response?.data?.message || '❌ אימייל או סיסמה שגויים');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          🔐 התחברות למערכת
        </h2>
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
              
              <div className={styles.field}>
                <label className={styles.label}>
                  📧 אימייל
                </label>
                <Field type="email" name="email" className={styles.input} />
                <ErrorMessage name="email" component="div" className={styles.errorText} />
              </div>

              <div className={styles.fieldLast}>
                <label className={styles.label}>
                  🔒 סיסמה
                </label>
                <Field type="password" name="password" className={styles.input} />
                <ErrorMessage name="password" component="div" className={styles.errorText} />
              </div>

              <button type="submit" disabled={isSubmitting} className={styles.button}>
                {isSubmitting ? '🔄 מתחבר...' : '🚀 התחבר'}
              </button>

              <div className={styles.footer}>
                <Link to="/register" className={styles.link}>
                  ✨ אין לך חשבון? הירשם כאן
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { authAPI } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/store';
import styles from './Login.module.css';

const validationSchema = Yup.object({
  email: Yup.string().email('כתובת אימייל לא תקינה').required('שדה חובה'),
  password: Yup.string().required('שדה חובה'),
});

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await authAPI.login(values);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        dispatch(loginUser(response.data.user));
        navigate('/home', { replace: true });
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        setError('השרת לא מגיב. אנא וודא שהשרת רץ');
      } else {
        setError(err.response?.data?.message || 'אימייל או סיסמה שגויים');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      {/* צד תמונה */}
      <div className={styles.imageSide}>
        <div className={styles.imageText}>
          <h1>☕ לה קוצ'ינה</h1>
          <p>קייטרינג חלבי איטלקי • מנות טריות מדי יום</p>
        </div>
      </div>

      {/* צד טופס */}
      <div className={styles.formSide}>
        <div className={styles.card}>
          <div className={styles.logo}>👋</div>
          <h2 className={styles.title}>ברוך הבא!</h2>
          <p className={styles.subtitle}>התחבר כדי להמשיך לתפריט שלנו</p>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.field}>
                  <label className={styles.label}>אימייל</label>
                  <Field type="email" name="email" className={styles.input} placeholder="your@email.com" />
                  <ErrorMessage name="email" component="div" className={styles.errorText} />
                </div>

                <div className={styles.fieldLast}>
                  <label className={styles.label}>סיסמה</label>
                  <Field type="password" name="password" className={styles.input} placeholder="••••••••" />
                  <ErrorMessage name="password" component="div" className={styles.errorText} />
                </div>

                <button type="submit" disabled={isSubmitting} className={styles.button}>
                  {isSubmitting ? 'מתחבר...' : 'התחבר →'}
                </button>

                <div className={styles.footer}>
                  <Link to="/register" className={styles.link}>
                    אין לך חשבון? הירשם כאן
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;

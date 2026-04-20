import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/store';
import { authAPI } from '../api/api';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

const validationSchema = Yup.object({
  firstName: Yup.string().min(2, 'לפחות 2 תווים').required('שדה חובה'),
  lastName: Yup.string().min(2, 'לפחות 2 תווים').required('שדה חובה'),
  email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
  password: Yup.string()
    .min(8, 'לפחות 8 תווים')
    .matches(/[A-Z]/, 'חייב אות גדולה')
    .matches(/[a-z]/, 'חייב אות קטנה')
    .matches(/[0-9]/, 'חייב ספרה')
    .matches(/[!@#$%^&*]/, 'חייב תו מיוחד')
    .required('שדה חובה'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'סיסמאות לא תואמות').required('שדה חובה'),
  phone: Yup.string().matches(/^05[0-9]-?[0-9]{7}$/, 'טלפון לא תקין').required('שדה חובה'),
  address: Yup.string().min(5, 'לפחות 5 תווים').required('שדה חובה'),
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

  return (
    <div className={styles.container}>
      {/* צד תמונה */}
      <div className={styles.imageSide}>
        <div className={styles.imageText}>
          <h1>☕ לה קוצ'ינה</h1>
          <p>הצטרף אלינו ותיהנה מהתפריט המלא</p>
        </div>
      </div>

      {/* צד טופס */}
      <div className={styles.formSide}>
        <div className={styles.card}>
          {success ? (
            <div className={styles.successCard}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <div className={styles.success}>
                <h2 className={styles.successTitle}>ברוך הבא למשפחה!</h2>
                <p className={styles.successText}>ההרשמה הושלמה בהצלחה</p>
              </div>
              <Link to="/login" className={styles.link}>התחבר עכשיו →</Link>
            </div>
          ) : (
            <>
              <div className={styles.logo}>✨</div>
              <h2 className={styles.title}>יצירת חשבון</h2>
              <p className={styles.subtitle}>הצטרף אלינו ותיהנה מהתפריט המלא</p>

              <Formik
                initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phone: '', address: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label className={styles.label}>שם פרטי</label>
                        <Field name="firstName" className={styles.input} placeholder="ישראל" />
                        <ErrorMessage name="firstName" component="div" className={styles.errorText} />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>שם משפחה</label>
                        <Field name="lastName" className={styles.input} placeholder="ישראלי" />
                        <ErrorMessage name="lastName" component="div" className={styles.errorText} />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>אימייל</label>
                      <Field type="email" name="email" className={styles.input} placeholder="your@email.com" />
                      <ErrorMessage name="email" component="div" className={styles.errorText} />
                    </div>

                    <div className={styles.row}>
                      <div className={styles.field}>
                        <label className={styles.label}>סיסמה</label>
                        <Field type="password" name="password" className={styles.input} placeholder="••••••••" />
                        <ErrorMessage name="password" component="div" className={styles.errorText} />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>אימות סיסמה</label>
                        <Field type="password" name="confirmPassword" className={styles.input} placeholder="••••••••" />
                        <ErrorMessage name="confirmPassword" component="div" className={styles.errorText} />
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>טלפון</label>
                      <Field name="phone" className={styles.input} placeholder="050-1234567" />
                      <ErrorMessage name="phone" component="div" className={styles.errorText} />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>כתובת</label>
                      <Field name="address" className={styles.input} placeholder="רחוב, עיר" />
                      <ErrorMessage name="address" component="div" className={styles.errorText} />
                    </div>

                    <button type="submit" disabled={isSubmitting} className={styles.button}>
                      {isSubmitting ? 'נרשם...' : 'צור חשבון →'}
                    </button>

                    <div className={styles.footer}>
                      <Link to="/login" className={styles.footerLink}>
                        יש לך כבר חשבון? התחבר כאן
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;

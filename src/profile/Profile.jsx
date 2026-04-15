import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { usersAPI } from '../api/api';

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
  phone: Yup.string()
    .matches(/^05[0-9]-?[0-9]{7}$/, 'מספר טלפון לא תקין')
    .required('שדה חובה'),
  address: Yup.string()
    .min(5, 'כתובת חייבת להכיל לפחות 5 תווים')
    .required('שדה חובה')
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await usersAPI.updateUser(user.id, values);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      alert('שגיאה בעדכון הפרטים');
    }
    setSubmitting(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <div style={{padding: '20px', marginTop: '40px', maxWidth: '800px', margin: '40px auto 0'}}>
      <div style={{
        background: 'linear-gradient(135deg, #0891b2 0%, #0c4a6e 100%)',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '40px',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '48px',
          color: 'white',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          margin: '0'
        }}>
          👤 הפרטים שלי 👤
        </h1>
      </div>
      
      {success && (
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '16px'
        }}>
          ✅ הפרטים עודכנו בהצלחה!
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <Formik
          initialValues={{
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form style={{
              display: 'grid',
              gap: '25px'
            }}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    👤 שם פרטי
                  </label>
                  <Field
                    name="firstName"
                    style={{
                      width: '100%',
                      padding: '15px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                  />
                  <ErrorMessage name="firstName" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    👤 שם משפחה
                  </label>
                  <Field
                    name="lastName"
                    style={{
                      width: '100%',
                      padding: '15px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s'
                    }}
                  />
                  <ErrorMessage name="lastName" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  📧 אימייל
                </label>
                <Field
                  type="email"
                  name="email"
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s'
                  }}
                />
                <ErrorMessage name="email" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  📱 טלפון
                </label>
                <Field
                  name="phone"
                  placeholder="050-1234567"
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s'
                  }}
                />
                <ErrorMessage name="phone" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  🏠 כתובת
                </label>
                <Field
                  name="address"
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s'
                  }}
                />
                <ErrorMessage name="address" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '15px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  ℹ️ מידע נוסף
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    backgroundColor: user.isAdmin ? '#0891b2' : '#0891b2',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {user.isAdmin ? '👑 מנהל מערכת' : '👤 משתמש רגיל'}
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: isSubmitting ? '#9ca3af' : '#0891b2',
                  color: 'white',
                  padding: '18px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s',
                  boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)'
                }}
              >
                {isSubmitting ? '💾 שומר...' : '💾 שמור שינויים'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Profile;

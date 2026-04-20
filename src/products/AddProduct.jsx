import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { productsAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/store';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'שם המוצר חייב להכיל לפחות 2 תווים')
    .required('שדה חובה'),
  category: Yup.string()
    .required('שדה חובה'),
  price: Yup.number()
    .positive('המחיר חייב להיות חיובי')
    .required('שדה חובה'),
  description: Yup.string()
    .min(10, 'התיאור חייב להכיל לפחות 10 תווים')
    .required('שדה חובה'),
  image: Yup.string()
    .url('כתובת תמונה לא תקינה')
    .required('שדה חובה'),
  stock: Yup.number()
    .integer('כמות חייבת להיות מספר שלם')
    .min(0, 'כמות לא יכולה להיות שלילית')
    .required('שדה חובה')
});

const AddProduct = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await productsAPI.addProduct({
        ...values,
        price: parseFloat(values.price),
        stock: parseInt(values.stock)
      });
      if (response.data.success) {
        dispatch(addToast({ type: 'success', message: `${values.name} נוסף בהצלחה!` }));
        setSuccess(true);
        resetForm();
        setTimeout(() => navigate('/home'), 2000);
      }
    } catch (error) {
      dispatch(addToast({ type: 'error', message: 'שגיאה בהוספת המוצר' }));
    }
    setSubmitting(false);
  };

  const categories = ['מחשבים', 'טלפונים', 'אביזרים', 'טאבלטים', 'צילום', 'גיימינג', 'בית חכם'];

  return (
    <div style={{padding: '20px', marginTop: '40px', maxWidth: '900px', margin: '40px auto 0'}}>
      <div style={{
        background: 'linear-gradient(135deg, #8b3a1a 0%, #8b3a1a 100%)',
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
          {/* ➕ הוסף מוצר חדש ➕ */}
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.9)',
          marginTop: '10px',
          fontWeight: '300'
        }}>
          הוסף מוצר חדש לחנות שלך
        </p>
      </div>
      
      {success && (
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '18px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          ✅ המוצר נוסף בהצלחה! מעביר לדף הבית...
        </div>
      )}

      <Formik
        initialValues={{
          name: '',
          category: '',
          price: '',
          description: '',
          image: '',
          stock: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{marginBottom: '25px'}}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                📝 שם המוצר
              </label>
              <Field
                name="name"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'border-color 0.3s'
                }}
              />
              <ErrorMessage name="name" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div style={{marginBottom: '25px'}}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                📂 קטגוריה
              </label>
              <Field
                as="select"
                name="category"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">בחר קטגוריה</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px'}}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  💰 מחיר (₪)
                </label>
                <Field
                  type="number"
                  name="price"
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                />
                <ErrorMessage name="price" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  📦 כמות במלאי
                </label>
                <Field
                  type="number"
                  name="stock"
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                />
                <ErrorMessage name="stock" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
              </div>
            </div>

            <div style={{marginBottom: '25px'}}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                📝 תיאור המוצר
              </label>
              <Field
                as="textarea"
                name="description"
                rows="4"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
              <ErrorMessage name="description" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div style={{marginBottom: '30px'}}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                🖼️ כתובת תמונה
              </label>
              <Field
                name="image"
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px'
                }}
              />
              <ErrorMessage name="image" component="div" style={{color: '#dc2626', fontSize: '14px', marginTop: '5px'}} />
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  backgroundColor: isSubmitting ? '#9ca3af' : '#0891b2',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s',
                  boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)'
                }}
              >
                {isSubmitting ? 'מוסיף...' : '➕ הוסף מוצר'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/home')}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                ❌ ביטול
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProduct;

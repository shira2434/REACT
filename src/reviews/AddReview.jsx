import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { reviewsAPI } from '../api/api';
import { addToast } from '../store/store';

const PRIMARY = '#c8622a';

const validationSchema = Yup.object({
  rating: Yup.number().min(1, 'בחרי דירוג').max(5).required('שדה חובה'),
  comment: Yup.string().min(10, 'לפחות 10 תווים').required('שדה חובה'),
});

const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '8px 0' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: '36px', cursor: 'pointer',
            transition: 'transform 0.15s',
            transform: (hover || value) >= star ? 'scale(1.2)' : 'scale(1)',
            filter: (hover || value) >= star ? 'none' : 'grayscale(1) opacity(0.4)',
          }}
        >⭐</span>
      ))}
    </div>
  );
};

const AddReview = ({ productId, userId, onReviewAdded, onClose }) => {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await reviewsAPI.addReview({ ...values, productId, userId, rating: parseInt(values.rating) });
      if (response.data.success) {
        dispatch(addToast({ type: 'success', message: 'חוות הדעת נוספה בהצלחה! ⭐' }));
        onReviewAdded(response.data.review);
      }
    } catch {
      dispatch(addToast({ type: 'error', message: 'שגיאה בהוספת חוות הדעת' }));
    }
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '36px',
        width: '100%', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'scaleIn 0.25s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>⭐</div>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#3b1a08', margin: 0 }}>הוסף חוות דעת</h3>
        </div>

        <Formik initialValues={{ rating: 0, comment: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, setFieldValue, values }) => (
            <Form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ textAlign: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#6b3a1f', display: 'block', marginBottom: '8px' }}>
                  הדירוג שלך
                </label>
                <StarRating value={values.rating} onChange={v => setFieldValue('rating', v)} />
                <ErrorMessage name="rating" component="div" style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }} />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#6b3a1f', display: 'block', marginBottom: '6px' }}>
                  חוות דעת
                </label>
                <Field
                  as="textarea" name="comment" rows="4"
                  placeholder="ספרי לנו על החוויה שלך..."
                  style={{
                    width: '100%', padding: '12px 16px', border: '2px solid #e8d5c4',
                    borderRadius: '12px', fontSize: '14px', resize: 'vertical',
                    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                  }}
                />
                <ErrorMessage name="comment" component="div" style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={onClose} style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  border: '2px solid #e8d5c4', background: 'white',
                  color: '#6b3a1f', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                }}>ביטול</button>
                <button type="submit" disabled={isSubmitting} style={{
                  flex: 2, padding: '12px', borderRadius: '12px', border: 'none',
                  background: `linear-gradient(135deg, #e8a87c, ${PRIMARY})`,
                  color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(200,98,42,0.35)',
                }}>
                  {isSubmitting ? 'שולח...' : 'שלח חוות דעת ⭐'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddReview;

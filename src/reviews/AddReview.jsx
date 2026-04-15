import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { reviewsAPI } from '../api/api';
import './AddReview.css';

const validationSchema = Yup.object({
  rating: Yup.number()
    .min(1, 'דירוג חייב להיות לפחות 1')
    .max(5, 'דירוג לא יכול להיות יותר מ-5')
    .required('שדה חובה'),
  comment: Yup.string()
    .min(10, 'חוות הדעת חייבת להכיל לפחות 10 תווים')
    .required('שדה חובה')
});

const AddReview = ({ productId, userId, onReviewAdded, onClose }) => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await reviewsAPI.addReview({
        ...values,
        productId,
        userId,
        rating: parseInt(values.rating)
      });
      
      if (response.data.success) {
        onReviewAdded(response.data.review);
      }
    } catch (error) {
      alert('שגיאה בהוספת חוות הדעת');
    }
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">⭐ הוסף חוות דעת ⭐</h3>
        
        <Formik
          initialValues={{
            rating: '',
            comment: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="review-form">
              <div>
                <label className="field-label">
                  ⭐ דירוג (1-5 כוכבים)
                </label>
                <Field
                  as="select"
                  name="rating"
                  className="rating-select"
                >
                  <option value="">🎯 בחר דירוג</option>
                  <option value="1">⭐ גרוע (1)</option>
                  <option value="2">⭐⭐ לא טוב (2)</option>
                  <option value="3">⭐⭐⭐ בסדר (3)</option>
                  <option value="4">⭐⭐⭐⭐ טוב (4)</option>
                  <option value="5">⭐⭐⭐⭐⭐ מעולה! (5)</option>
                </Field>
                <ErrorMessage name="rating" component="div" className="error-message" />
              </div>

              <div>
                <label className="field-label">
                  📝 חוות דעת
                </label>
                <Field
                  as="textarea"
                  name="comment"
                  rows="4"
                  placeholder="כתוב את חוות דעתך על המוצר..."
                  className="comment-textarea"
                />
                <ErrorMessage name="comment" component="div" className="error-message" />
              </div>

              <div className="button-container">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? '🔄 שולח...' : '✅ שלח חוות דעת'}
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="cancel-button"
                >
                  ❌ ביטול
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

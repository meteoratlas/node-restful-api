import axios from 'axios';
import { showAlert } from './alert';

// type is either 'data' or 'password'
export const updateData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `/api/v1/users/updatePassword`
        : `/api/v1/users/updatecurrentuser`;
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type[0].toUpperCase() + type.slice(1)} updated successfully`
      );
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

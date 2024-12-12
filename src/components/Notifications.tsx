import { notification } from 'antd';

export const showUploadSummary = (total: number, duplicates: number, errors: number) => {
  notification.open({
    message: 'Upload Summary',
    description: `Total rows uploaded: ${total}, Duplicates removed: ${duplicates}, Rows skipped due to errors: ${errors}`,
  });
};
import React from 'react';
import { Tag } from 'antd';

const DEFAULT_COLOR = 'gray';

export const STATUS_MAP = {
  CANCELLED: 'cancelled',
  SUCCESS: 'success',
  FAILURE: 'failure',
  SKIPPED: 'skipped',
}

const COLOR_MAP = {
  [STATUS_MAP.CANCELLED]: 'gray',
  [STATUS_MAP.SUCCESS]: 'green',
  [STATUS_MAP.FAILURE]: 'red',
}

export default ({ status }) => <Tag color={COLOR_MAP[status] || DEFAULT_COLOR}>{status}</Tag>;
